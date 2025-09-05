import mongoose from 'mongoose';

const HabitSchema = new mongoose.Schema({
  // Mantener clientId 
  clientId: { type: String, index: true },
  // Agregar userId para autenticación real
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  name: { type: String, required: true, trim: true },
  color: { type: String, default: '#7c3aed' },
  emoji: { type: String, default: '🔥' }
}, { timestamps: true });

// Índices compuestos para optimización
HabitSchema.index({ clientId: 1, createdAt: -1 });
HabitSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Habit', HabitSchema);
