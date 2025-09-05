import mongoose from 'mongoose';

const CheckinSchema = new mongoose.Schema({
  // Mantener clientId para compatibilidad
  clientId: { type: String, index: true },
  // Agregar userId para autenticación real
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
  day: { type: String, required: true } // Formato 'YYYY-MM-DD'
}, { timestamps: true });

// Índices únicos para prevenir duplicados
CheckinSchema.index({ clientId: 1, habitId: 1, day: 1 }, { unique: true, sparse: true });
CheckinSchema.index({ userId: 1, habitId: 1, day: 1 }, { unique: true, sparse: true });

export default mongoose.model('Checkin', CheckinSchema);
