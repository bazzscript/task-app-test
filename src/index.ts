import { Hono } from 'hono'
import { logger } from 'hono/logger'

import projects from './routes/projects/projects.routes';
import tasks from './routes/tasks/tasks.routes';

/**
 * This is the main entry point for the Hono application.
 * It sets up the Hono app, applies middleware, and registers routes.
 */
const app = new Hono()

/**
 * Middleware for logging HTTP requests.
 * It provides useful information about incoming requests and outgoing responses.
 */
app.use( logger())

/**
 * Defines a simple root route for the application.
 * When a GET request is made to the root URL ('/'), it returns a plain text response.
 */
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

/**
 * Registers the project-related routes under the '/projects' path.
 * All routes defined in `projects.routes.ts` will be prefixed with '/projects'.
 */
app.route('/projects', projects);

/**
 * Registers the task-related routes under the '/projects' path.
 * This means task routes will also be nested under projects, e.g., '/projects/:id/tasks'.
 */
app.route('/projects', tasks);

export default app