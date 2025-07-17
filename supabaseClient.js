import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

console.log('[supabaseClient] Loading Supabase client module');

export const SUPABASE_URL = "https://tsmzmuclrnyryuvanlxl.supabase.co";
export const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXptdWNscm55cnl1dmFubHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzM5NjUsImV4cCI6MjA2MzMwOTk2NX0.-l7Klmp5hKru3w2HOWLRPjCiQprJ2pOjsI-HPTGtAiw";

console.log('[supabaseClient] Creating client with URL:', SUPABASE_URL);
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  global: {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  }
});

export function tableName(base) {
  const platform = localStorage.getItem('platform');
  const prefix = {
    A_Level: 'a_',
    AS_Level: 'as_',
    IGCSE: 'igcse_'
  }[platform] || 'a_';
  return `${prefix}${base}`;
}

// expose helper for non-module scripts
window.tableName = tableName;

window.addEventListener('error', e => {
  console.error('[Global Error]', e.message, e.error);
});

window.addEventListener('unhandledrejection', e => {
  console.error('[Unhandled Promise Rejection]', e.reason);
});
