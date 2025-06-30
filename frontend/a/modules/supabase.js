
export function initializeLogin() {
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const studentLabel = document.getElementById("student-name-bar");

  const studentName = localStorage.getItem("student_name");
  if (studentName) {
    studentLabel.textContent = "Computer Science Journey progress of: " + studentName;
  }

  if (loginBtn) {
    loginBtn.onclick = () => {
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
      const url = "https://tsmzmuclrnyryuvanlxl.supabase.co/rest/v1/students?select=*&username=eq." + encodeURIComponent(username) + "&password=eq." + encodeURIComponent(password);

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
        if (data.length === 1) {
          localStorage.setItem("student_id", data[0].studentid);
          localStorage.setItem("student_name", data[0].username);
          localStorage.setItem("platform", data[0].platform);
          location.reload();
        } else {
          alert("Login failed. Check your credentials.");
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
