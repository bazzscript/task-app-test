import { defineConfig } from "drizzle-kit";

/**
 * This is the configuration file for Drizzle Kit.
 * Drizzle Kit is a command-line tool that helps you manage your database schema.
 * It uses this configuration to connect to your database and generate migration files.
 */
export default defineConfig({
  /**
   * The path to the file where you define your database schema.
   * Drizzle Kit will read this file to understand your database structure.
   */
  schema: "./src/schemas/project.schema.ts",

  /**
   * The directory where Drizzle Kit will output the generated migration files.
   * These files contain the SQL commands to update your database schema.
   */
  out: "./drizzle",

  /**
   * The database dialect you are using. In this case, it's PostgreSQL.
   * Drizzle Kit supports other dialects like MySQL and SQLite.
   */
  dialect: "postgresql",

  /**
   * The credentials to connect to your database.
   * It's important to use environment variables for sensitive information like database URLs.
   */
  dbCredentials: {
    /**
     * The connection string for your PostgreSQL database.
     * The `!` at the end is a non-null assertion operator, which tells TypeScript
     * that you are sure `process.env.DATABASE_URL` will not be null or undefined.
     * Make sure to have this environment variable set in your .env file.
     */
    url: process.env.DATABASE_URL!,
  },
});
