import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  githubId: { type: String, required: true }, 
  username: { type: String, required: true }, 
  email: { type: String }, 
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
