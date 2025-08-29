import mongoose from "mongoose";

const CheckinSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  habit: { type: mongoose.Schema.Types.ObjectId, ref: "Habit", required: true },
  date: { type: String, required: true } 
});


CheckinSchema.index({ user: 1, habit: 1, date: 1 }, { unique: true });

export default mongoose.model("Checkin", CheckinSchema);
