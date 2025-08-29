import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import session from "express-session";
import passport from "./config/passport.js";

import authRoutes from "./routes/auth.js";
import habitsRoutes from "./routes/habits.js";
import checkinsRoutes from "./routes/checkins.js";
import meRoutes from "./routes/me.js";

dotenv.config();
const app = express();

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || "keyboard cat",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000 
})
.then(() => console.log("MongoAtlas OK"))
.catch(err => console.error("Error al conectar MongoAtlas:", err));

app.use("/auth", authRoutes);
app.use("/api/habits", habitsRoutes);
app.use("/api/checkins", checkinsRoutes);
app.use("/api/me", meRoutes);

app.get("/dashboard", (req, res) => {
  if (!req.user) return res.redirect("/");
  res.send(`Hola ${req.user.username}, estás logueado!`);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

console.log("MONGO_URI:", process.env.MONGO_URI);