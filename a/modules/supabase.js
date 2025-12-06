import { SUPABASE_URL, SUPABASE_KEY } from '../../supabaseClient.js';

const EXPECTED_PLATFORM = 'A_Level';

export function verifyPlatform() {
  const stored = localStorage.getItem('platform');

  if (!stored) {
    console.info('[supabaseModule] Enabling guest access for', EXPECTED_PLATFORM);
    localStorage.setItem('platform', EXPECTED_PLATFORM);
    return;
  }

  if (stored !== EXPECTED_PLATFORM) {
    console.warn('[supabaseModule] Overriding stored platform for open access');
    localStorage.setItem('platform', EXPECTED_PLATFORM);
  }
}

function tableName(platform, type) {
  const map = {
    A_Level: {
      theory: 'a_theory_progress',
      programming: 'a_programming_progress'
    },
    AS_Level: {
      theory: 'as_theory_progress',
      programming: 'as_programming_progress'
    },
    IGCSE: {
      theory: 'igcse_theory_progress',
      programming: 'igcse_programming_progress'
    }
  };
  return map[platform] ? map[platform][type] : null;
}

const LAYER_WEIGHTS = Object.freeze({
  0: 0,
  1: 1,
  2: 3,
  3: 6,
  4: 10
});

function weightForLayer(value) {
  if (typeof value === 'string' && value.toUpperCase() === 'R') return 0;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return LAYER_WEIGHTS[parsed] ?? 0;
}

export async function fetchProgressCounts() {
  console.log('[supabaseModule] Fetching progress counts');
  const username = localStorage.getItem('username');
  const platform = localStorage.getItem('platform');

  if (!username || !platform) return { points: 0, levels: 0, term1Grade: 0 };

  const encodedUsername = encodeURIComponent(username);

  const theoryTable = tableName(platform, 'theory');
  const levelTable = tableName(platform, 'programming');
  const base = `${SUPABASE_URL}/rest/v1`;

  try {
    const [tRes, lRes] = await Promise.all([
      fetch(`${base}/${theoryTable}?select=reached_layer&username=eq.${encodedUsername}`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: 'Bearer ' + SUPABASE_KEY
        }
      }),
      fetch(`${base}/${levelTable}?select=${platform === 'A_Level' ? 'reached_level' : 'level_done'}&username=eq.${encodedUsername}`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: 'Bearer ' + SUPABASE_KEY
        }
      })
    ]);

    const tData = await tRes.json();
    const lData = await lRes.json();

    const passedPoints = tData.filter(r => String(r.reached_layer) === '4').length;
    const rawGrade = tData.reduce(
      (total, record) => total + weightForLayer(record.reached_layer),
      0
    );
    const term1Grade = Math.max(0, rawGrade - 1);
    let passedLevels = 0;
    if (platform === 'A_Level') {
      passedLevels = lData.length ? lData[0].reached_level : 0;
    } else {
      passedLevels = lData.filter(r => r.level_done).length;
    }
    const result = { points: passedPoints, levels: passedLevels, term1Grade };
    console.log('[supabaseModule] Progress counts', result);
    return result;
  } catch (err) {
    console.error('❌ Failed fetching progress counts:', err);
    return { points: 0, levels: 0, term1Grade: 0 };
  }
}

export function initializeLogin() {
  console.log('[supabaseModule] Initializing login handlers');
  verifyPlatform();
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const studentLabel = document.getElementById("student-name-bar");

  const studentName = localStorage.getItem("student_name");
  if (studentName) {
    studentLabel.textContent = "Computer Science Journey progress of: " + studentName;
  } else if (studentLabel) {
    studentLabel.textContent = "Guest access enabled – no login required";
    localStorage.setItem('platform', EXPECTED_PLATFORM);
  }

  if (loginBtn) {
    loginBtn.onclick = () => {
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      const url = `${SUPABASE_URL}/rest/v1/students?select=*&username=eq.${encodeURIComponent(username)}&password=eq.${encodeURIComponent(password)}`;

      console.log("🔍 Sending login request to Supabase:", url);

      fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: "Bearer " + SUPABASE_KEY
        }
      })
      .then(res => res.json())
      .then(data => {
        console.log("📦 Supabase response:", data);
        if (data.length === 1 && data[0].platform === EXPECTED_PLATFORM) {
          localStorage.setItem('username', data[0].username);
          localStorage.setItem('student_name', data[0].username);
          localStorage.setItem('platform', data[0].platform);
          localStorage.setItem('student_id', data[0].id);
          console.log('[supabaseModule] Login successful for', data[0].username);
          location.reload();
        } else if (data.length === 1) {
          alert(`Please log in through the ${data[0].platform} dashboard.`);
          console.warn('[supabaseModule] Login blocked for', username);
        } else {
          alert("Login failed. Check your credentials.");
          console.warn('[supabaseModule] Login failed for', username);
        }
      })
      .catch(error => {
        console.error("❌ Supabase fetch error:", error);
        alert("Connection to Supabase failed. Check console for details.");
      });
    };
  }

  if (logoutBtn) {
    logoutBtn.onclick = () => {
      localStorage.clear();
      location.reload();
    };
  }
}
