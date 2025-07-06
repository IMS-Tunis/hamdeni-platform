const SUPABASE_URL = "https://tsmzmuclrnryryuvanlxl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXptdWNscm55cnl1dmFubHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzM5NjUsImV4cCI6MjA2MzMwOTk2NX0.-l7Klmp5hKru3w2HOWLRPjCiQprJ2pOjsI-HPTGtAiw";
const client = window.supabase;

async function updateTheoryProgress(pointId, layer) {
  const student_id = localStorage.getItem("student_id");
  const platform = localStorage.getItem("platform");
  const table = `${platform}_theory_progress`;
  const layerColumn = `layer${layer}_done`;

  console.log("📡 Supabase UPSERT:", { table, pointId, layerColumn });

  const { error } = await client
    .from(table)
    .upsert({
      studentid: student_id,
      point_id: pointId,
      [layerColumn]: true
    }, { onConflict: ['studentid', 'point_id'] });

  if (error) console.error("❌ Supabase Error:", error);
  else console.log("✅ Supabase Progress Updated");
}