const memoryStore = new Map();

function isLocalStorageAvailable() {
  try {
    const key = '__storage_probe__';
    window.localStorage.setItem(key, 'ok');
    window.localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.warn('[safeStorage] localStorage unavailable, using in-memory fallback.', err);
    return false;
  }
}

const useLocalStorage = isLocalStorageAvailable();

export const storage = {
  getItem(key) {
    if (useLocalStorage) return window.localStorage.getItem(key);
    return memoryStore.has(key) ? memoryStore.get(key) : null;
  },

  setItem(key, value) {
    try {
      if (useLocalStorage) {
        window.localStorage.setItem(key, value);
      } else {
        memoryStore.set(key, value);
      }
    } catch (err) {
      console.error('[safeStorage] Failed to persist value for', key, err);
    }
  },

  removeItem(key) {
    if (useLocalStorage) {
      window.localStorage.removeItem(key);
    } else {
      memoryStore.delete(key);
    }
  },

  clear() {
    if (useLocalStorage) {
      window.localStorage.clear();
    } else {
      memoryStore.clear();
    }
  }
};

export function ensureStoredValue(key, fallback) {
  const existing = storage.getItem(key);
  if (existing !== null && existing !== undefined) return existing;
  if (fallback !== undefined) {
    storage.setItem(key, fallback);
  }
  return fallback ?? null;
}
