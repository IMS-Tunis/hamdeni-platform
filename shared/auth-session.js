import { supabase } from '../supabaseClient.js';

const DASHBOARD_SEGMENTS = new Set(['a', 'as', 'igcse']);

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (err) {
    console.warn('[auth-session] Unable to read localStorage', err);
    return null;
  }
}

function safeSet(key, value) {
  if (!value) return;
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn('[auth-session] Unable to write localStorage', err);
  }
}

function hasStoredIdentity() {
  return Boolean(
    safeGet('username') ||
      safeGet('student_id') ||
      safeGet('uuid') ||
      safeGet('student_name')
  );
}

function resolveDashboardUrl() {
  const [segment] = window.location.pathname.split('/').filter(Boolean);
  if (segment && DASHBOARD_SEGMENTS.has(segment)) {
    return `/${segment}/dashboard.html`;
  }
  return '/a/dashboard.html';
}

async function fetchStudentProfile(user) {
  const candidates = [];
  if (user?.id) {
    candidates.push(['id', user.id]);
  }

  const metadata = user?.user_metadata ?? {};
  const usernameCandidate =
    metadata.username ||
    metadata.user_name ||
    metadata.name ||
    metadata.full_name ||
    user?.email;
  if (usernameCandidate) {
    candidates.push(['username', usernameCandidate]);
  }

  for (const [column, value] of candidates) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, username, platform')
        .eq(column, value)
        .maybeSingle();

      if (error) {
        if (error.code === 'PGRST116') {
          continue;
        }
        console.warn(`[auth-session] students lookup failed for ${column}:`, error);
        continue;
      }

      if (data) {
        return data;
      }
    } catch (err) {
      console.warn(`[auth-session] students lookup errored for ${column}:`, err);
    }
  }

  return null;
}

async function hydrateIdentityFromSession(session) {
  const user = session?.user;
  if (!user) return null;

  const profile = await fetchStudentProfile(user);
  const metadata = user.user_metadata ?? {};

  safeSet('uuid', user.id);

  if (profile) {
    safeSet('student_id', profile.id);
    safeSet('username', profile.username);
    safeSet('student_name', profile.username);
    safeSet('platform', profile.platform);
  } else {
    safeSet('username', metadata.username || metadata.user_name || user.email);
    safeSet('student_name', metadata.full_name || metadata.name || metadata.username || metadata.user_name);
    safeSet('platform', metadata.platform);
    safeSet('student_id', user.id);
  }

  return profile;
}

async function bootstrapAuthSession() {
  let session = null;
  let profile = null;

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn('[auth-session] getSession failed', error);
    }
    session = data?.session ?? null;
  } catch (err) {
    console.warn('[auth-session] getSession threw error', err);
  }

  if (!session && !hasStoredIdentity()) {
    window.location.href = resolveDashboardUrl();
    return { session: null, profile: null, redirected: true };
  }

  if (session) {
    profile = await hydrateIdentityFromSession(session);
  }

  window.dispatchEvent(
    new CustomEvent('auth-session-ready', {
      detail: { session, profile }
    })
  );

  return { session, profile, redirected: false };
}

const authSessionReady = bootstrapAuthSession();
window.authSessionReady = authSessionReady;

export { authSessionReady };
