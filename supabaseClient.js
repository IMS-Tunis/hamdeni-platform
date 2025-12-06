import { storage } from './shared/safeStorage.js';

console.log('[supabaseClient] Loading Supabase client module');

export const SUPABASE_URL = "https://tsmzmuclrnyryuvanlxl.supabase.co";
export const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXptdWNscm55cnl1dmFubHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MzM5NjUsImV4cCI6MjA2MzMwOTk2NX0.-l7Klmp5hKru3w2HOWLRPjCiQprJ2pOjsI-HPTGtAiw";

function createFallbackQuery() {
  const returnSelf = () => fallbackQuery;
  const returnRejected = method => (...args) => {
    console.warn(`[supabaseClient] Supabase unavailable. '${method}' called with`, args);
    return Promise.resolve({ data: null, error: new Error('Supabase client unavailable') });
  };

  const fallbackQuery = {
    select: returnRejected('select'),
    insert: returnRejected('insert'),
    update: returnRejected('update'),
    upsert: returnRejected('upsert'),
    delete: returnRejected('delete'),
    maybeSingle: returnRejected('maybeSingle'),
    single: returnRejected('single'),
    eq: returnSelf,
    order: returnSelf,
    limit: returnSelf
  };

  return fallbackQuery;
}

function createFallbackClient() {
  const query = createFallbackQuery();
  return {
    from() {
      console.warn('[supabaseClient] Supabase unavailable. All queries are no-ops.');
      return query;
    }
  };
}

let supabase = createFallbackClient();

try {
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
  console.log('[supabaseClient] Creating client with URL:', SUPABASE_URL);
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
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
} catch (err) {
  console.error('[supabaseClient] Failed to load Supabase client from CDN. Falling back to a no-op client.', err);
}

// Expose the client (or fallback) for pages that rely on the global handle.
if (typeof window !== 'undefined') {
  window.supabase = supabase;
}

export { supabase };

export function tableName(base) {
  const platform = storage.getItem('platform');
  const prefixMap = {
    A_Level: 'a_',
    AS_Level: 'as_',
    IGCSE: 'igcse_'
  };
  const prefix = prefixMap[platform];
  if (!prefix) {
    console.warn('[supabaseClient] Missing platform in localStorage, defaulting to base table', base);
    return base;
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
