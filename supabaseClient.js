const SUPABASE_MODULE_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const LOG_PREFIX = '[supabaseClient]';
console.log(`${LOG_PREFIX} Loading Supabase client module`);

export const SUPABASE_URL = "https://tsmzmuclrnyryuvanlxl.supabase.co";
export const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXptdWNscm55cnl1dmFubHhsIiwiY3VycmVudF9zY2hlbWUiOiJodHRwcyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzQ3NzMzOTY1LCJleHAiOjIwNjMzMDk5NjV9.-l7Klmp5hKru3w2HOWLRPjCiQprJ2pOjsI-HPTGtAiw";

const QUERY_METHODS = [
  'select',
  'insert',
  'update',
  'upsert',
  'delete',
  'single',
  'maybeSingle',
  'eq',
  'order',
  'limit',
  'in',
  'ilike'
];

function buildUnavailableError(message) {
  const error = new Error(message);
  error.name = 'SupabaseUnavailableError';
  return error;
}

function createQueryBuilderExecutor(getClientPromise, message, initialOperation) {
  const operations = [initialOperation];

  const executeOperations = () =>
    getClientPromise().then(client => {
      if (!client || client.__supabaseUnavailable) {
        throw buildUnavailableError(client?.__supabaseErrorMessage || message);
      }

      let query = client;
      for (const operation of operations) {
        if (operation.type === 'from') {
          query = client.from(...operation.args);
          continue;
        }

        const fn = query?.[operation.name];
        if (typeof fn !== 'function') {
          throw new Error(`Supabase method ${operation.name} is not available on the current query builder.`);
        }
        query = fn.apply(query, operation.args);
      }

      return query;
    });

  const builder = {};

  for (const method of QUERY_METHODS) {
    builder[method] = (...args) => {
      operations.push({ type: 'method', name: method, args });
      return builder;
    };
  }

  builder.then = (onFulfilled, onRejected) =>
    executeOperations().then(
      result => {
        if (result && typeof result.then === 'function') {
          return result.then(onFulfilled, onRejected);
        }
        return Promise.resolve(result).then(onFulfilled, onRejected);
      },
      onRejected
    );

  builder.catch = onRejected => builder.then(undefined, onRejected);

  builder.finally = onFinally =>
    builder.then(
      value => Promise.resolve(onFinally?.()).then(() => value),
      error =>
        Promise.resolve(onFinally?.()).then(() => {
          throw error;
        })
    );

  return builder;
}

function createDeferredClient(message, getClientPromise) {
  const authCall = (method, args, fallbackFactory) =>
    getClientPromise()
      .then(client => {
        if (!client || client.__supabaseUnavailable) {
          throw buildUnavailableError(client?.__supabaseErrorMessage || message);
        }

        const auth = client.auth;
        const fn = auth?.[method];
        if (typeof fn !== 'function') {
          throw new Error(`Supabase auth method ${method} is not available.`);
        }
        return fn.apply(auth, args);
      })
      .catch(error => {
        if (error?.name !== 'SupabaseUnavailableError') {
          throw error;
        }

        const fallback = fallbackFactory ? fallbackFactory() : {};
        fallback.error = error;
        return fallback;
      });

  return {
    __supabaseDeferred: true,
    from(...args) {
      return createQueryBuilderExecutor(getClientPromise, message, {
        type: 'from',
        args
      });
    },
    auth: {
      onAuthStateChange(...args) {
        return authCall(
          'onAuthStateChange',
          args,
          () => ({ data: { subscription: { unsubscribe() {} } } })
        );
      },
      getSession() {
        return authCall('getSession', [], () => ({ data: null }));
      },
      signInWithPassword(credentials) {
        return authCall('signInWithPassword', [credentials], () => ({ data: null }));
      },
      signOut() {
        return authCall('signOut', [], () => ({}));
      }
    }
  };
}

function createUnavailableClient(message) {
  const buildError = () => buildUnavailableError(message);

  const rejected = async () => ({ data: null, error: buildError() });

  const createQueryBuilder = () => {
    const builder = {};

    for (const method of QUERY_METHODS) {
      builder[method] = () => builder;
    }

    builder.then = (onFulfilled, onRejected) =>
      Promise.reject(buildError()).then(onFulfilled, onRejected);
    builder.catch = onRejected => builder.then(undefined, onRejected);
    builder.finally = onFinally =>
      builder.then(
        value => Promise.resolve(onFinally?.()).then(() => value),
        error =>
          Promise.resolve(onFinally?.()).then(() => {
            throw error;
          })
      );

    return builder;
  };

  const queryBuilderFactory = () => createQueryBuilder();

  return {
    __supabaseUnavailable: true,
    __supabaseErrorMessage: message,
    from() {
      return queryBuilderFactory();
    },
    auth: {
      onAuthStateChange() {
        return {
          data: { subscription: { unsubscribe() {} } },
          error: buildError()
        };
      },
      getSession: rejected,
      signInWithPassword: rejected,
      signOut: rejected
    }
  };
}

let supabaseReadyResolve;
let supabaseReadyResolved = false;
const supabaseReadyPromise = new Promise(resolve => {
  supabaseReadyResolve = resolve;
});

let supabaseInstance = createDeferredClient('Supabase client is still initialising.', () => supabaseReadyPromise);

function updateSupabaseInstance(instance) {
  supabaseInstance = instance;
  if (typeof window !== 'undefined') {
    window.supabase = instance;
  }
  if (!supabaseReadyResolved) {
    supabaseReadyResolved = true;
    supabaseReadyResolve(instance);
  }
}

export const supabase = new Proxy(
  {},
  {
    get(_target, prop, receiver) {
      const value = Reflect.get(supabaseInstance, prop, receiver);
      if (typeof value === 'function') {
        return value.bind(supabaseInstance);
      }
      return value;
    },
    has(_target, prop) {
      return prop in supabaseInstance;
    },
    ownKeys() {
      return Reflect.ownKeys(supabaseInstance);
    },
    getOwnPropertyDescriptor(_target, prop) {
      const descriptor = Object.getOwnPropertyDescriptor(supabaseInstance, prop);
      if (descriptor) {
        descriptor.configurable = true;
      }
      return descriptor;
    }
  }
);

if (typeof window !== 'undefined') {
  window.supabase = supabase;
}

if (typeof window === 'undefined') {
  updateSupabaseInstance(
    createUnavailableClient('Supabase client is not available in this environment.')
  );
} else {
  import(SUPABASE_MODULE_URL)
    .then(({ createClient }) => {
      console.log(`${LOG_PREFIX} Creating client with URL:`, SUPABASE_URL);
      const client = createClient(SUPABASE_URL, SUPABASE_KEY, {
        global: {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`
          }
        }
      });
      updateSupabaseInstance(client);
    })
    .catch(error => {
      console.error(
        `${LOG_PREFIX} Failed to load Supabase client from ${SUPABASE_MODULE_URL}. Falling back to a null client.`,
        error
      );
      updateSupabaseInstance(
        createUnavailableClient('Failed to load Supabase client. Please try again later.')
      );
    });
}

export function whenSupabaseReady() {
  return supabaseReadyPromise;
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
