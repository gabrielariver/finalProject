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

// Middleware básico
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  credentials: true  // Importante para cookies de sesión
}));
app.use(express.json({ limit: '10mb' }));

// Configuración de sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'habitos-app-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS en producción
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/habitos-app')
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(e => console.error('❌ Mongo:', e.message));

// Rutas
app.get('/', (_, res) => res.json({ 
  message: 'Hábitos & Rachas API', 
  version: '2.0.0',
  status: 'ok',
  features: ['OAuth GitHub', 'AI Suggestions', 'Statistics'],
  auth: {
    github: '/auth/github',
    status: '/auth/status'
  }
}));

app.use('/auth', authRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/checkins', checkinsRoutes);
app.use('/api/ai', aiRoutes);

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    message: `Route ${req.originalUrl} not found` 
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 API http://localhost:${PORT}`);
  console.log(`🔐 GitHub OAuth: http://localhost:${PORT}/auth/github`);
});
