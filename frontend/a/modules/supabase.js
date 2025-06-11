
const SUPABASE_URL = "https://tsmzmuclrnyryuvanlxl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXptdWNscm55cnl1dmFubHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzM5NjUsImV4cCI6MjA2MzMwOTk2NX0.-l7Klmp5hKru3w2HOWLRPjCiQprJ2pOjsI-HPTGtAiw";

export function getCurrentStudent() {
  return localStorage.getItem("studentId");
}

export function logout() {
  localStorage.removeItem("studentId");
  location.reload();
}

export async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch(`${SUPABASE_URL}/rest/v1/students?select=*`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY
    }
  });

  const users = await res.json();
  const match = users.find(u => u.username === username && u.password === password);

  if (match) {
    localStorage.setItem("studentId", username);
    location.reload();
  } else {
    alert("Invalid credentials");
  }
}

export async function fetchTheoryProgress(studentId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/a_theory_progress?studentid=eq.${studentId}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY
    }
  });
  return await res.json();
}

export async function fetchProgrammingProgress(studentId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/a_programming_progress?studentid=eq.${studentId}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY
    }
  });
  return await res.json();
}
