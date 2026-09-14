import { useState } from 'react';
import { toDateInputValue } from '../../utils/dateUtils';
import './TaskFormModal.css';

const emptyForm = { title: '', description: '', priority: 'medium', dueDate: '' };

export default function TaskFormModal({ initialTask, onClose, onSubmit }) {
  const [form, setForm] = useState(() =>
    initialTask
      ? {
          title: initialTask.title,
          description: initialTask.description || '',
          priority: initialTask.priority || 'medium',
          dueDate: toDateInputValue(initialTask.dueDate),
        }
      : emptyForm
  );
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Give the task a title.');
      return;
    }
    setError('');
    setIsSaving(true);
    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="task-modal-title" onMouseDown={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-panel">
        <h2 id="task-modal-title">{initialTask ? 'Edit task' : 'New task'}</h2>

        {error ? <div className="form-error-banner">{error}</div> : null}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="task-title">Title</label>
            <input
              id="task-title"
              type="text"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. Draft the weekly report"
              autoFocus
            />
          </div>

          <div className="field">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              rows={3}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Add any useful detail (optional)"
            />
          </div>

          <div className="modal-row">
            <div className="field">
              <label htmlFor="task-priority">Priority</label>
              <select id="task-priority" value={form.priority} onChange={(e) => update('priority', e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="task-due">Due date</label>
              <input
                id="task-due"
                type="date"
                value={form.dueDate}
                onChange={(e) => update('dueDate', e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving…' : initialTask ? 'Save changes' : 'Add task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
