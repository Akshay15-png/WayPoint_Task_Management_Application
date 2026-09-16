import { apiClient } from './api';

// Register a new user
export async function register({ name, email, password }) {
  const data = await apiClient(
    "/auth/register",
    {
      method: "POST",
      body: {
        name,
        email,
        passwd: password,
      },
    }
  );

  const user = {
    id: data.user_id,
    name: data.username,
    email: data.email,
  };

  storeUser(user);

  return { user };
}

// Login
export async function login({ email, password }) {
  const data = await apiClient(
    "/auth/login",
    {
      method: "POST",
      body: {
        email,
        passwd: password,
      },
    }
  );

  localStorage.setItem("access_token", data.access_token);

  return {
    user: data.user,
    token: data.access_token,
  };
}


// Logout
export function logout() {
  localStorage.removeItem("access_token");
}


// Check whether a JWT exists
export function isAuthenticated() {
  return !!localStorage.getItem("access_token");
}


// Get currently stored user
export function getStoredUser() {
  const raw = localStorage.getItem("waypoint_user");
  return raw ? JSON.parse(raw) : null;
}


// Store/remove user
export function storeUser(user) {
  if (user) {
    localStorage.setItem("waypoint_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("waypoint_user");
  }
}