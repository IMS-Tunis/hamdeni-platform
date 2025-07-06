const SUPABASE_URL = "https://tsmzmuclrnryryuvanlxl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXptdWNscm55cnl1dmFubHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzM5NjUsImV4cCI6MjA2MzMwOTk2NX0.-l7Klmp5hKru3w2HOWLRPjCiQprJ2pOjsI-HPTGtAiw";
const client = window.supabase;

async function sendFeedback({ student_id, student_name, point_id, layer, feedback_type, comment }) {
  const payload = { student_id, student_name, point_id, layer, feedback_type, comment };
  console.log("📨 Google Sheet Payload:", payload);

  try {
    await fetch("https://script.google.com/macros/s/AKfycbxTcXrt3P0QPqZXbCo2BxQZtS5iX6C0QSz7oYB4o33JVsePa8l6FkvXwbSmKNr4OIw5/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    // Insert into Supabase
    const { error } = await client.from("a_theory_feedback").insert([{
      studentid: student_id,
      point_id,
      layer,
      feedback_type,
      comment
    }]);

    if (error) console.error("❌ Supabase Feedback Error:", error);
    else console.log("✅ Supabase Feedback Logged");
  } catch (err) {
    console.error("❌ Feedback Submission Error:", err);
  }
}