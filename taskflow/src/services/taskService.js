import { apiClient, USE_MOCK, mockDelay } from './api';
import { initialTasks, STATUS } from '../utils/mockData';

const TASKS_KEY = 'waypoint_mock_tasks';

function readTasks() {
  const raw = localStorage.getItem(TASKS_KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(TASKS_KEY, JSON.stringify(initialTasks));
  return initialTasks;
}

function writeTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

/** GET /tasks — list all tasks for the current user. */
export async function fetchTasks() {
  if (USE_MOCK) {
    await mockDelay();
    return readTasks();
  }
  return apiClient('/tasks');
}

/** POST /tasks — create a task. */
export async function createTask({ title, description, priority, dueDate }) {
  if (USE_MOCK) {
    await mockDelay();
    const tasks = readTasks();
    const task = {
      id: `t${Date.now()}`,
      title,
      description: description || '',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      status: STATUS.TODO,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    const updated = [task, ...tasks];
    writeTasks(updated);
    return task;
  }
  return apiClient('/tasks', { method: 'POST', body: { title, description, priority, dueDate } });
}

/** PATCH /tasks/:id — update any subset of task fields. */
export async function updateTask(id, changes) {
  if (USE_MOCK) {
    await mockDelay();
    const tasks = readTasks();
    let updatedTask = null;
    const updated = tasks.map((t) => {
      if (t.id !== id) return t;
      updatedTask = { ...t, ...changes };
      return updatedTask;
    });
    writeTasks(updated);
    return updatedTask;
  }
  return apiClient(`/tasks/${id}`, { method: 'PATCH', body: changes });
}

/** PATCH /tasks/:id with a status transition + completedAt bookkeeping. */
export async function setTaskStatus(id, status) {
  const changes = {
    status,
    completedAt: status === STATUS.DONE ? new Date().toISOString() : null,
  };
  return updateTask(id, changes);
}

/** DELETE /tasks/:id */
export async function deleteTask(id) {
  if (USE_MOCK) {
    await mockDelay();
    const tasks = readTasks();
    writeTasks(tasks.filter((t) => t.id !== id));
    return { id };
  }
  return apiClient(`/tasks/${id}`, { method: 'DELETE' });
}
