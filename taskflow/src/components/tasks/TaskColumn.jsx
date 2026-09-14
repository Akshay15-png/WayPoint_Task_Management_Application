import TaskCard from './TaskCard';
import './TaskColumn.css';

export default function TaskColumn({ title, accent, tasks, onEdit, onDelete, onStatusChange, emptyHint }) {
  return (
    <section className="task-column">
      <header className="task-column-header">
        <span className={`task-column-dot dot-${accent}`} aria-hidden="true" />
        <h2>{title}</h2>
        <span className="task-column-count">{tasks.length}</span>
      </header>

      <div className="task-column-list">
        {tasks.length === 0 ? (
          <p className="task-column-empty">{emptyHint}</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </section>
  );
}
