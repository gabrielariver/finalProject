import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  githubId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    default: "Usuario"
  },
  email: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: null
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
