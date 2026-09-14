import { apiClient, USE_MOCK, mockDelay, setToken } from './api';
import { mockUser } from '../utils/mockData';

const MOCK_USERS_KEY = 'waypoint_mock_users';

function readMockUsers() {
  const raw = localStorage.getItem(MOCK_USERS_KEY);
  if (raw) return JSON.parse(raw);
  const seeded = [{ ...mockUser, password: 'password123' }];
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(seeded));
  return seeded;
}

function writeMockUsers(users) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

/**
 * login({ email, password }) -> { user, token }
 *
 * Real FastAPI call would look like:
 *   apiClient('/auth/login', { method: 'POST', body: { email, password } })
 * with the backend returning { user: {...}, access_token: '...' }.
 */
export async function login({ email, password }) {
  if (USE_MOCK) {
    await mockDelay();
    const users = readMockUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found || found.password !== password) {
      throw new Error('Incorrect email or password.');
    }
    const token = `mock-token-${found.id}`;
    setToken(token);
    const { password: _pw, ...user } = found;
    return { user, token };
  }

  const data = await apiClient('/auth/login', { method: 'POST', body: { email, password } });
  setToken(data.access_token);
  return { user: data.user, token: data.access_token };
}

/**
 * register({ name, email, password }) -> { user, token }
 *
 * Real FastAPI call would POST to /auth/register.
 */
export async function register({ name, email, password }) {
  if (USE_MOCK) {
    await mockDelay();
    const users = readMockUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with that email already exists.');
    }
    const newUser = { id: `u${Date.now()}`, name, email, password };
    writeMockUsers([...users, newUser]);
    const token = `mock-token-${newUser.id}`;
    setToken(token);
    const { password: _pw, ...user } = newUser;
    return { user, token };
  }

  const data = await apiClient('/auth/register', { method: 'POST', body: { name, email, password } });
  setToken(data.access_token);
  return { user: data.user, token: data.access_token };
}

/** Frontend-only logout for now: clears local session state. */
export async function logout() {
  if (USE_MOCK) {
    await mockDelay(120);
    setToken(null);
    return;
  }
  await apiClient('/auth/logout', { method: 'POST' });
  setToken(null);
}

export function getStoredUser() {
  const raw = localStorage.getItem('waypoint_user');
  return raw ? JSON.parse(raw) : null;
}

export function storeUser(user) {
  if (user) {
    localStorage.setItem('waypoint_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('waypoint_user');
  }
}
