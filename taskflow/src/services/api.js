/**
 * Central HTTP client for talking to the future FastAPI backend.
 *
 * Every other service file (authService, taskService, analyticsService)
 * should go through `apiClient` instead of calling `fetch` directly.
 * That keeps exactly one place to update once the real backend exists:
 *   - base URL
 *   - auth header injection
 *   - error/response shape handling
 *
 * Nothing in this file is called yet in mock mode (see USE_MOCK below),
 * but the shape matches what a FastAPI backend would expect so swapping
 * over is a one-line change per service function.
 */

// Point this at your FastAPI server, e.g. http://localhost:8000/api
export const API_BASE_URL = "http://localhost:8000";

// Toggle this off (or drive it from an env var) once the FastAPI backend
// and endpoints below actually exist.
export const USE_MOCK = false;

function getToken() {
  return localStorage.getItem('waypoint_token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('waypoint_token', token);
  } else {
    localStorage.removeItem('waypoint_token');
  }
}

class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

/**
 * Thin wrapper around fetch that:
 *  - prefixes API_BASE_URL
 *  - attaches the bearer token if present
 *  - parses JSON and throws ApiError on non-2xx responses
 *
 * Expected FastAPI conventions this assumes:
 *  - JSON request/response bodies
 *  - errors returned as { detail: "message" } (FastAPI's default shape)
 *  - auth via `Authorization: Bearer <token>`
 */
export async function apiClient(path, { method = 'GET', body, headers = {} } = {}) {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let payload = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    const message = payload?.detail || payload?.message || `Request failed (${response.status})`;
    throw new ApiError(message, response.status, payload);
  }

  return payload;
}

/** Small helper so mock services can simulate latency realistically. */
export function mockDelay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
