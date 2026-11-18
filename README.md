# WayPoint — Full-Stack Task Management Application

WayPoint is a full-stack task management application built using **React, FastAPI, and PostgreSQL**.

It allows users to register, log in securely, manage tasks, track task progress, and view productivity analytics, including streaks and completion statistics.

The application is containerized using **Docker**. **Docker Compose** manages the frontend, backend, and database services.

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Recharts
- JavaScript
- CSS
- Nginx

### Backend
- Python
- FastAPI
- SQLAlchemy
- JWT Authentication
- bcrypt
- Uvicorn

### Database
- PostgreSQL 17

### Containerization & Development Tools
- Docker
- Docker Compose
- Docker Networking
- Docker Volumes
- uv
- Git & GitHub
- pgAdmin

---

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- Password hashing with bcrypt
- Automatic authentication header handling
- Logout

### Task Management
- Create, view, update, and delete tasks
- Change task status
- Task priorities and descriptions
- Due dates
- User-specific task ownership

### Task Status

Tasks can move through three states:

```text
To Do → In Progress → Done
```

### Analytics
- Total tasks
- Completed tasks
- Remaining tasks
- Current streak
- Best streak
- Last 24 hours completion data
- Weekly completion data
- Last 6 weeks completion data
- Charts powered by Recharts

---

## Project Architecture

WayPoint consists of three services running in separate Docker containers.

```text
                 User / Browser
                       |
                       v
              Frontend (React)
                 Nginx :80
                       |
                       v
              Backend (FastAPI)
                 Port :8000
                       |
                       v
               PostgreSQL
                 Port :5432
```

| Compose service | Technology | Responsibility |
|---|---|---|
| `taskflow` | React + Nginx | Frontend |
| `web` | FastAPI | Backend API |
| `db` | PostgreSQL | Database |

The services communicate through a shared Docker network.

---

## Project Structure

```text
WayPoint/
├── backend/
│   ├── auth.py              # JWT authentication
│   ├── database.py          # PostgreSQL + SQLAlchemy configuration
│   ├── main.py              # FastAPI application and API endpoints
│   └── models.py            # SQLAlchemy database models
│
├── taskflow/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   └── package.json
│
├── Dockerfile               # Backend Dockerfile
├── compose.yaml             # Docker Compose configuration
├── .gitignore
├── pyproject.toml
├── uv.lock
└── README.md
```

---

## API Endpoints

The frontend communicates with the FastAPI backend through HTTP requests.

### Authentication

```http
POST /auth/register
POST /auth/login
POST /auth/logout
```

### Tasks

```http
GET    /tasks
POST   /tasks
PATCH  /tasks/{id}
DELETE /tasks/{id}
```

### Analytics

```http
GET /analytics/summary
```

Authenticated requests use:

```http
Authorization: Bearer <JWT>
```

The JWT identifies the logged-in user, and task operations are restricted to that user's own tasks.

---

## Running Locally (Without Docker)

### Prerequisites
- Python
- uv
- Node.js
- npm
- PostgreSQL

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd WayPoint
```

### 2. Start the backend

Install dependencies:

```bash
uv sync
```

Make sure PostgreSQL is running and the database configuration points to the correct database.

Start FastAPI:

```bash
uv run uvicorn backend.main:app --reload
```

Backend: `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

### 3. Start the frontend

```bash
cd taskflow
npm install
npm run dev
```

Frontend: `http://localhost:5173`

---

# Docker

WayPoint uses separate Docker images for the frontend and backend. PostgreSQL uses the official PostgreSQL image.

## Prerequisites

- Docker Engine
- Docker Compose plugin

Check that Docker is installed:

```bash
docker --version
docker compose version
```

## Option 1: Build and run using Docker Compose

