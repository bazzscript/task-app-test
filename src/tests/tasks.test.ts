import app from "../index";
import { describe, it, expect } from "bun:test";

/**
 * This file contains integration tests for the Task Management API.
 * It uses `bun:test` for testing and direct Hono application requests.
 */

describe("Tasks API", () => {
  it("should create a project and a task", async () => {
    // 1. Create a new project.
    const createProjectResponse = await app.request("/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test Project" }),
    });
    const project = await createProjectResponse.json();

    // Assert that the project was created successfully (status 200/201).
    expect(createProjectResponse.status).toBe(200);
    expect(project).not.toBeNull();
    expect(project.id).toBeDefined();

    // If project creation failed, stop the test here.
    if (!project || !project.id) return;

    // 2. Create a new task under the newly created project.
    const createTaskResponse = await app.request(`/projects/${project.id}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test Task",
        dueDate: new Date().toISOString(),
      }),
    });
    const task = await createTaskResponse.json();

    // Assert that the task was created successfully (status 200/201).
    expect(createTaskResponse.status).toBe(200);
    expect(task).not.toBeNull();
    expect(task.insertedId).toBeDefined();
  });
});