// Seed data for the mock services. Swap for real API responses later —
// nothing else in the app needs to change shape-wise if the FastAPI
// backend returns tasks/users in this same structure.

export const STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
};

export const STATUS_LABELS = {
  [STATUS.TODO]: 'To do',
  [STATUS.IN_PROGRESS]: 'In progress',
  [STATUS.DONE]: 'Done',
};

export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

function daysAgoISO(days, hour = 9) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export const initialTasks = [
  {
    id: 't1',
    title: 'Wireframe the onboarding flow',
    description: 'Rough out screens for first-run signup and empty states.',
    status: STATUS.DONE,
    priority: 'high',
    dueDate: daysAgoISO(6),
    createdAt: daysAgoISO(7),
    completedAt: daysAgoISO(6, 17),
  },
  {
    id: 't2',
    title: 'Fix sidebar collapse on tablet widths',
    description: 'Sidebar overlaps content between 768px and 1024px.',
    status: STATUS.DONE,
    priority: 'medium',
    dueDate: daysAgoISO(5),
    createdAt: daysAgoISO(6),
    completedAt: daysAgoISO(5, 14),
  },
  {
    id: 't3',
    title: 'Write API contract for tasks endpoint',
    description: 'Draft request/response schema so FastAPI work can start.',
    status: STATUS.DONE,
    priority: 'high',
    dueDate: daysAgoISO(4),
    createdAt: daysAgoISO(5),
    completedAt: daysAgoISO(4, 11),
  },
  {
    id: 't4',
    title: 'Review pull request from design system',
    description: 'Check the new button and input component variants.',
    status: STATUS.DONE,
    priority: 'low',
    dueDate: daysAgoISO(3),
    createdAt: daysAgoISO(4),
    completedAt: daysAgoISO(3, 10),
  },
  {
    id: 't5',
    title: 'Prep analytics chart data shape',
    description: 'Decide how daily/weekly/monthly completion gets aggregated.',
    status: STATUS.DONE,
    priority: 'medium',
    dueDate: daysAgoISO(2),
    createdAt: daysAgoISO(3),
    completedAt: daysAgoISO(2, 16),
  },
  {
    id: 't6',
    title: 'Set up authentication screens',
    description: 'Login and register forms with client-side validation.',
    status: STATUS.DONE,
    priority: 'high',
    dueDate: daysAgoISO(1),
    createdAt: daysAgoISO(2),
    completedAt: daysAgoISO(1, 13),
  },
  {
    id: 't7',
    title: 'Polish task card hover states',
    description: 'Add subtle motion on hover and drag affordance.',
    status: STATUS.DONE,
    priority: 'low',
    dueDate: daysAgoISO(0),
    createdAt: daysAgoISO(1),
    completedAt: daysAgoISO(0, 8),
  },
  {
    id: 't8',
    title: 'Connect task list to mock service layer',
    description: 'Read/write through services/taskService instead of local state.',
    status: STATUS.IN_PROGRESS,
    priority: 'high',
    dueDate: daysAgoISO(-1),
    createdAt: daysAgoISO(2),
    completedAt: null,
  },
  {
    id: 't9',
    title: 'Design empty state illustration',
    description: 'For when a user has zero tasks in a column.',
    status: STATUS.IN_PROGRESS,
    priority: 'low',
    dueDate: daysAgoISO(-2),
    createdAt: daysAgoISO(1),
    completedAt: null,
  },
  {
    id: 't10',
    title: 'Draft FastAPI schema doc for teammates',
    description: 'Share expected shapes for User, Task, and Analytics.',
    status: STATUS.TODO,
    priority: 'medium',
    dueDate: daysAgoISO(-3),
    createdAt: daysAgoISO(0),
    completedAt: null,
  },
  {
    id: 't11',
    title: 'Accessibility pass on forms',
    description: 'Labels, focus order, and error announcements.',
    status: STATUS.TODO,
    priority: 'medium',
    dueDate: daysAgoISO(-4),
    createdAt: daysAgoISO(0),
    completedAt: null,
  },
  {
    id: 't12',
    title: 'Plan logout + session expiry handling',
    description: 'Decide UX for expired tokens once auth is real.',
    status: STATUS.TODO,
    priority: 'low',
    dueDate: daysAgoISO(-5),
    createdAt: daysAgoISO(0),
    completedAt: null,
  },
];

export const mockUser = {
  id: 'u1',
  name: 'Alex Rivera',
  email: 'alex@example.com',
};
