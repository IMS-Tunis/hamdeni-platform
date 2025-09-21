import { createServer } from './app.js';

const port = Number(process.env.PORT) || 3000;
const server = createServer();
server.listen(port, () => {
  console.log(`Paste Guard server listening on http://localhost:${port}`);
});
