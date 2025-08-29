import express from "express";
const router = express.Router();
import passport from "../config/passport.js";

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    
    res.redirect("http://localhost:3000"); 
  }
);

router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).send(err);
    res.redirect("http://localhost:3000");
  });
});

export default router;
