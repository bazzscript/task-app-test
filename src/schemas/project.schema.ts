import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * This file defines the database schema for the 'projects' table using Drizzle ORM.
 * Drizzle ORM is a TypeScript ORM that provides a type-safe way to interact with your database.
 */

/**
 * Defines the 'projects' table in the PostgreSQL database.
 * Each project has a unique ID, a name, and a timestamp indicating when it was created.
 */
export const projects = pgTable("projects", {
  /**
   * The unique identifier for the project.
   * It's a UUID (Universally Unique Identifier) and serves as the primary key.
   * `defaultRandom()` automatically generates a new UUID for each new project.
   */
  id: uuid("id").primaryKey().defaultRandom(),

  /**
   * The name of the project.
   * This field cannot be null.
   */
  name: text("name").notNull(),

  /**
   * The timestamp when the project was created.
   * `defaultNow()` sets the current timestamp as the default value when a new project is created.
   * This field cannot be null.
   */
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
