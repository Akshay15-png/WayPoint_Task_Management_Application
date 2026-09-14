import { apiClient, USE_MOCK, mockDelay } from './api';
import { fetchTasks } from './taskService';
import { STATUS } from '../utils/mockData';

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Computes current + best streak (consecutive days with >=1 completed task)
 * from a list of completed-task dates. This runs client-side against mock
 * data for now; a FastAPI endpoint could later return { current, best }
 * directly and this function would no longer be needed on the frontend.
 */
function computeStreaks(completedDates) {
  const daySet = new Set(completedDates.map((d) => startOfDay(d).getTime()));
  const days = [...daySet].sort((a, b) => a - b);

  if (days.length === 0) return { current: 0, best: 0 };

  let best = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    const diff = (days[i] - days[i - 1]) / 86400000;
    if (diff === 1) {
      run += 1;
    } else if (diff > 1) {
      run = 1;
    }
    best = Math.max(best, run);
  }

  // Current streak: walk backward from today (or yesterday, so a streak
  // doesn't reset to 0 just because today isn't finished yet).
  const today = startOfDay(new Date()).getTime();
  const daySetHas = (t) => daySet.has(t);
  let current = 0;
  let cursor = today;
  if (!daySetHas(cursor)) {
    cursor -= 86400000; // allow "yesterday" as the most recent active day
  }
  while (daySetHas(cursor)) {
    current += 1;
    cursor -= 86400000;
  }

  return { current, best };
}

function last24hBuckets(completedDates) {
  const now = new Date();
  const buckets = new Array(8).fill(0); // 8 x 3-hour buckets = 24h
  const cutoffs = [];
  for (let i = 7; i >= 0; i--) {
    cutoffs.push(new Date(now.getTime() - i * 3 * 60 * 60 * 1000));
  }
  completedDates.forEach((d) => {
    const hoursAgo = (now - d) / (60 * 60 * 1000);
    if (hoursAgo >= 0 && hoursAgo <= 24) {
      const bucketIndex = 7 - Math.min(7, Math.floor(hoursAgo / 3));
      buckets[bucketIndex] += 1;
    }
  });
  return cutoffs.map((c, i) => ({
    label: c.toLocaleTimeString([], { hour: 'numeric' }),
    completed: buckets[i],
  }));
}

function lastNDaysCompleted(completedDates, n) {
  const today = startOfDay(new Date());
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const day = new Date(today.getTime() - i * 86400000);
    const count = completedDates.filter((d) => isSameDay(d, day)).length;
    days.push({
      label: day.toLocaleDateString([], { weekday: 'short' }),
      date: day.toISOString(),
      completed: count,
    });
  }
  return days;
}

function lastNWeeksCompleted(completedDates, n) {
  const today = startOfDay(new Date());
  const weeks = [];
  for (let i = n - 1; i >= 0; i--) {
    const weekEnd = new Date(today.getTime() - i * 7 * 86400000);
    const weekStart = new Date(weekEnd.getTime() - 6 * 86400000);
    const count = completedDates.filter((d) => d >= weekStart && d <= weekEnd).length;
    weeks.push({
      label: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`,
      completed: count,
    });
  }
  return weeks;
}

/**
 * GET /analytics/summary — everything the Analytics page needs.
 * In mock mode this is derived from the task list; a real backend would
 * likely precompute this in SQL and return the same shape.
 */
export async function fetchAnalyticsSummary() {
  if (USE_MOCK) {
    await mockDelay();
    const tasks = await fetchTasks();
    const completed = tasks.filter((t) => t.status === STATUS.DONE && t.completedAt);
    const completedDates = completed.map((t) => new Date(t.completedAt));

    const streaks = computeStreaks(completedDates);

    return {
      totalTasks: tasks.length,
      completedTasks: completed.length,
      remainingTasks: tasks.length - completed.length,
      currentStreak: streaks.current,
      bestStreak: streaks.best,
      last24h: last24hBuckets(completedDates),
      weekly: lastNDaysCompleted(completedDates, 7),
      monthly: lastNWeeksCompleted(completedDates, 6),
    };
  }

  return apiClient('/analytics/summary');
}
