const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.post('/api/login', (req, res) => {
  const password = req.body.password || '';
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  const storedHash = process.env.TEACHER_PASSWORD_HASH || '';

  if (
    storedHash.length === hash.length &&
    crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash))
  ) {
    const token = crypto.randomBytes(20).toString('hex');
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', req.url));
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});