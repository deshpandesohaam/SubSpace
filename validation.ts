import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required").optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
});

export const feedbackSchema = z.object({
  content: z.string().min(1, "Feedback content is required"),
  type: z.enum(["GENERAL", "BUG_REPORT", "FEATURE_REQUEST", "IMPROVEMENT"]),
  rating: z.number().min(1).max(5).optional(),
  projectId: z.string().optional(),
  recordingId: z.string().optional(),
});
