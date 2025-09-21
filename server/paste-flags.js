export function normalizeEntries(input) {
  if (!input) return new Map();
  if (input instanceof Map) return new Map(input);
  if (Array.isArray(input)) return new Map(input);
  if (typeof input[Symbol.iterator] === 'function') {
    return new Map(input);
  }
  if (typeof input === 'object') {
    return new Map(Object.entries(input));
  }
  return new Map();
}

export function applyPasteFlags(input) {
  const entries = normalizeEntries(input);
  const data = {};
  const flags = {};
  const attempted = [];

  for (const [key, value] of entries) {
    if (key.endsWith('__cp')) continue;
    data[key] = value;
    const flagKey = key + '__cp';
    const flagged = entries.has(flagKey) && entries.get(flagKey) !== '';
    if (flagged) {
      flags[key] = '[CP]';
      attempted.push(key);
    } else {
      flags[key] = '';
    }
  }

  return { data, flags, attempted };
}
