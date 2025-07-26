// routes/userRoutes.js
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", verifyToken, async (req, res) => {
  res.json({
    message: "User profile",
    user: req.user,
  });
});

export default router;
