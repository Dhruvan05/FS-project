# RBAC Dashboard: MERN Stack Role-Based Access Control

A demonstration of a fine-grained Role-Based Access Control (RBAC) system in a full-stack MERN application. It showcases how different user roles (**Admin**, **Editor**, **Viewer**) have varying permissions to view, create, edit, and manage content and users.

This project features a Node.js (Express) backend with JWT-based authentication and a React frontend that dynamically adapts the UI based on user permissions.

## ✨ Key Features

* **Fine-Grained Permissions:** Server-side enforcement of rules for `Admin`, `Editor`, and `Viewer` roles.
* **Ownership Checks:** Editors can only modify or delete their *own* content; Admins have full control.
* **Dynamic UI Guarding:** The React UI hides or disables controls (like "Admin Panel" or "Delete" buttons) based on the current user's role and permissions.
* **User Management Panel:** A secure admin-only page to view all users and update their roles.
* **Secure API:** Backend API secured with JWT authentication middleware.
* **Request Validation:** All API endpoints validate incoming data for correctness and security.
* **Structured Logging:** All API requests are logged as structured JSON, including a unique correlation ID for easy debugging.
* **Automated Testing:** Backend security rules are verified with an integration test suite using Jest and Supertest.
* **Developer Setup:** Includes a Docker Compose file for the database and a seed script for test users.

## 💻 Tech Stack

| Area | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, TailwindCSS |
| **Backend** | Node.js, Express, Mongoose, JWT (jsonwebtoken) |
| **Database** | MongoDB (run via Docker) |
| **Testing** | Jest, Supertest, @shelf/jest-mongodb |

## 🔑 Roles & Permissions

This project implements the following permission matrix:

| Action | Viewer | Editor | Admin |
| :--- | :---: | :---: | :---: |
| **Read Posts** | ✅ | ✅ | ✅ |
| **Create Posts** | ❌ | ✅ | ✅ |
| **Update Own Post** | ❌ | ✅ | ✅ |
| **Update Any Post** | ❌ | ❌ | ✅ |
| **Delete Own Post** | ❌ | ✅ | ✅ |
| **Delete Any Post** | ❌ | ❌ | ✅ |
| **Manage Users** | ❌ | ❌ | ✅ |

## 🚀 Getting Started

Follow these instructions to run the full-stack application on your local machine.

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or later)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (must be running)

### Step 1: Start the Database (Terminal 1)

First, let's get the MongoDB database running in a Docker container.

1.  Open your terminal.
2.  Navigate to the project's root directory.
3.  Run the `docker-compose` command to start the database service in the background:
    ```sh
    docker-compose up -d mongo
    ```

### Step 2: Run the Backend API (Terminal 1)

In the same terminal, start the backend server.

1.  Navigate into the `server` directory:
    ```sh
    cd server
    ```
2.  Copy the example environment file:
    ```sh
    cp .env.example .env
    ```
3.  Install all backend dependencies:
    ```sh
    npm install
    ```
4.  **Important:** Run the seed script to create test users and posts:
    ```sh
    npm run seed
    ```
5.  Start the backend server in development mode (with hot-reloading):
    ```sh
    npm run dev
    ```
    Your API is now running on `http://localhost:4000`.

### Step 3: Run the Frontend App (Terminal 2)

Now, open a **new, separate terminal** to run the React frontend.

1.  Navigate to the project's root directory.
2.  Install all frontend dependencies:
    ```sh
    npm install
    ```
3.  Start the Vite development server:
    ```sh
    npm run dev
    ```
    Your React app is now running on `http://localhost:3000`.

### Step 4: Access the Application

You're all set! Open your browser and go to:
**`http://localhost:3000`**

---

### 👤 Test Credentials

Use the following credentials (created by the seed script) to test the different roles:

* **Role: Admin**
    * **Email:** `admin@example.com`
    * **Password:** `password123`

* **Role: Editor**
    * **Email:** `editor@example.com`
    * **Password:** `password123`

* **Role: Viewer**
    * **Email:** `viewer@example.com`
    * **Password:** `password123`

## 🧪 Running Tests

This project includes an automated integration test suite to verify all RBAC security rules on the backend.

1.  Make sure your development server (`npm run dev`) is **stopped**.
2.  From the `server/` directory, run:
    ```sh
    npm test
    ```
    Jest will automatically start a separate in-memory database, run all tests, and show you the results.

## 📁 API Endpoints

All API endpoints are prefixed with `/api`.

| Method | Endpoint | Permissions | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Public | Authenticates a user and returns a JWT. |
| `GET` | `/posts` | Viewer, Editor, Admin | Gets a list of all posts. |
| `POST` | `/posts` | Editor, Admin | Creates a new post. |
| `PUT` | `/posts/:id` | Admin (all), Editor (own) | Updates a post by its ID. |
| `DELETE` | `/posts/:id` | Admin (all), Editor (own) | Deletes a post by its ID. |
| `GET` | `/users` | Admin | Gets a list of all users. |
| `PUT` | `/users/:id` | Admin | Updates a user's role by their ID. |