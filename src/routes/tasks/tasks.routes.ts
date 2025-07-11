import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { createTask, updateTask, getTasks } from "../../handlers/tasks/tasks.handlers";
import { z } from "zod";

/**
 * This file defines the routes for managing tasks.
 * It uses the Hono framework to create a new router instance.
 */

const tasks = new OpenAPIHono();

/**
 * Defines the schema for validating the request body when creating a new task.
 * It uses the Zod library to ensure that the 'title' is a string and the 'dueDate' is a date.
 */
const createTaskSchema = z.object({
  title: z.string().min(1, "Task title cannot be empty"),
  dueDate: z.string().pipe(z.coerce.date()),
});

/**
 * Defines the schema for validating the request body when updating a task.
 * It uses the Zod library to ensure that the 'completed' property is a boolean.
 */
const updateTaskSchema = z.object({
  completed: z.boolean(),
});

/**
 * Defines the schema for a Task response.
 */
const TaskResponseSchema = z.object({
  _id: z.string(), // MongoDB ObjectId as string
  projectId: z.string().uuid(),
  title: z.string(),
  completed: z.boolean(),
  dueDate: z.string().datetime(),
});

/**
 * Defines the schema for a list of Task responses.
 */
const TasksResponseSchema = z.array(TaskResponseSchema);

const createTaskRoute = createRoute({
  method: "post",
  path: "/{id}/tasks",
  summary: "Create a new task under a project",
  request: {
    params: z.object({
      id: z.string().uuid().openapi({ description: "UUID of the project" }),
    }),
    body: {
      content: {
        "application/json": {
          schema: createTaskSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: z.object({ insertedId: z.string() }), // MongoDB insert result
        },
      },
    },
    400: {
      description: "Invalid input",
    },
  },
});

tasks.openapi(createTaskRoute, (c) => createTask(c));

const updateTaskRoute = createRoute({
  method: "put",
  path: "/{id}/tasks/{taskId}",
  summary: "Update a task (mark as completed)",
  request: {
    params: z.object({
      id: z.string().uuid().openapi({ description: "UUID of the project" }),
      taskId: z.string().openapi({ description: "ID of the task to update" }),
    }),
    body: {
      content: {
        "application/json": {
          schema: updateTaskSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: z.object({ success: z.boolean() }),
        },
      },
    },
    400: {
      description: "Invalid input",
    },
    404: {
      description: "Task not found",
    },
  },
});

tasks.openapi(updateTaskRoute, (c) => updateTask(c));

const getTasksRoute = createRoute({
  method: "get",
  path: "/{id}/tasks",
  summary: "List all tasks under the project",
  request: {
    params: z.object({
      id: z.string().uuid().openapi({ description: "UUID of the project" }),
    }),
  },
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: TasksResponseSchema,
        },
      },
    },
    404: {
      description: "Project not found",
    },
  },
});

tasks.openapi(getTasksRoute, (c) => getTasks(c));

export default tasks;