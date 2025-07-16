const SUPABASE_URL = "https://tsmzmuclrnyryuvanlxl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXptdWNscm55cnl1dmFubHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzM5NjUsImV4cCI6MjA2MzMwOTk2NX0.-l7Klmp5hKru3w2HOWLRPjCiQprJ2pOjsI-HPTGtAiw";
const client = window.supabase;

  async function sendFeedback({ username, student_name, point_id, feedback }) {
    point_id = point_id.toLowerCase();
    const payload = { username, student_name, point_id, feedback };
  console.log("📨 Google Sheet Payload:", payload);

  try {
    await fetch("https://script.google.com/macros/s/AKfycbxTcXrt3P0QPqZXbCo2BxQZtS5iX6C0QSz7oYB4o33JVsePa8l6FkvXwbSmKNr4OIw5/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    // Insert into Supabase
    const { error } = await client.from(window.tableName('theory_feedback')).upsert([{
      username: username,
      point_id,
      feedback,
      date: new Date().toISOString().split("T")[0]
    }], { onConflict: ['username', 'point_id'] });

    if (error) console.error("❌ Supabase Feedback Error:", error);
    else console.log("✅ Supabase Feedback Logged");
  } catch (err) {
    console.error("❌ Feedback Submission Error:", err);  }}