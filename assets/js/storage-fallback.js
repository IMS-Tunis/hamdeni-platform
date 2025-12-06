(function () {
  'use strict';

  const fallbackStores = {
    localStorage: new Map(),
    sessionStorage: new Map()
  };

  const warned = new Set();

  function warnOnce(storageName, error) {
    if (warned.has(storageName)) return;
    warned.add(storageName);
    console.warn(`[storage-fallback] ${storageName} unavailable, using in-memory storage.`, error);
  }

  function createSafeMethods(storageName) {
    const storage = window[storageName];
    if (!storage) return null;

    const fallback = fallbackStores[storageName];
    const original = {
      getItem: storage.getItem ? storage.getItem.bind(storage) : () => null,
      setItem: storage.setItem ? storage.setItem.bind(storage) : () => {},
      removeItem: storage.removeItem ? storage.removeItem.bind(storage) : () => {},
      clear: storage.clear ? storage.clear.bind(storage) : () => {},
      key: storage.key ? storage.key.bind(storage) : () => null
    };

    let canWrite = true;
    try {
      original.setItem('__storage_test__', 'ok');
      original.removeItem('__storage_test__');
    } catch (err) {
      canWrite = false;
      warnOnce(storageName, err);
    }

    function readFallback(key) {
      return fallback.has(key) ? fallback.get(key) : null;
    }

    function safeGetItem(key) {
      try {
        const value = original.getItem(key);
        if (value !== null && value !== undefined) return value;
      } catch (err) {
        warnOnce(storageName, err);
      }
      return readFallback(key);
    }

    function safeSetItem(key, value) {
      if (canWrite) {
        try {
          original.setItem(key, value);
          return;
        } catch (err) {
          canWrite = false;
          warnOnce(storageName, err);
        }
      }
      fallback.set(key, String(value));
    }

    function safeRemoveItem(key) {
      if (canWrite) {
        try {
          original.removeItem(key);
        } catch (err) {
          canWrite = false;
          warnOnce(storageName, err);
        }
      }
      fallback.delete(key);
    }

    function safeClear() {
      if (canWrite) {
        try {
          original.clear();
        } catch (err) {
          canWrite = false;
          warnOnce(storageName, err);
        }
      }
      fallback.clear();
    }

    function safeKey(index) {
      if (canWrite) {
        try {
          return original.key(index);
        } catch (err) {
          canWrite = false;
          warnOnce(storageName, err);
        }
      }
      return Array.from(fallback.keys())[index] ?? null;
    }

    function safeLength() {
      try {
        if (canWrite) return storage.length;
      } catch (err) {
        canWrite = false;
        warnOnce(storageName, err);
      }
      return fallback.size;
    }

    return { safeGetItem, safeSetItem, safeRemoveItem, safeClear, safeKey, safeLength };
  }

  function applySafeStorage(storageName) {
    const methods = createSafeMethods(storageName);
    if (!methods) return;
    const storage = window[storageName];

    storage.getItem = methods.safeGetItem;
    storage.setItem = methods.safeSetItem;
    storage.removeItem = methods.safeRemoveItem;
    storage.clear = methods.safeClear;
    storage.key = methods.safeKey;

    try {
      Object.defineProperty(storage, 'length', {
        get: methods.safeLength,
        configurable: true
      });
    } catch (err) {
      // Some browsers may not allow redefining length; ignore.
    }
  }

  applySafeStorage('localStorage');
  applySafeStorage('sessionStorage');
})();
