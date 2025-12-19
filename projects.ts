import express from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth";
import { projectSchema } from "../utils/validation";

const router = express.Router();
const prisma = new PrismaClient();

// Get all projects
router.get("/", async (req: AuthRequest, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.userId },
      include: {
        _count: {
          select: {
            recordings: true,
            feedback: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    res.json(projects);
  } catch (error) {
    next(error);
  }
});

// Get single project
router.get("/:id", async (req: AuthRequest, res, next) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
      include: {
        recordings: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            recordings: true,
            feedback: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
});

// Create project
router.post("/", async (req: AuthRequest, res, next) => {
  try {
    const validated = projectSchema.parse(req.body);
    const { name, description } = validated;

    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        userId: req.userId!,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
});

// Update project
router.put("/:id", async (req: AuthRequest, res, next) => {
  try {
    const { name, description } = req.body;

    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const updated = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Delete project
router.delete("/:id", async (req: AuthRequest, res, next) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    await prisma.project.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
