import { z } from "zod";
import { validator } from "hono/validator";

/**
 * This file contains a validation middleware for Hono applications.
 * It uses the Zod library for schema validation.
 */

/**
 * A higher-order function that creates a validation middleware for Hono.
 * @param schema The Zod schema to validate the request body against.
 * @returns A Hono middleware function.
 */
export const validate = (schema: z.ZodSchema) =>
  /**
   * The actual validation middleware.
   * It validates the JSON request body against the provided Zod schema.
   * @param value The JSON value from the request body.
   * @param c The Hono context object.
   * @returns The parsed data if validation is successful, or a JSON error response if it fails.
   */
  validator("json", (value, c) => {
    // Attempt to parse the request body using the provided Zod schema.
    const parsed = schema.safeParse(value);

    // If parsing fails, return a 400 Bad Request response with the validation errors.
    if (!parsed.success) {
      return c.json({ error: parsed.error }, 400);
    }

    // If parsing is successful, return the validated data.
    return parsed.data;
  });
