import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { createProject, getProject, getAllProjects } from "../../handlers/projects/projects.handlers";
import { z } from "zod";

/**
 * This file defines the routes for managing projects.
 * It uses the Hono framework to create a new router instance.
 */

const projects = new OpenAPIHono();

/**
 * Defines the schema for validating the request body when creating a new project.
 * It uses the Zod library to ensure that the 'name' property is a string.
 */
const createProjectSchema = z.object({
  name: z.string().min(1, "Project name cannot be empty"),
});

/**
 * Defines the schema for a Project response.
 */
const ProjectResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.string().datetime(),
});

/**
 * Defines the schema for a Project with aggregated task statistics response.
 */
const ProjectWithStatsResponseSchema = ProjectResponseSchema.extend({
  taskCount: z.number().int().nonnegative(),
  completedCount: z.number().int().nonnegative(),
});

const createProjectRoute = createRoute({
  method: "post",
  path: "/",
  summary: "Create a new project",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createProjectSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: ProjectResponseSchema,
        },
      },
    },
  },
});

projects.openapi(createProjectRoute, (c) => createProject(c));

const getProjectRoute = createRoute({
  method: "get",
  path: "/{id}",
  summary: "Get a project with task summary",
  request: {
    params: z.object({
      id: z.string().uuid().openapi({ description: "UUID of the project to retrieve" }),
    }),
  },
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: ProjectWithStatsResponseSchema,
        },
      },
    },
    404: {
      description: "Project not found",
    },
  },
});

projects.openapi(getProjectRoute, (c) => getProject(c));

const getAllProjectsRoute = createRoute({
  method: "get",
  path: "/",
  summary: "Get a list of all projects",
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: z.array(ProjectResponseSchema),
        },
      },
    },
  },
});

projects.openapi(getAllProjectsRoute, (c) => getAllProjects(c));

export default projects;