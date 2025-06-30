
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const SUPABASE_URL = "https://tsmzmuclrnyryuvanlxl.supabase.co";
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function updateTheoryProgress(pointId, layer) {
  const student_id = localStorage.getItem("student_id");
  const platform = localStorage.getItem("platform");
  const table = `${platform}_theory_progress`;
  const layerColumn = `layer${layer}_done`;

  const { error } = await client
    .from(table)
    .update({ [layerColumn]: true })
    .eq("studentid", student_id)
    .eq("point_id", pointId);

  if (error) console.error("Supabase update error:", error);
}
