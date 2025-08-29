import mongoose from "mongoose";

const HabitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  emoji: { type: String },
  color: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Habit", HabitSchema);
