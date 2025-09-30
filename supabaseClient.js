const SUPABASE_MODULE_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

console.log('[supabaseClient] Loading Supabase client module');

let createClient;
if (typeof window !== 'undefined') {
  try {
    ({ createClient } = await import(SUPABASE_MODULE_URL));
  } catch (error) {
    console.error(
      `[supabaseClient] Failed to load Supabase client from ${SUPABASE_MODULE_URL}. Falling back to null client.`,
      error
    );
    createClient = () => null;
  }
} else {
  createClient = () => ({
    from() {
      throw new Error('Supabase client is not available in this environment.');
    }
  });
}

export const SUPABASE_URL = "https://tsmzmuclrnyryuvanlxl.supabase.co";
export const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXptdWNscm55cnl1dmFubHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzM5NjUsImV4cCI6MjA2MzMwOTk2NX0.-l7Klmp5hKru3w2HOWLRPjCiQprJ2pOjsI-HPTGtAiw";

console.log('[supabaseClient] Creating client with URL:', SUPABASE_URL);
export const supabase = typeof window !== 'undefined'
  ? createClient && createClient(SUPABASE_URL, SUPABASE_KEY, {
      global: {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    })
  : null;

if (typeof window !== 'undefined') {
  window.supabase = supabase;
}

export function tableName(base) {
  const platform = localStorage.getItem('platform');
  const prefixMap = {
    A_Level: 'a_',
    AS_Level: 'as_',
    IGCSE: 'igcse_'
  };
  const prefix = prefixMap[platform];
  if (!prefix) {
    alert('Unable to determine platform. Please select a platform before saving.');
    throw new Error('Unknown platform: ' + platform);
  }
  return `${prefix}${base}`;
}

// expose helper for non-module scripts
if (typeof window !== 'undefined') {
  window.tableName = tableName;

  window.addEventListener('error', e => {
    console.error('[Global Error]', e.message, e.error);
  });

  window.addEventListener('unhandledrejection', e => {
    console.error('[Unhandled Promise Rejection]', e.reason);
  });
}
