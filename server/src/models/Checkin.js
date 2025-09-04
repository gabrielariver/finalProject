import mongoose from 'mongoose';
const CheckinSchema = new mongoose.Schema({
  clientId: { type: String, index: true, required: true },
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
  day: { type: String, required: true } // YYYY-MM-DD
}, { timestamps: true });
CheckinSchema.index({ clientId: 1, habitId: 1, day: 1 }, { unique: true });
export default mongoose.model('Checkin', CheckinSchema);
