import { ObjectId } from "mongodb";

/**
 * Defines the structure of a Task document in the MongoDB collection.
 */
export interface Task {
  /**
   * The unique identifier for the task.
   * It's an ObjectId, which is a special type in MongoDB.
   */
  _id: ObjectId;

  /**
   * The ID of the project this task belongs to.
   * This is a foreign key that links to the 'projects' table in the PostgreSQL database.
   */
  projectId: string;

  /**
   * The title or description of the task.
   */
  title: string;

  /**
   * A boolean flag indicating whether the task is completed or not.
   */
  completed: boolean;

  /**
   * The due date for the task.
   */
  dueDate: Date;
}
