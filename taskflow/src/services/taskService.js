import { apiClient } from './api';

/** GET /tasks — list all tasks for the current user. */
export async function fetchTasks() {
  return apiClient('/tasks');
}

/** POST /tasks — create a task. */
export async function createTask({ title, description, priority, dueDate }) {
  return apiClient('/tasks', {
    method: 'POST',
    body: {
      title,
      description,
      priority,
      dueDate,
    },
  });
}

/** PATCH /tasks/:id — update a task. */
export async function updateTask(id, changes) {
  return apiClient(`/tasks/${id}`, {
    method: 'PATCH',
    body: changes,
  });
}

/** PATCH /tasks/:id — change task status. */
export async function setTaskStatus(id, status) {
  return updateTask(id, {
    status,
  });
}

/** DELETE /tasks/:id */
export async function deleteTask(id) {
  return apiClient(`/tasks/${id}`, {
    method: 'DELETE',
  });
}
