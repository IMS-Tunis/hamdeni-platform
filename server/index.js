const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Serve index.html on root access
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Fallback: serve requested file paths for HTML pages
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', req.url));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
