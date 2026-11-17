# WayPoint — Task Management Frontend

WayPoint is a React-based frontend for a full-stack task management application. It provides an interface for user authentication, task management, dashboards, and analytics.

The frontend is built using **React, Vite, and React Router**, and communicates with a Python/FastAPI backend for authentication and data management.

## Tech Stack

- React
- Vite
- React Router
- JavaScript
- CSS
- Docker
- Nginx

## Features

- User registration and login.
- Dashboard for managing tasks.
- Create, update, and delete tasks.
- Task status and priority management.
- Analytics dashboard.
- API integration with FastAPI backend.
- JWT-based authentication support.

## Project Structure

```text
src/
├── components/
│   ├── auth/        # AuthLayout — shared shell for Login/Register
│   ├── layout/      # Sidebar, AppLayout — shared shell for app pages
│   ├── tasks/       # TaskCard, TaskColumn, TaskFormModal
│   ├── charts/      # StatCard, BarChartCard, LineChartCard
│   └── common/      # ProtectedRoute
│
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   └── Analytics.jsx
│
├── context/
│   ├── AuthContext.jsx
│   └── TaskContext.jsx
│
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── taskService.js
│   └── analyticsService.js
│
├── utils/
│   ├── mockData.js
│   └── dateUtils.js
│
├── styles/
│   ├── variables.css
│   └── global.css
│
├── App.jsx
└── main.jsx
```

## Running Locally

### Prerequisites

- Node.js
- npm

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed in your terminal, usually:

```text
http://localhost:5173
```

## Backend Integration

The frontend communicates with the FastAPI backend through the service layer in `src/services/`.

All API requests are managed through a shared API client.

### API Configuration

Configure the following environment variables in your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK=false
```

The frontend supports the following backend operations:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/login` | User login |
| POST | `/auth/register` | User registration |
| POST | `/auth/logout` | User logout |
| GET | `/tasks` | Fetch tasks |
| POST | `/tasks` | Create a task |
| PATCH | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |
| GET | `/analytics/summary` | Fetch analytics |

The API client also handles bearer-token authentication and API error responses.

## Docker

The frontend is containerized using Docker and served through Nginx.

### Build Docker Image

```bash
docker build -t waypoint:v1 .
```

### Run Docker Container

```bash
docker run -d -p 80:80 --name frontend waypoint:v1
```

Access the frontend:

```text
http://localhost
```

### Docker Hub

The frontend Docker image will be published to Docker Hub.

```bash
docker pull YOUR_DOCKERHUB_USERNAME/waypoint-frontend:v1
```

Replace `YOUR_DOCKERHUB_USERNAME` with your Docker Hub username.

## Future Improvements

- Cloud deployment.
- Production API configuration.
- Improved frontend error handling.
- Performance optimization.
- Automated frontend deployment.

---

**WayPoint Frontend — React-powered interface for task management.**
