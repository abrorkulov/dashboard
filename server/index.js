import 'dotenv/config';
import { createApp } from './app.js';

const port = Number(process.env.PORT) || 4000;

createApp().listen(port, () => {
  console.log(`[server] http://localhost:${port} manzilida ishga tushdi`);
  console.log(`[server] API: http://localhost:${port}/api/health`);
});
