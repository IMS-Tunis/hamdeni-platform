// Wait for the SDK to be ready
window.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://tsmzmuclrnyryuvanlxl.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXptdWNscm55cnl1dmFubHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzM5NjUsImV4cCI6MjA2MzMwOTk2NX0.-l7Klmp5hKru3w2HOWLRPjCiQprJ2pOjsI-HPTGtAiw";

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const urlParams = new URLSearchParams(window.location.search);
  const platform = urlParams.get("platform");

  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const { data: students, error } = await supabase
      .from("students")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .eq("platform", platform);

    if (error) {
      console.error("Supabase error:", error);
      alert("An error occurred while logging in.");
      return;
    }

    if (students.length > 0) {
      const student = students[0];
    localStorage.setItem("studentid", student.studentid);
      localStorage.setItem("platform", student.platform);
      window.location.href = `${platform}/dashboard.html`;
    } else {
      alert("Invalid credentials");
    }
  });
});
