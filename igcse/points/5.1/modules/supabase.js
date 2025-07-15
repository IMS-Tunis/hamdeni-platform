const SUPABASE_URL = "https://tsmzmuclrnyryuvanlxl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXptdWNscm55cnl1dmFubHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzM5NjUsImV4cCI6MjA2MzMwOTk2NX0.-l7Klmp5hKru3w2HOWLRPjCiQprJ2pOjsI-HPTGtAiw";
const client = window.supabase;

async function updateTheoryProgress(pointId, layer) {
  const username = localStorage.getItem("username");
  const platform = localStorage.getItem("platform");
  const tables = {
    A_Level: 'a_theory_progress',
    AS_Level: 'as_theory_progress',
    IGCSE: 'igcse_theory_progress'
  };
  const table = tables[platform];
  const point_id = pointId.toLowerCase();
  console.log("📡 Supabase UPSERT:", { table, point_id, reached_layer: layer });

  const { data: existing } = await client
    .from(table)
    .select('reached_layer')
    .eq('username', username)
    .eq('point_id', point_id)
    .maybeSingle();
  const score = v => v === 'R' ? 4 : (parseInt(v, 10) || 0);
  if (score(existing?.reached_layer) < layer) {
    const { error } = await client
      .from(table)
      .upsert({
        username: username,
        point_id,
        reached_layer: String(layer)
      }, { onConflict: ['username', 'point_id'] });

    if (error) console.error("❌ Supabase Error:", error); else console.log("✅ Supabase Progress Updated");
  }
}