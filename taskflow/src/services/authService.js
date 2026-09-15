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

  const user = {
    id: data.user_id,
    name: data.username,
    email: data.email,
  };

  storeUser(user);

  return { user };
}


// Logout
export async function logout() {
  storeUser(null);
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