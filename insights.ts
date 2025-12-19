import express from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth";
import { generateInsight } from "../services/aiService";

const router = express.Router();
const prisma = new PrismaClient();

// Get all insights
router.get("/", async (req: AuthRequest, res, next) => {
  try {
    const { projectId, recordingId, type } = req.query;

    const insights = await prisma.insight.findMany({
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

    res.json(insights);
  } catch (error) {
    next(error);
  }
});

// Get single insight
router.get("/:id", async (req: AuthRequest, res, next) => {
  try {
    const insight = await prisma.insight.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
      include: {
        project: true,
        recording: true,
      },
    });

    if (!insight) {
      return res.status(404).json({ error: "Insight not found" });
    }

    res.json(insight);
  } catch (error) {
    next(error);
  }
});

// Generate insight
router.post("/generate", async (req: AuthRequest, res, next) => {
  try {
    const { recordingId, projectId, type, content } = req.body;

    if (!content && !recordingId) {
      return res
        .status(400)
        .json({ error: "Content or recording ID is required" });
    }

    // Get recording if provided
    let recordingContent = content;
    if (recordingId) {
      const recording = await prisma.recording.findFirst({
        where: {
          id: recordingId,
          userId: req.userId,
        },
      });

      if (!recording) {
        return res.status(404).json({ error: "Recording not found" });
      }

      recordingContent = recording.description || recording.title;
    }

    // Generate insight using AI service
    const insightData = await generateInsight(
      recordingContent,
      type || "SUMMARY"
    );

    // Save insight
    const insight = await prisma.insight.create({
      data: {
        title: insightData.title,
        content: insightData.content,
        type: type || "SUMMARY",
        metadata: insightData.metadata || null,
        userId: req.userId!,
        projectId: projectId || null,
        recordingId: recordingId || null,
      },
    });

    res.status(201).json(insight);
  } catch (error) {
    next(error);
  }
});

// Delete insight
router.delete("/:id", async (req: AuthRequest, res, next) => {
  try {
    const insight = await prisma.insight.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!insight) {
      return res.status(404).json({ error: "Insight not found" });
    }

    await prisma.insight.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Insight deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
