import { db } from "./db/postgres";
import { projects } from "./schemas/project.schema";
import { tasks } from "./db/mongo";
import { ObjectId } from "mongodb";
import { Task } from "./schemas/task.schema";

/**
 * This script is used to seed the database with initial data.
 * It clears existing data and then inserts sample projects and tasks.
 */
async function seed() {
  console.log("Seeding database...");

  // --- Clear Existing Data (Optional for Development) ---
  // This step is useful during development to ensure a clean state before seeding.
  // In a production environment, you might want to remove or guard this.

  // Delete all existing projects from the PostgreSQL database.
  await db.delete(projects);
  // Delete all existing tasks from the MongoDB database.
  await tasks.deleteMany({});

  // --- Create Sample Projects ---

  // Insert the first sample project into the PostgreSQL 'projects' table.
  // .returning() is used to get the inserted project object back.
  const [project1] = await db.insert(projects).values({ name: "Website Redesign" }).returning();
  // Insert the second sample project.
  const [project2] = await db.insert(projects).values({ name: "Mobile App Development" }).returning();

  // Check if projects were successfully created. If not, log an error and exit.
  if (!project1 || !project2) {
    console.error("Failed to create projects.");
    return;
  }

  // Log the details of the created projects.
  console.log(`Created project: ${project1.name} (ID: ${project1.id})`);
  console.log(`Created project: ${project2.name} (ID: ${project2.id})`);

  // --- Create Sample Tasks for Project 1 ---

  // Define the first task for Project 1.
  // A new ObjectId is generated for _id, and projectId links it to project1.
  const task1_1: Task = {
    _id: new ObjectId(),
    projectId: project1.id,
    title: "Design UI/UX mockups",
    completed: false,
    dueDate: new Date("2025-07-20"),
  };
  // Define the second task for Project 1.
  const task1_2: Task = {
    _id: new ObjectId(),
    projectId: project1.id,
    title: "Develop frontend components",
    completed: false,
    dueDate: new Date("2025-07-25"),
  };
  // Define the third task for Project 1 (marked as completed).
  const task1_3: Task = {
    _id: new ObjectId(),
    projectId: project1.id,
    title: "Integrate backend APIs",
    completed: true,
    dueDate: new Date("2025-07-30"),
  };

  // Insert all tasks for Project 1 into the MongoDB 'tasks' collection.
  await tasks.insertMany([task1_1, task1_2, task1_3]);
  console.log(`Added 3 tasks to project: ${project1.name}`);

  // --- Create Sample Tasks for Project 2 ---

  // Define the first task for Project 2.
  const task2_1: Task = {
    _id: new ObjectId(),
    projectId: project2.id,
    title: "Plan app features",
    completed: false,
    dueDate: new Date("2025-08-05"),
  };
  // Define the second task for Project 2.
  const task2_2: Task = {
    _id: new ObjectId(),
    projectId: project2.id,
    title: "Build authentication module",
    completed: false,
    dueDate: new Date("2025-08-10"),
  };

  // Insert all tasks for Project 2 into the MongoDB 'tasks' collection.
  await tasks.insertMany([task2_1, task2_2]);
  console.log(`Added 2 tasks to project: ${project2.name}`);

  console.log("Database seeding complete.");
}

/**
 * Execute the seeding function.
 * If any error occurs during seeding, it's caught and logged, and the process exits with an error code.
 */
seed().catch((err) => {
  console.error("Database seeding failed:", err);
  process.exit(1);
});