const SUPABASE_MODULE_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const LOG_PREFIX = '[supabaseClient]';
console.log(`${LOG_PREFIX} Loading Supabase client module`);

export const SUPABASE_URL = "https://tsmzmuclrnyryuvanlxl.supabase.co";
export const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXptdWNscm55cnl1dmFubHhsIiwiY3VycmVudF9zY2hlbWUiOiJodHRwcyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzQ3NzMzOTY1LCJleHAiOjIwNjMzMDk5NjV9.-l7Klmp5hKru3w2HOWLRPjCiQprJ2pOjsI-HPTGtAiw";

function createUnavailableClient(message) {
  const buildError = () => {
    const error = new Error(message);
    error.name = 'SupabaseUnavailableError';
    return error;
  };

  const rejected = async () => ({ data: null, error: buildError() });

  const createQueryBuilder = () => {
    const builder = {
      select() {
        return builder;
      },
      insert() {
        return builder;
      },
      update() {
        return builder;
      },
      upsert() {
        return builder;
      },
      delete() {
        return builder;
      },
      single() {
        return builder;
      },
      maybeSingle() {
        return builder;
      },
      eq() {
        return builder;
      },
      order() {
        return builder;
      },
      limit() {
        return builder;
      },
      in() {
        return builder;
      },
      ilike() {
        return builder;
      },
      then(onFulfilled, onRejected) {
        return rejected().then(onFulfilled, onRejected);
      },
      catch(onRejected) {
        return rejected().catch(onRejected);
      },
      finally(onFinally) {
        return rejected().finally(onFinally);
      }
    };
    return builder;
  };

  return {
    from() {
      return createQueryBuilder();
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

let supabaseInstance = createUnavailableClient('Supabase client is still initialising.');
let supabaseReadyResolve;
let supabaseReadyResolved = false;
const supabaseReadyPromise = new Promise(resolve => {
  supabaseReadyResolve = resolve;
});

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
