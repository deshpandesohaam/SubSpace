import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import projectRoutes from "./routes/projects";
import recordingRoutes from "./routes/recordings";
import feedbackRoutes from "./routes/feedback";
import insightRoutes from "./routes/insights";

// Middleware
import { errorHandler } from "./middleware/errorHandler";
import { authenticateToken } from "./middleware/auth";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", authenticateToken, userRoutes);
app.use("/api/projects", authenticateToken, projectRoutes);
app.use("/api/recordings", authenticateToken, recordingRoutes);
app.use("/api/feedback", authenticateToken, feedbackRoutes);
app.use("/api/insights", authenticateToken, insightRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
