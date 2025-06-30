
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXptdWNscm55cnl1dmFubHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzM5NjUsImV4cCI6MjA2MzMwOTk2NX0.-l7Klmp5hKru3w2HOWLRPjCiQprJ2pOjsI-HPTGtAiw";
const SUPABASE_URL = "https://tsmzmuclrnyryuvanlxl.supabase.co";
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function updateTheoryProgress(pointId, layer) {
  const student_id = localStorage.getItem("student_id");
  const platform = localStorage.getItem("platform");
  const table = `${platform}_theory_progress`;
  const layerColumn = `layer${layer}_done`;

  console.log("📡 Supabase Update:", { table, pointId, layerColumn });
  const { error } = await client
    .from(table)
    .update({ [layerColumn]: true })
    .eq("studentid", student_id)
    .eq("point_id", pointId);

  if (error) console.error("❌ Supabase Error:", error);
  else console.log("✅ Supabase Updated");
}
