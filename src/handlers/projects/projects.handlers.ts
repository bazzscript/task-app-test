import { Context } from "hono";
import { db } from "../../db/postgres";
import { projects } from "../../schemas/project.schema";
import { tasks } from "../../db/mongo";
import { eq } from "drizzle-orm";

/**
 * This file contains the handlers for the project-related API endpoints.
 */

/**
 * Handles the creation of a new project.
 * @param c The Hono context object.
 * @returns A JSON response with the newly created project.
 */
export const createProject = async (c: Context) => {
  // Get the project name from the request body.
  const { name } = await c.req.json();

  // Insert the new project into the database and return the created record.
  const [project] = await db.insert(projects).values({ name }).returning();

  // Return the newly created project as a JSON response.
  return c.json(project, 200);
};

/**
 * Handles the retrieval of a project by its ID.
 * @param c The Hono context object.
 * @returns A JSON response with the project details and task summary.
 */
export const getProject = async (c: Context) => {
  // Get the project ID from the request parameters.
  const { id } = c.req.param();

  // Select the project from the database where the ID matches.
  const [project] = await db.select().from(projects).where(eq(projects.id, id));

  // If the project is not found, return a 404 error.
  if (!project) {
    return c.json({ error: "Project not found" }, 404);
  }

  // Count the total number of tasks for the project.
  const taskCount = await tasks.countDocuments({ projectId: id });
  // Count the number of completed tasks for the project.
  const completedCount = await tasks.countDocuments({ projectId: id, completed: true });

  // Return the project details along with the task summary.
  return c.json({ ...project, taskCount, completedCount });
};

/**
 * Handles the retrieval of all projects.
 * @param c The Hono context object.
 * @returns A JSON response with an array of all projects.
 */
export const getAllProjects = async (c: Context) => {
  const allProjects = await db.select().from(projects);
  return c.json(allProjects);
};
