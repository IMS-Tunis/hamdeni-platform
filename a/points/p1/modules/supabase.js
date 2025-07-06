const { SUPABASE_URL, SUPABASE_KEY } = window.APP_CONFIG;
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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