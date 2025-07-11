import { MongoClient } from "mongodb";
import { Task } from "../schemas/task.schema";

/**
 * This file sets up the connection to the MongoDB database.
 */

/**
 * Creates a new MongoDB client instance.
 * The connection URL is retrieved from the `MONGO_URL` environment variable.
 * The `!` at the end is a non-null assertion operator, which tells TypeScript
 * that you are sure `process.env.MONGO_URL` will not be null or undefined.
 * Make sure to have this environment variable set in your .env file.
 */
const client = new MongoClient(process.env.MONGO_URL!);

/**
 * Connects to the "task-app" database in the MongoDB cluster.
 * If the database does not exist, it will be created automatically.
 */
export const db = client.db("task-app");

/**
 * Represents the "tasks" collection in the MongoDB database.
 * The `db.collection<Task>("tasks")` method creates a reference to the collection
 * and specifies that the documents in this collection will have the structure of the `Task` interface.
 */
export const tasks = db.collection<Task>("tasks");
