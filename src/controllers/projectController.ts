import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { Project } from "../models/Project";
import { Task } from "../models/Task";
import { User, Role } from "../models/User";
import {
  NotFoundError,
  ForbiddenError,
  ValidationError,
} from "../utils/errors";
import {
  CreateProjectInput,
  UpdateProjectInput,
} from "../utils/validators";

/**
 * Create a new project
 */
export const createProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ValidationError("User not authenticated");
  }

  const { name, description, status } = req.body as CreateProjectInput;

  const newProject = new Project({
    name,
    description,
    status: status || "ACTIVE",
    createdBy: req.userId,
    admin: req.userId, // Creator is admin
    teamMembers: [{ userId: req.userId, role: "ADMIN" }],
    isDeleted: false,
  });

  await newProject.save();

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    data: newProject,
  });
};

/**
 * Get all projects for current user
 */
export const getProjects = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ValidationError("User not authenticated");
  }

  const projects = await Project.find({
    isDeleted: false,
  } as any).populate("createdBy admin", "name email role");

  res.status(200).json({
    success: true,
    data: projects,
  });
};

/**
 * Get project by ID
 */
export const getProjectById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ValidationError("User not authenticated");
  }

  const { projectId } = req.params;

  const project = await Project.findOne({
    _id: projectId,
    isDeleted: false,
  }).populate("createdBy admin teamMembers.userId", "name email role");

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  // Check if user is part of project
  const isTeamMember =
    project.createdBy?.toString() === req.userId ||
    project.admin?.toString() === req.userId ||
    project.teamMembers?.some((m) => m.userId.toString() === req.userId);

  if (!isTeamMember && req.role !== Role.ADMIN) {
    throw new ForbiddenError("You don't have access to this project");
  }

  res.status(200).json({
    success: true,
    data: project,
  });
};

/**
 * Update project
 */
export const updateProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ValidationError("User not authenticated");
  }

  const { projectId } = req.params;
  const updateData = req.body as UpdateProjectInput;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  if (project.isDeleted) {
    throw new NotFoundError("Project has been deleted");
  }

  // Only ADMIN role can update project
  if (req.role !== Role.ADMIN) {
    throw new ForbiddenError("Only ADMIN users can update projects");
  }

  Object.assign(project, updateData);
  await project.save();

  res.status(200).json({
    success: true,
    message: "Project updated successfully",
    data: project,
  });
};

/**
 * Soft delete project (DELETE - admin only)
 */
export const deleteProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ValidationError("User not authenticated");
  }

  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  if (project.isDeleted) {
    throw new NotFoundError("Project has already been deleted");
  }

  // Only ADMIN role can delete project
  if (req.role !== Role.ADMIN) {
    throw new ForbiddenError("Only ADMIN users can delete projects");
  }

  // Soft delete - set isDeleted and deletedAt
  project.isDeleted = true;
  project.deletedAt = new Date();
  await project.save();

  // Also soft delete associated tasks
  await Task.updateMany(
    { projectId: project._id } as any,
    { $set: { deletedAt: new Date(), isDeleted: true } }
  );

  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
};

/**
 * Add team member to project
 */
export const addTeamMember = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ValidationError("User not authenticated");
  }

  const { projectId } = req.params;
  const { userId, role } = req.body;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  if (project.deletedAt) {
    throw new NotFoundError("Project has been deleted");
  }

  // Only admin can add team members
  if (project.admin?.toString() !== req.userId) {
    throw new ForbiddenError("Only project admin can add team members");
  }

  // Check if user is already a team member
  const isMember = project.teamMembers?.some((m) =>
    m.userId.toString() === userId
  );

  if (isMember) {
    throw new ValidationError("User is already a team member");
  }

  // Verify user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (!project.teamMembers) {
    project.teamMembers = [];
  }
  project.teamMembers.push({ userId, role });
  await project.save();

  res.status(200).json({
    success: true,
    message: "Team member added successfully",
    data: project,
  });
};

/**
 * Remove team member from project
 */
export const removeTeamMember = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ValidationError("User not authenticated");
  }

  const { projectId, memberId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  // Only admin can remove team members
  if (project.admin?.toString() !== req.userId) {
    throw new ForbiddenError("Only project admin can remove team members");
  }

  project.teamMembers = project.teamMembers?.filter(
    (m) => m.userId.toString() !== memberId
  ) || [];

  await project.save();

  res.status(200).json({
    success: true,
    message: "Team member removed successfully",
    data: project,
  });
};
