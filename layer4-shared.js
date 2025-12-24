let supabaseClient = null;
let tableNameFn = null;

/**
 * Safely load the Supabase client. Some browsers block module execution when
 * CDN imports violate strict MIME or CORS policies. We fail gracefully so Layer
 * 4 content continues rendering even if persistence is unavailable.
 */
export async function ensureSupabase() {
  if (supabaseClient && tableNameFn) return { supabase: supabaseClient, tableName: tableNameFn };
  try {
    const mod = await import('./supabaseClient.js');
    supabaseClient = mod.supabase;
    tableNameFn = mod.tableName;
    return { supabase: supabaseClient, tableName: tableNameFn };
  } catch (error) {
    console.error('[layer4] Supabase client failed to load. Ready notifications are disabled.', error);
    return {};
  }
}
