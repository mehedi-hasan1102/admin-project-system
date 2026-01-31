import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middleware/validationMiddleware";
import { authMiddleware, authorize } from "../middleware/authMiddleware";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../utils/validators";
import { Role } from "../models/User";
import * as projectController from "../controllers/projectController";

const router = Router();

/**
 * POST /api/projects
 * Create a new project
 */
router.post(
  "/",
  authMiddleware,
  validate(createProjectSchema),
  asyncHandler(projectController.createProject)
);

/**
 * GET /api/projects
 * Get all projects for current user
 */
router.get(
  "/",
  authMiddleware,
  asyncHandler(projectController.getProjects)
);

/**
 * GET /api/projects/:projectId
 * Get project by ID
 */
router.get(
  "/:projectId",
  authMiddleware,
  asyncHandler(projectController.getProjectById)
);

/**
 * PATCH /api/projects/:projectId
 * Update project (ADMIN only)
 */
router.patch(
  "/:projectId",
  authMiddleware,
  authorize(Role.ADMIN),
  validate(updateProjectSchema),
  asyncHandler(projectController.updateProject)
);

/**
 * DELETE /api/projects/:projectId
 * Soft delete project (ADMIN only)
 */
router.delete(
  "/:projectId",
  authMiddleware,
  authorize(Role.ADMIN),
  asyncHandler(projectController.deleteProject)
);

/**
 * POST /api/projects/:projectId/team-members
 * Add team member to project
 */
router.post(
  "/:projectId/team-members",
  authMiddleware,
  asyncHandler(projectController.addTeamMember)
);

/**
 * DELETE /api/projects/:projectId/team-members/:memberId
 * Remove team member from project
 */
router.delete(
  "/:projectId/team-members/:memberId",
  authMiddleware,
  asyncHandler(projectController.removeTeamMember)
);

export default router;
