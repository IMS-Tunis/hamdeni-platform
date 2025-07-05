const fs = require('fs');
const path = require('path');

const { SUPABASE_URL, SUPABASE_KEY, TEACHER_PASSWORD } = process.env;

if (!SUPABASE_URL || !SUPABASE_KEY || !TEACHER_PASSWORD) {
  console.error('SUPABASE_URL, SUPABASE_KEY and TEACHER_PASSWORD must be set');
  process.exit(1);
}

const config = { SUPABASE_URL, SUPABASE_KEY, TEACHER_PASSWORD };
const dest = path.join(__dirname, '..', 'frontend', 'config.js');

fs.writeFileSync(dest, `window.APP_CONFIG = ${JSON.stringify(config, null, 2)};\n`);
console.log(`Config written to ${dest}`);
