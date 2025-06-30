
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

      fetch("https://tsmzmuclrnyryuvanlxl.supabase.co/rest/v1/students?select=*&username=eq." + username + "&password=eq." + password, {
        headers: {
          apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.length === 1) {
          localStorage.setItem("student_id", data[0].studentid);
          localStorage.setItem("student_name", data[0].username);  // ✅ FIXED
          localStorage.setItem("platform", data[0].platform);
          location.reload();
        } else {
          alert("Login failed. Check your credentials.");
        }
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
