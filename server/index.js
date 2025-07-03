const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const config = {
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_KEY: process.env.SUPABASE_KEY || '',
  TEACHER_PASSWORD: process.env.TEACHER_PASSWORD || ''
};

app.get('/config.js', (req, res) => {
  res.type('application/javascript');
  res.send(`window.APP_CONFIG = ${JSON.stringify(config)};`);
});
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', req.url));
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});