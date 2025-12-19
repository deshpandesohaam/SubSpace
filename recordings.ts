import express from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// Get all recordings
router.get("/", async (req: AuthRequest, res, next) => {
  try {
    const { projectId } = req.query;

    const recordings = await prisma.recording.findMany({
      where: {
        userId: req.userId,
        ...(projectId && { projectId: projectId as string }),
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            feedback: true,
            insights: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(recordings);
  } catch (error) {
    next(error);
  }
});

// Get single recording
router.get("/:id", async (req: AuthRequest, res, next) => {
  try {
    const recording = await prisma.recording.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
      include: {
        project: true,
        feedback: {
          orderBy: { createdAt: "desc" },
        },
        insights: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!recording) {
      return res.status(404).json({ error: "Recording not found" });
    }

    res.json(recording);
  } catch (error) {
    next(error);
  }
});

// Create recording
router.post("/", async (req: AuthRequest, res, next) => {
  try {
    const {
      title,
      description,
      projectId,
      fileUrl,
      thumbnailUrl,
      duration,
      metadata,
    } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    const recording = await prisma.recording.create({
      data: {
        title,
        description: description || null,
        fileUrl: fileUrl || null,
        thumbnailUrl: thumbnailUrl || null,
        duration: duration || null,
        metadata: metadata || null,
        projectId,
        userId: req.userId!,
        status: "PENDING",
      },
    });

    res.status(201).json(recording);
  } catch (error) {
    next(error);
  }
});

// Update recording
router.put("/:id", async (req: AuthRequest, res, next) => {
  try {
    const {
      title,
      description,
      status,
      fileUrl,
      thumbnailUrl,
      duration,
      metadata,
    } = req.body;

    const recording = await prisma.recording.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!recording) {
      return res.status(404).json({ error: "Recording not found" });
    }

    const updated = await prisma.recording.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(fileUrl !== undefined && { fileUrl }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl }),
        ...(duration !== undefined && { duration }),
        ...(metadata !== undefined && { metadata }),
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Delete recording
router.delete("/:id", async (req: AuthRequest, res, next) => {
  try {
    const recording = await prisma.recording.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!recording) {
      return res.status(404).json({ error: "Recording not found" });
    }

    await prisma.recording.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Recording deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
