
async function sendFeedback({ student_id, student_name, point_id, layer, feedback_type, comment }) {
  const payload = {
    student_id,
    student_name,
    point_id,
    layer,
    feedback_type,
    comment
  };
  console.log("📨 Sending feedback to Google Sheet:", payload);

  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbxTcXrt3P0QPqZXbCo2BxQZtS5iX6C0QSz7oYB4o33JVsePa8l6FkvXwbSmKNr4OIw5/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    console.log("✅ Google Sheet feedback success:", result);
  } catch (err) {
    console.error("❌ Google Sheet feedback error:", err);
  }
}
