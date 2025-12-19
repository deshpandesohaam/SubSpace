import express from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth";
import { feedbackSchema } from "../utils/validation";

const router = express.Router();
const prisma = new PrismaClient();

// Get all feedback
router.get("/", async (req: AuthRequest, res, next) => {
  try {
    const { projectId, recordingId, type } = req.query;

    const feedback = await prisma.feedback.findMany({
      where: {
        userId: req.userId,
        ...(projectId && { projectId: projectId as string }),
        ...(recordingId && { recordingId: recordingId as string }),
        ...(type && { type: type as any }),
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        recording: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(feedback);
  } catch (error) {
    next(error);
  }
});

// Get single feedback
router.get("/:id", async (req: AuthRequest, res, next) => {
  try {
    const feedback = await prisma.feedback.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
      include: {
        project: true,
        recording: true,
      },
    });

    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.json(feedback);
  } catch (error) {
    next(error);
  }
});

// Create feedback
router.post("/", async (req: AuthRequest, res, next) => {
  try {
    const validated = feedbackSchema.parse(req.body);
    const { content, type, rating, projectId, recordingId } = validated;

    const feedback = await prisma.feedback.create({
      data: {
        content,
        type,
        rating: rating || null,
        projectId: projectId || null,
        recordingId: recordingId || null,
        userId: req.userId!,
      },
    });

    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
});

// Update feedback
router.put("/:id", async (req: AuthRequest, res, next) => {
  try {
    const { content, rating } = req.body;

    const feedback = await prisma.feedback.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    const updated = await prisma.feedback.update({
      where: { id: req.params.id },
      data: {
        ...(content && { content }),
        ...(rating !== undefined && { rating }),
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Delete feedback
router.delete("/:id", async (req: AuthRequest, res, next) => {
  try {
    const feedback = await prisma.feedback.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    await prisma.feedback.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
