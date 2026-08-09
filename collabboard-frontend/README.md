# CollabBoard - Task Management Application

CollabBoard is a full-stack collaborative Kanban-style task management web application built with Express REST API for the backend and React (Vite) for the frontend.

---

## 🚀 Project Overview (Milestone 2 Completed)

This project has reached **Milestone 2 (M2)**, which includes:
- **Express REST API backend** with modular architecture.
- **In-memory data store** for users and tasks management.
- **Authentication system** using JSON Web Tokens (JWT) and `bcryptjs` password hashing.
- **Task CRUD functionality** (Create, Read, Update, Delete tasks).
- **Frontend integration** using Axios interceptors and live UI state updates.

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Axios, Lucide React Icons
- **Backend:** Node.js, Express.js, JWT (`jsonwebtoken`), `bcryptjs`, `cors`, `dotenv`
- **Development Tools:** Nodemon, Git / GitHub

---

## 📂 Repository Structure

```text
collabboard/
├── collabboard-backend/     # Node.js Express REST API
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
└── collabboard-frontend/    # React Single Page Application
    ├── src/
    │   ├── api.js
    │   ├── components/
    │   └── services/
    ├── index.html
    └── package.json


⚡ Setup & Run Instructions
To run the application locally on your machine, follow these steps:

Prerequisites
Node.js installed on your machine (v16 or higher recommended)

npm (Node Package Manager)

Step 1: Start the Backend Server

1.Navigate to the backend directory:

cd collabboard-backend

2.Install dependencies:

npm install

3.Run the backend server:

npm run dev

Step 2: Start the Frontend React App

1.Open a new terminal tab/window and navigate to the frontend directory:

cd collabboard-frontend

2.Install dependencies:

npm install

3.Run the Vite development server:

npm run dev

📚 API Documentation (Contract)
Base URL
http://localhost:5000/api

🔒 Authentication Endpoints
1. User Registration

Endpoint: POST /auth/register

Request Body:
{
  "username": "john_doe",
  "password": "password123"
}

Response (201 Created):

{
  "message": "User registered successfully"
}

2. User Login

Endpoint: POST /auth/login

Request Body:

{
  "username": "john_doe",
  "password": "password123"
}

Response (200 OK):

{
  "token": "YOUR_JWT_TOKEN_HERE"
}

📋 Task Endpoints (Protected - Requires Bearer Token)
Note: For all /tasks requests, pass the JWT token in the request header:
Authorization: Bearer <YOUR_JWT_TOKEN>

1. Get All Tasks
Endpoint: GET /tasks

Response (200 OK):

[
  {
    "id": "1",
    "title": "Design UI Mockups",
    "status": "Done"
  },
  {
    "id": "2",
    "title": "Connect Backend API",
    "status": "Doing"
  }
]

2. Create New Task
Endpoint: POST /tasks

Request Body:

{
  "title": "Fix Auth Bug"
}

Response (201 Created):

{
  "id": "3",
  "title": "Fix Auth Bug",
  "status": "To Do"
}

3. Update Task Status
Endpoint: PUT /tasks/:id

Request Body:

{
  "status": "Done"
}

Response (200 OK):

{
  "id": "3",
  "title": "Fix Auth Bug",
  "status": "Done"
}

4. Delete Task
Endpoint: DELETE /tasks/:id

Response (200 OK):

{
  "message": "Task deleted successfully"
}



