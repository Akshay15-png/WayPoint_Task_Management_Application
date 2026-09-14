import { useMemo, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import TaskColumn from '../components/tasks/TaskColumn';
import TaskFormModal from '../components/tasks/TaskFormModal';
import { useTasks } from '../context/TaskContext';
import { STATUS } from '../utils/mockData';
import './Dashboard.css';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'high', label: 'High priority' },
];

export default function Dashboard() {
  const { tasks, isLoading, error, addTask, editTask, removeTask, changeStatus } = useTasks();
  const [modalState, setModalState] = useState(null); // null | 'create' | task
  const [filter, setFilter] = useState('all');

  const filteredTasks = useMemo(() => {
    if (filter === 'high') return tasks.filter((t) => t.priority === 'high');
    return tasks;
  }, [tasks, filter]);

  const columns = useMemo(
    () => ({
      todo: filteredTasks.filter((t) => t.status === STATUS.TODO),
      in_progress: filteredTasks.filter((t) => t.status === STATUS.IN_PROGRESS),
      done: filteredTasks.filter((t) => t.status === STATUS.DONE),
    }),
    [filteredTasks]
  );

  function openCreate() {
    setModalState('create');
  }

  function openEdit(task) {
    setModalState(task);
  }

  function closeModal() {
    setModalState(null);
  }

  async function handleSubmit(values) {
    if (modalState === 'create') {
      await addTask(values);
    } else {
      await editTask(modalState.id, values);
    }
  }

  async function handleDelete(task) {
    if (window.confirm(`Delete "${task.title}"? This can't be undone.`)) {
      await removeTask(task.id);
    }
  }

  async function handleStatusChange(task, status) {
    await changeStatus(task.id, status);
  }

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <h1>Your tasks</h1>
          <p className="page-subtitle">
            {tasks.length} total · {columns.done.length} completed
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          + New task
        </button>
      </div>

      <div className="dashboard-filters">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`filter-pill${filter === f.id ? ' is-active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error ? <div className="form-error-banner">{error}</div> : null}

      {isLoading ? (
        <p className="dashboard-loading">Loading your tasks…</p>
      ) : (
        <div className="task-board">
          <TaskColumn
            title="To do"
            accent="todo"
            tasks={columns.todo}
            onEdit={openEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            emptyHint="Nothing queued up. Add a task to get started."
          />
          <TaskColumn
            title="In progress"
            accent="progress"
            tasks={columns.in_progress}
            onEdit={openEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            emptyHint="Move a task here once you start it."
          />
          <TaskColumn
            title="Done"
            accent="done"
            tasks={columns.done}
            onEdit={openEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            emptyHint="Completed tasks will show up here."
          />
        </div>
      )}

      {modalState ? (
        <TaskFormModal
          initialTask={modalState === 'create' ? null : modalState}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      ) : null}
    </AppLayout>
  );
}
