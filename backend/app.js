import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // to parse JSON bodies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/blogs', blogRoutes);

// Error handler middleware (must be last)
app.use(errorHandler);

export default app;
