// server/src/index.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport.js';

import habitsRoutes from './routes/habits.js';
import checkinsRoutes from './routes/checkins.js';
import aiRoutes from './routes/ai.js';
import authRoutes from './routes/auth.js';
import { errorHandler } from './middleware/requireClient.js';

dotenv.config();

const app = express();

// ===== Config base =====
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

console.log('🌍 ENV:', {
  NODE_ENV: process.env.NODE_ENV,
  FRONTEND_URL,
  MONGO: process.env.MONGODB_URI ? 'set' : 'missing',
});

// Render / proxies HTTPS -> necesario para cookies Secure
app.set('trust proxy', 1);

// ===== Middlewares =====
app.use(cors({
  origin: FRONTEND_URL,      
  credentials: true
}));

app.use(express.json());

app.use(session({
  name: 'connect.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    path: '/',
    // dominios distintos (Vercel/Render) -> SameSite None + Secure en prod
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// ===== Mongo =====
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(e => console.error('❌ Mongo:', e.message));

// ===== Rutas =====
app.get('/', (_req, res) => res.json({
  message: 'Hábitos & Rachas API',
  version: '2.0.0',
  status: 'ok',
  frontend: FRONTEND_URL,
  auth: {
    github: '/auth/github',
    status: '/auth/status'
  }
}));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/checkins', checkinsRoutes);
app.use('/api/ai', aiRoutes);

// 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Manejo de errores (tu middleware)
app.use(errorHandler);

// ===== Start =====
app.listen(PORT, () => {
  console.log(`🚀 API listening on http://localhost:${PORT}`);
  console.log(`🔐 OAuth GitHub callback: ${process.env.GITHUB_CALLBACK_URL}`);
});