Clone the repository and move into the project directory:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd WayPoint
```

If your Compose file declares an external network named `net1`, create it before starting the application if it does not already exist:

```bash
docker network create net1
```

Build the frontend and backend images and start all services:

```bash
docker compose up -d --build
```

Check the running services:

```bash
docker compose ps
```

View logs for all services:

```bash
docker compose logs -f
```

View logs for an individual service:

```bash
docker compose logs -f taskflow
docker compose logs -f web
docker compose logs -f db
```

Stop and remove the containers and Compose-created network:

```bash
docker compose down
```

To rebuild images after changing application code:

```bash
docker compose up -d --build
```

### Access the application

| Service | URL |
|---|---|
| Frontend | http://localhost |
| FastAPI backend | http://localhost:8000 |
| FastAPI Swagger docs | http://localhost:8000/docs |

The URLs assume the Compose file maps the corresponding container ports to these host ports.

## Option 2: Pull published images from Docker Hub

The frontend and backend images can be published to Docker Hub and pulled onto another machine. PostgreSQL uses the official `postgres:17-alpine` image.

### Docker Hub images

Replace `kaali01` with your Docker Hub username and use the exact repository names and tags you publish.

| Service | Docker Hub image |
|---|---|
| Frontend | `kaali01/waypoint_frontend:v1` |
| Backend | `kaali01/waypoint_backend:v1` |
| Database | `postgres:17-alpine` |

### 1. Log in to Docker Hub

```bash
docker login
```

### 2. Pull the images

```bash
docker pull kaali01/waypoint_frontend:v1
docker pull kaali01/waypoint_backend:v1
docker pull postgres:17-alpine
```

### 3. Configure Compose to use the published images

In `compose.yaml`, configure the frontend and backend services to use the published image names instead of building them locally. For example:

```yaml
services:
  taskflow:
    image: kaali01/waypoint_frontend:v1
    # Keep the remaining frontend configuration:
    # ports, networks, etc.

  web:
    image: kaali01/waypoint_backend:v1
    # Keep the remaining backend configuration:
    # ports, networks, environment, etc.

  db:
    image: postgres:17-alpine
    # Keep the database configuration:
    # environment, networks, volumes, etc.
```

Keep the actual ports, environment variables, networks, volumes, and other settings from your working Compose file. Remove the `build` entries for services when you want Compose to use the already-published images.

Start the application using the pulled images:

```bash
docker compose pull
docker compose up -d
```

Check the services:

```bash
docker compose ps
docker compose logs -f
```

## Docker Networking

The frontend, backend, and database containers communicate through a shared Docker network.

The backend connects to PostgreSQL using the Compose service name as its hostname:

```text
db
```

Inside the backend container, use the database service name rather than `localhost` to reach PostgreSQL. Docker's internal network allows services to discover one another by service name.

## Persistent Storage

PostgreSQL uses a volume mount to preserve database data outside the container's writable filesystem.

Example:

```yaml
volumes:
  - /YOUR/HOST/DATA/PATH:/var/lib/postgresql/data
```

Replace the host path with a suitable directory on your machine. Data stored in the mounted directory remains available when the database container is recreated.

---

## Database

WayPoint uses **PostgreSQL** with **SQLAlchemy** as the ORM.

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

The project ignores files and directories such as:

```text
.env
.venv/
__pycache__/
*.pyc
```

Production deployments should use environment variables or secrets management for:
- Database credentials
- JWT secret key
- API URLs
- Other deployment-specific configuration

Security considerations:
- Never commit real passwords or secrets to GitHub.
- Avoid exposing PostgreSQL directly to the public internet.
- Use strong database credentials.
- Configure appropriate firewall rules.
- Use HTTPS for production deployments.
- Avoid publishing images that contain secrets or sensitive configuration.

---

## Learning Outcomes

Building WayPoint provided practical experience with:

### Full-Stack Development
- React frontend development.
- REST API development using FastAPI.
- JWT authentication.
- PostgreSQL database integration.
- Frontend and backend communication.

### Docker & Containerization
- Writing Dockerfiles.
- Building, tagging, and running Docker images.
- Containerizing frontend and backend applications.
- Running PostgreSQL in a container.
- Container-to-container communication.
- Docker networking.
- Persistent storage using volumes.
- Multi-container management using Docker Compose.
- Publishing and pulling images from Docker Hub.

### Development & Testing
- Git and GitHub workflows.
- Running and troubleshooting applications in Linux environments.

---

## Future Improvements

- Deploy the application to a cloud virtual machine.
- Configure Nginx as a reverse proxy.
- Set up a domain and HTTPS.
- Implement production logging and monitoring.
- Improve deployment automation.
- Explore CI/CD pipelines.

---

**WayPoint — Built, Containerized, and Preparing for Cloud Deployment.**
