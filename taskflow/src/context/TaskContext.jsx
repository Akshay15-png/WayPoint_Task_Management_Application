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
    await taskService.createTask(input);
    await loadTasks();
  }

  async function editTask(id, changes) {
    await taskService.updateTask(id, changes);
    await loadTasks();
  }

  async function changeStatus(id, status) {
    await taskService.setTaskStatus(id, status);
    await loadTasks();
  }

  async function removeTask(id) {
    await taskService.deleteTask(id);
    await loadTasks();
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

