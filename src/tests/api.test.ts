import app from "../index";
import { describe, it, expect, beforeAll } from "bun:test";

/**
 * This file contains integration tests for the Task Management API.
 * It uses `bun:test` for testing and direct Hono application requests.
 */

describe("API Endpoints", () => {
  let projectId: string;
  let taskId: string;

  beforeAll(async () => {
    // Create a project to be used across multiple tests
    const createProjectResponse = await app.request("/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test Project for All APIs" }),
    });
    const project = await createProjectResponse.json();
    projectId = project.id;

    // Create a task to be used across multiple tests
    const createTaskResponse = await app.request(`/projects/${projectId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Initial Test Task",
        dueDate: new Date().toISOString(),
      }),
    });
    const task = await createTaskResponse.json();
    taskId = task.insertedId;
  });

  it("should create a project", async () => {
    const createProjectResponse = await app.request("/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Another Test Project" }),
    });
    const project = await createProjectResponse.json();

    expect(createProjectResponse.status).toBe(200);
    expect(project).not.toBeNull();
    expect(project.id).toBeDefined();
    expect(project.name).toBe("Another Test Project");
  });

  it("should get all projects", async () => {
    const getAllProjectsResponse = await app.request("/projects", {
      method: "GET",
    });
    const projects = await getAllProjectsResponse.json();

    expect(getAllProjectsResponse.status).toBe(200);
    expect(Array.isArray(projects)).toBeTrue();
    expect(projects.length).toBeGreaterThan(0);
    // Check if the project created in beforeAll is present
    expect(projects.some((p: any) => p.id === projectId)).toBeTrue();
  });

  it("should get a project by ID with task summary", async () => {
    const getProjectResponse = await app.request(`/projects/${projectId}`, {
      method: "GET",
    });
    const project = await getProjectResponse.json();

    expect(getProjectResponse.status).toBe(200);
    expect(project).not.toBeNull();
    expect(project.id).toBe(projectId);
    expect(project.taskCount).toBeDefined();
    expect(project.completedCount).toBeDefined();
    expect(project.taskCount).toBeGreaterThanOrEqual(1); // At least one task from beforeAll
  });

  it("should return 404 for a non-existent project ID", async () => {
    const nonExistentId = "00000000-0000-0000-0000-000000000000";
    const getProjectResponse = await app.request(`/projects/${nonExistentId}`, {
      method: "GET",
    });
    const error = await getProjectResponse.json();

    expect(getProjectResponse.status).toBe(404);
    expect(error.error).toBe("Project not found");
  });

  it("should create a task under a project", async () => {
    const createTaskResponse = await app.request(`/projects/${projectId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "New Task for Project",
        dueDate: new Date().toISOString(),
      }),
    });
    const task = await createTaskResponse.json();

    expect(createTaskResponse.status).toBe(200);
    expect(task).not.toBeNull();
    expect(task.insertedId).toBeDefined();
  });

  it("should update a task (mark as completed)", async () => {
    // Ensure the task is not completed initially (from beforeAll)
    let getTaskResponse = await app.request(`/projects/${projectId}/tasks`, { method: "GET" });
    let tasksList = await getTaskResponse.json();
    let initialTask = tasksList.find((t: any) => t._id === taskId);
    expect(initialTask.completed).toBeFalse();

    const updateTaskResponse = await app.request(`/projects/${projectId}/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: true }),
    });
    const updateResult = await updateTaskResponse.json();

    expect(updateTaskResponse.status).toBe(200);
    expect(updateResult.success).toBeTrue();

    // Verify the task is now completed
    getTaskResponse = await app.request(`/projects/${projectId}/tasks`, { method: "GET" });
    tasksList = await getTaskResponse.json();
    let updatedTask = tasksList.find((t: any) => t._id === taskId);
    expect(updatedTask.completed).toBeTrue();
  });

  it("should list all tasks under a project", async () => {
    // Create an additional task to ensure multiple tasks are listed
    await app.request(`/projects/${projectId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Another Task for Listing",
        dueDate: new Date().toISOString(),
      }),
    });

    const getTasksResponse = await app.request(`/projects/${projectId}/tasks`, {
      method: "GET",
    });
    const tasksList = await getTasksResponse.json();

    expect(getTasksResponse.status).toBe(200);
    expect(Array.isArray(tasksList)).toBeTrue();
    expect(tasksList.length).toBeGreaterThanOrEqual(2); // Initial task + new task
    expect(tasksList.some((t: any) => t.title === "Initial Test Task")).toBeTrue();
    expect(tasksList.some((t: any) => t.title === "Another Task for Listing")).toBeTrue();
  });
});
