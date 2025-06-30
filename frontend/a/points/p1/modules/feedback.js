
async function sendFeedback({ student_id, student_name, point_id, layer, feedback_type, comment }) {
  await fetch("https://script.google.com/macros/s/AKfycbxTcXrt3P0QPqZXbCo2BxQZtS5iX6C0QSz7oYB4o33JVsePa8l6FkvXwbSmKNr4OIw5/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id, student_name, point_id, layer, feedback_type, comment })
  });
}
