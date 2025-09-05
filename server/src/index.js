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

// Lista de orígenes permitidos (prod + previews + local)
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:5173',
  /\.vercel\.app$/ 
];

// CORS dinámico
const corsOptions = {
  origin(origin, cb) {
    // peticiones server-to-server o curl pueden venir sin origin
    if (!origin) return cb(null, true);

    const ok = allowedOrigins.some(rule =>
      rule instanceof RegExp ? rule.test(origin) : rule === origin
    );
    return ok ? cb(null, true) : cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true
};


app.set('trust proxy', 1);

// ===== Middlewares =====
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

app.use(session({
  name: 'connect.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    path: '/',
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
  auth: { github: '/auth/github', status: '/auth/status' }
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

// Manejo de errores
app.use(errorHandler);

// ===== Start =====
app.listen(PORT, () => {
  console.log(`🚀 API listening on http://localhost:${PORT}`);
  console.log(`🌍 FRONTEND_URL: ${FRONTEND_URL}`);
  console.log(`🔐 OAuth GitHub callback: ${process.env.GITHUB_CALLBACK_URL}`);
});
