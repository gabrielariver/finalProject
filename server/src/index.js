import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import habitsRoutes from './routes/habits.js';
import checkinsRoutes from './routes/checkins.js';

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: false }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(()=>console.log('✅ MongoDB conectado'))
  .catch(e=>console.error('❌ Mongo:', e.message));

app.get('/', (_,res)=>res.send('API ok'));
app.use('/api/habits', habitsRoutes);
app.use('/api/checkins', checkinsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`🚀 API http://localhost:${PORT}`));
