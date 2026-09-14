import './AuthLayout.css';

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="auth-screen">
      <div className="auth-panel">
        <div className="auth-panel-copy">
          <span className="auth-brand-mark" aria-hidden="true" />
          <h1>Plan the day.<br />Keep the streak.</h1>
          <p>
            Waypoint is a quiet place to track what needs doing — one list,
            one streak, one clear picture of your week.
          </p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-card">
          {eyebrow ? <span className="auth-eyebrow">{eyebrow}</span> : null}
          <h2>{title}</h2>
          {subtitle ? <p className="auth-subtitle">{subtitle}</p> : null}
          {children}
        </div>
      </div>
    </div>
  );
}
