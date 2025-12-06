import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { SUPABASE_URL, SUPABASE_KEY } from './supabaseConfig.js';

console.log('[supabaseClient] Loading Supabase client module');

console.log('[supabaseClient] Creating client with URL:', SUPABASE_URL);
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  global: {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  }
});

export { SUPABASE_URL, SUPABASE_KEY };

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
window.tableName = tableName;

window.addEventListener('error', e => {
  console.error('[Global Error]', e.message, e.error);
});

window.addEventListener('unhandledrejection', e => {
  console.error('[Unhandled Promise Rejection]', e.reason);
});
