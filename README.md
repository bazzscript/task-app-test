# Task Management API

This is a basic task management API built with Hono, Drizzle (for PostgreSQL), and MongoDB.

## Requirements

- Node.js (or Bun)
- PostgreSQL database
- MongoDB database

## Setup Instructions

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd task-app-test
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

3.  **Environment Variables:**
    Copy the `.env.example` file to `.env`:
    ```sh
    cp .env.example .env
    ```
    Then, open the `.env` file and replace the placeholder values with your actual database credentials:
    ```
    DATABASE_URL="postgresql://user:password@host:port/database_name"
    MONGO_URL="mongodb://user:password@host:port/database_name"
    ```

4.  **Run Drizzle Migrations (for PostgreSQL):**
    First, generate the migration files:
    ```sh
    bun drizzle-kit generate
    ```
    Then, apply the migrations to create the `projects` table in your PostgreSQL database:
    ```sh
    bun drizzle-kit migrate
    ```

5.  **Start the development server:**
    ```sh
    bun run dev
    ```
    The API will be running at `http://localhost:3000`.

## API Endpoints

### Projects

#### `GET /projects`
Get a list of all projects.

-   **Example Response (200 OK):**
    ```json
    [
        {
            "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            "name": "Project Alpha",
            "createdAt": "2025-07-11T12:00:00.000Z"
        },
        {
            "id": "f1e2d3c4-b5a6-9876-5432-10fedcba9876",
            "name": "Project Beta",
            "createdAt": "2025-07-10T10:30:00.000Z"
        }
    ]
    ```

#### `POST /projects`
Create a new project.

-   **Request Body:**
    ```json
    {
        "name": "New Project Name"
    }
    ```
-   **Example Response (200 OK):**
    ```json
    {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "name": "New Project Name",
        "createdAt": "2025-07-11T12:00:00.000Z"
    }
    ```

#### `GET /projects/:id`
Get a project with aggregated task summary (total task count and completed task count).

-   **Example Response (200 OK):**
    ```json
    {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "name": "New Project Name",
        "createdAt": "2025-07-11T12:00:00.000Z",
        "taskCount": 5,
        "completedCount": 2
    }
    ```
-   **Example Response (404 Not Found):**
    ```json
    {
        "error": "Project not found"
    }
    ```

### Tasks

#### `POST /projects/:id/tasks`
Create a new task under a specific project.

-   **Request Body:**
    ```json
    {
        "title": "New Task Title",
        "dueDate": "2025-07-31T23:59:59.000Z"
    }
    ```
-   **Example Response (200 OK):**
    ```json
    {
        "insertedId": "60c72b2f9b1e8c001c8e4d5a"
    }
    ```

#### `PUT /projects/:id/tasks/:taskId`
Update a task (e.g., mark as completed).

-   **Request Body:**
    ```json
    {
        "completed": true
    }
    ```
-   **Example Response (200 OK):**
    ```json
    {
        "success": true
    }
    ```

#### `GET /projects/:id/tasks`
List all tasks under a specific project.

-   **Example Response (200 OK):**
    ```json
    [
        {
            "_id": "60c72b2f9b1e8c001c8e4d5a",
            "projectId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            "title": "New Task Title",
            "completed": false,
            "dueDate": "2025-07-31T23:59:59.000Z"
        }
    ]
    ```

## Running Tests

```sh
bun test
```

## Seed Database (Optional)

To populate your databases with sample data, run the seed script:

```sh
bun run seed
```