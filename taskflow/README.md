# Waypoint — Task Management Frontend

A frontend-only React app (Vite + React Router) for tracking tasks and
streaks. No backend, database, or auth server is included — this is built
so a Python/FastAPI backend can be dropped in later with minimal changes.

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

There's nothing to configure to try it out: authentication and task data
are mocked in `localStorage` so you can register, log in, create tasks,
and see analytics update immediately.

## Project structure

```
src/
├── components/
│   ├── auth/        # AuthLayout — shared shell for Login/Register
│   ├── layout/       # Sidebar, AppLayout — shared shell for app pages
│   ├── tasks/        # TaskCard, TaskColumn, TaskFormModal
│   ├── charts/       # StatCard, BarChartCard, LineChartCard
│   └── common/       # ProtectedRoute
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   └── Analytics.jsx
├── context/
│   ├── AuthContext.jsx   # current user + login/register/logout
│   └── TaskContext.jsx   # task list + create/update/delete/status
├── services/
│   ├── api.js               # shared fetch wrapper (base URL, auth header, errors)
│   ├── authService.js       # login/register/logout
│   ├── taskService.js       # task CRUD
│   └── analyticsService.js  # streaks + chart data
├── utils/
│   ├── mockData.js   # seed data + shared enums (STATUS, PRIORITY_LABELS)
│   └── dateUtils.js
├── styles/
│   ├── variables.css # design tokens: color, type, spacing
│   └── global.css    # resets + shared .btn/.field/.card classes
├── App.jsx
└── main.jsx
```

## Connecting the FastAPI backend later

All data access goes through `src/services/*`, never straight from a
component. Each service function currently has two branches guarded by
`USE_MOCK` (see `src/services/api.js`):

```js
export async function fetchTasks() {
  if (USE_MOCK) {
    // reads from localStorage
  }
  return apiClient('/tasks'); // <- already written and ready
}
```

To connect a real backend:

1. Set `VITE_API_BASE_URL` in a `.env` file to your FastAPI server, e.g.
   `VITE_API_BASE_URL=http://localhost:8000/api` (see `.env.example`).
2. Set `VITE_USE_MOCK=false`.
3. Make sure your FastAPI endpoints match what `src/services/*.js`
   already expects:
   - `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`
   - `GET /tasks`, `POST /tasks`, `PATCH /tasks/:id`, `DELETE /tasks/:id`
   - `GET /analytics/summary`
4. `apiClient` in `src/services/api.js` already attaches a bearer token
   from `localStorage` and unwraps FastAPI's default `{ detail }` error
   shape — adjust there if your backend differs.

No component code needs to change for this swap; components only ever
call functions from `services/` and read from `AuthContext`/`TaskContext`.

## Notes

- Logout is currently frontend-only (clears local session state) as
  requested — wire it to a real `/auth/logout` call the same way as the
  rest of `authService.js` once the backend exists.
- Charts use [Recharts](https://recharts.org/), already listed in
  `package.json`.
