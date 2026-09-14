import { STATUS, PRIORITY_LABELS } from '../../utils/mockData';
import { describeDueDate } from '../../utils/dateUtils';
import './TaskCard.css';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const due = describeDueDate(task.dueDate);
  const isDone = task.status === STATUS.DONE;

  return (
    <article className={`task-card${isDone ? ' is-done' : ''}`}>
      <div className="task-card-top">
        <button
          type="button"
          className={`task-check${isDone ? ' is-checked' : ''}`}
          aria-pressed={isDone}
          aria-label={isDone ? 'Mark task as not completed' : 'Mark task as completed'}
          onClick={() => onStatusChange(task, isDone ? STATUS.TODO : STATUS.DONE)}
        >
          {isDone ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : null}
        </button>

        <div className="task-card-body">
          <h3 className="task-title">{task.title}</h3>
          {task.description ? <p className="task-description">{task.description}</p> : null}

          <div className="task-meta">
            <span className={`task-priority priority-${task.priority}`}>
              {PRIORITY_LABELS[task.priority] || 'Medium'}
            </span>
            {due ? (
              <span className={`task-due${due.overdue ? ' is-overdue' : ''}`}>{due.text}</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="task-card-actions">
        {task.status !== STATUS.IN_PROGRESS && !isDone ? (
          <button type="button" className="task-action" onClick={() => onStatusChange(task, STATUS.IN_PROGRESS)}>
            Start
          </button>
        ) : null}
        {task.status === STATUS.IN_PROGRESS ? (
          <button type="button" className="task-action" onClick={() => onStatusChange(task, STATUS.TODO)}>
            Move to to-do
          </button>
        ) : null}
        <button type="button" className="task-action" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button type="button" className="task-action task-action-danger" onClick={() => onDelete(task)}>
          Delete
        </button>
      </div>
    </article>
  );
}
