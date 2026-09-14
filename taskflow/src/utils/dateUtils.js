/** Returns { text, overdue } describing how a due date relates to today. */
export function describeDueDate(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  const today = new Date();
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((date - today) / 86400000);

  if (diffDays === 0) return { text: 'Due today', overdue: false };
  if (diffDays === 1) return { text: 'Due tomorrow', overdue: false };
  if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, overdue: true };
  return { text: `Due in ${diffDays}d`, overdue: false };
}

/** yyyy-mm-dd for populating <input type="date"> from an ISO string. */
export function toDateInputValue(iso) {
  return iso ? iso.slice(0, 10) : '';
}
