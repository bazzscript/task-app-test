import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../schemas/project.schema";

/**
 * This file sets up the connection to the PostgreSQL database using the `postgres` library
 * and initializes Drizzle ORM with that connection.
 */

/**
 * Creates a new PostgreSQL client instance.
 * The connection URL is retrieved from the `DATABASE_URL` environment variable.
 * The `!` at the end is a non-null assertion operator, which tells TypeScript
 * that you are sure `process.env.DATABASE_URL` will not be null or undefined.
 * Make sure to have this environment variable set in your .env file.
 */
const client = postgres(process.env.DATABASE_URL!);

/**
 * Initializes Drizzle ORM with the PostgreSQL client and the defined schema.
 * The `drizzle` function takes the client and an options object as arguments.
 * The `schema` property in the options object provides Drizzle with the database schema information.
 * The exported `db` object is the main entry point for interacting with the database using Drizzle.
 */
export const db = drizzle(client, { schema });
