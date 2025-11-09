import express from 'express';
import ENV from './config/env.config.js';
import { fromNodeHeaders, toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import { auth } from './lib/auth.js';

const app = express();
const PORT = ENV.PORT || 8080;

// Enable CORS
app.use(
  cors({
    origin: ENV.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

// Route handler for Better Auth endpoints
app.all('/api/auth/*splat', toNodeHandler(auth));

// Parse JSON request bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from VedaCLI API');
});

app.get('/api/me', async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

app.get('/device', async (req, res) => {
  const { user_code } = req.query;
  res.redirect(`${ENV.FRONTEND_URL}/device?user_code=${user_code}`);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
