
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const SUPABASE_URL = "https://tsmzmuclrnyryuvanlxl.supabase.co";
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function updateTheoryProgress(pointId, layer) {
  const student_id = localStorage.getItem("student_id");
  const platform = localStorage.getItem("platform");
  const table = `${platform}_theory_progress`;
  const layerColumn = `layer${layer}_done`;

  console.log("📡 Supabase Update:", { table, pointId, layerColumn });

  // Try to update first
  let { data, error } = await client
    .from(table)
    .update({ [layerColumn]: true })
    .eq("studentid", student_id)
    .eq("point_id", pointId);

  if (error) {
    console.warn("⚠️ Update failed. Trying UPSERT...");

    // Try insert (UPSERT)
    const insertData = {
      studentid: student_id,
      point_id: pointId,
      layer1_done: false,
      layer2_done: false,
      layer3_done: false,
      layer4_done: false,
      [layerColumn]: true
    };

    const { error: insertError } = await client
      .from(table)
      .upsert(insertData, { onConflict: ['studentid', 'point_id'] });

    if (insertError) {
      console.error("❌ Supabase Insert Error:", insertError);
    } else {
      console.log("✅ Supabase Inserted (UPSERT)");
    }
  } else {
    console.log("✅ Supabase Updated");
  }
}
