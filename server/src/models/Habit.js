import mongoose from 'mongoose';
const HabitSchema = new mongoose.Schema({
  clientId: { type: String, index: true, required: true },
  name: { type: String, required: true, trim: true },
  color: { type: String, default: '#7c3aed' },
  emoji: { type: String, default: '🔥' }
}, { timestamps: true });
export default mongoose.model('Habit', HabitSchema);
