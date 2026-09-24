# Waypoint — Task Management Application

A full-stack task management application built with **React + Vite** on the frontend and **Python/FastAPI + PostgreSQL** on the backend.

Waypoint allows users to register, log in securely, manage tasks, track task progress, and view productivity analytics including streaks and completion statistics.

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Recharts
* JavaScript
* CSS

### Backend

* Python
* FastAPI
* SQLAlchemy
* JWT Authentication
* bcrypt
* Uvicorn

### Database

* PostgreSQL

### Development Tools

* uv
* Git & GitHub
* pgAdmin

---

## Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Protected routes
* Password hashing with bcrypt
* Automatic authentication header handling
* Logout

### Task Management

* Create tasks
* View tasks
* Update tasks
* Delete tasks
* Change task status
* Task priorities
* Task descriptions
* Due dates
* User-specific task ownership

### Task Status

Tasks can move through three states:

```text
To Do → In Progress → Done
```

### Analytics

* Total tasks
* Completed tasks
* Remaining tasks
* Current streak
* Best streak
* Last 24 hours completion data
* Weekly completion data
* Last 6 weeks completion data
* Charts powered by Recharts

---

## Project Structure

```text
Level 1/
├── backend/
│   ├── auth.py              # JWT authentication
│   ├── database.py          # PostgreSQL + SQLAlchemy configuration
│   ├── main.py              # FastAPI application and API endpoints
│   └── models.py            # SQLAlchemy database models
│
├── taskflow/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/        # Login/Register UI
│   │   │   ├── layout/      # Sidebar and application layout
│   │   │   ├── tasks/       # Task components and task form
│   │   │   ├── charts/      # Analytics components
│   │   │   └── common/      # Shared components
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Analytics.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── TaskContext.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── taskService.js
│   │   │   └── analyticsService.js
│   │   │
│   │   ├── utils/
│   │   │   └── dateUtils.js
│   │   │
│   │   ├── styles/
│   │   │   ├── variables.css
│   │   │   └── global.css
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── .gitignore
├── pyproject.toml
├── uv.lock
└── README.md
```

---

## API Endpoints

The frontend communicates with the FastAPI backend through HTTP requests.

### Authentication

```text
POST /auth/register
POST /auth/login
```

### Tasks

```text
GET    /tasks
POST   /tasks
PATCH  /tasks/{id}
DELETE /tasks/{id}
```

### Analytics

```text
GET /analytics/summary
```

Authenticated requests use:

```text
Authorization: Bearer <JWT>
```

The JWT identifies the logged-in user, and task operations are restricted to that user's own tasks.

---

## Running Locally

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd "Level 1"
```

### 2. Backend

Install dependencies:

```bash
uv sync
```

Make sure PostgreSQL is running and the database configuration in `backend/database.py` points to your PostgreSQL database.

Start the FastAPI server:

```bash
uv run uvicorn backend.main:app --reload
```

The backend normally runs at:

```text
http://localhost:8000
```

FastAPI documentation is available at:

```text
http://localhost:8000/docs
```

### 3. Frontend

Move into the frontend directory:

```bash
cd taskflow
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

---

## Database

Waypoint uses **PostgreSQL** with **SQLAlchemy** as the ORM.

The main database tables are:

```text
users
tasks
```

The `tasks` table is associated with the `users` table through:

```text
tasks.user_id → users.id
```

This ensures that authenticated users can only access their own tasks.

---

## Authentication Flow

```text
Register
   ↓
FastAPI creates user
   ↓
Password is hashed with bcrypt
   ↓
User logs in
   ↓
FastAPI verifies credentials
   ↓
JWT is generated
   ↓
Frontend stores JWT
   ↓
Authenticated requests include:
Authorization: Bearer <JWT>
   ↓
FastAPI verifies JWT
   ↓
User-specific data is returned
```

---

## Frontend ↔ Backend Architecture

Components do not communicate directly with the API.

The application follows this structure:

```text
React Components
       ↓
Context
       ↓
Service Layer
       ↓
apiClient()
       ↓
FastAPI
       ↓
SQLAlchemy
       ↓
PostgreSQL
```

For example:

```text
Dashboard
   ↓
TaskContext
   ↓
taskService
   ↓
apiClient
   ↓
PATCH /tasks/{id}
   ↓
FastAPI
   ↓
PostgreSQL
```

This keeps API communication separated from the UI.

---

## Environment & Security

Sensitive configuration should not be committed to Git.

The project ignores:

```text
.env
.venv/
__pycache__/
*.pyc
```

Production deployments should use environment variables for values such as:

* Database credentials
* JWT secret key
* API URLs
* Other deployment-specific configuration

The current development configuration is intended for local use.

---
