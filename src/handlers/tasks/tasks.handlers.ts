import { Context } from "hono";
import { tasks } from "../../db/mongo";
import { ObjectId } from "mongodb";

/**
 * This file contains the handlers for the task-related API endpoints.
 */

/**
 * Handles the creation of a new task for a specific project.
 * @param c The Hono context object.
 * @returns A JSON response with the newly created task.
 */
export const createTask = async (c: Context) => {
  // Get the project ID from the request parameters.
  const { id } = c.req.param();
  // Get the task title and due date from the request body.
  const { title, dueDate } = await c.req.json();

  // Insert the new task into the MongoDB collection.
  const result = await tasks.insertOne({
    projectId: id,
    title,
    completed: false,
    dueDate: new Date(dueDate),
    _id: new ObjectId
  });

  // Return the insertedId as a string in the JSON response.
  return c.json({ insertedId: result.insertedId.toHexString() });
};

/**
 * Handles the update of a task.
 * @param c The Hono context object.
 * @returns A JSON response indicating success.
 */
export const updateTask = async (c: Context) => {
  // Get the task ID from the request parameters.
  const { taskId } = c.req.param();
  // Get the 'completed' status from the request body.
  const { completed } = await c.req.json();

  // Update the task in the MongoDB collection by its ID.
  await tasks.updateOne({ _id: new ObjectId(taskId) }, { $set: { completed } });

  // Return a success message.
  return c.json({ success: true });
};

/**
 * Handles the retrieval of all tasks for a specific project.
 * @param c The Hono context object.
 * @returns A JSON response with an array of tasks.
 */
export const getTasks = async (c: Context) => {
  // Get the project ID from the request parameters.
  const { id } = c.req.param();

  // Find all tasks in the MongoDB collection that match the project ID.
  const taskList = await tasks.find({ projectId: id }).toArray();

  // Map the tasks to convert ObjectId to string and Date to ISO string.
  const formattedTaskList = taskList.map((task) => ({
    ...task,
    _id: task._id.toHexString(),
    dueDate: task.dueDate.toISOString(),
  }));

  // Return the list of tasks as a JSON response.
  return c.json(formattedTaskList);
};
