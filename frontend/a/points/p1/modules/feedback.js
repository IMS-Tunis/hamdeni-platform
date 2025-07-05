const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.APP_CONFIG;
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
