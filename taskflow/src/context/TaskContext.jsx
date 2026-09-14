import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as taskService from '../services/taskService';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await taskService.fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function addTask(input) {
    const task = await taskService.createTask(input);
    setTasks((prev) => [task, ...prev]);
    return task;
  }

  async function editTask(id, changes) {
    const updated = await taskService.updateTask(id, changes);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }

  async function changeStatus(id, status) {
    const updated = await taskService.setTaskStatus(id, status);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }

  async function removeTask(id) {
    await taskService.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  const value = {
    tasks,
    isLoading,
    error,
    reload: loadTasks,
    addTask,
    editTask,
    changeStatus,
    removeTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within a TaskProvider');
  return ctx;
}
