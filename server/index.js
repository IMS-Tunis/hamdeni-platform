const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const config = {
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  TEACHER_PASSWORD: process.env.TEACHER_PASSWORD || ''
};

app.get('/config.js', (req, res) => {
  res.type('application/javascript');
  res.send(`window.APP_CONFIG = ${JSON.stringify(config)};`);
});
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Fallback route with path normalization to prevent directory traversal
app.get('*', (req, res) => {
  const frontendRoot = path.join(__dirname, '..', 'frontend');
  const normalized = path.normalize(req.path).replace(/^\/+/, '');
  const absolutePath = path.join(frontendRoot, normalized);

  if (!absolutePath.startsWith(frontendRoot)) {
    return res.status(404).sendFile(path.join(__dirname, '..', '404.html'));
  }

  res.sendFile(absolutePath, err => {
    if (err) {
      res.status(err.statusCode === 404 ? 404 : 500).sendFile(path.join(__dirname, '..', '404.html'));
    }
  });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});