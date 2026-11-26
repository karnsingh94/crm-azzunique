'use client';

export default function ToastContainer({ toasts, onRemove }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="resp-toast-container">
      {toasts.map((t) => {
        const rawTitle = typeof t.title === 'string'
          ? t.title
          : (t.title?.title || t.title?.message || (t.title ? String(t.title) : 'Notification'));
        const rawMessage = typeof t.message === 'string'
          ? t.message
          : (t.message?.message || (t.message ? String(t.message) : null));

        const explicitType = String(t.type || 'info').toLowerCase();
        const combinedText = `${rawTitle} ${rawMessage || ''}`;
        const isDeactivateOrDelete = /deactivat|delet|remov|reject|terminat/i.test(combinedText);
        const isWarningText = /warn|caution|invalid|missing/i.test(combinedText);

        let finalType = explicitType;
        if (explicitType === 'danger' || explicitType === 'error' || isDeactivateOrDelete) {
          finalType = 'danger';
        } else if (explicitType === 'warning' || explicitType === 'warn' || isWarningText) {
          finalType = 'warning';
        } else if (explicitType === 'success') {
          finalType = 'success';
        } else {
          finalType = 'info';
        }

        const icon = finalType === 'success'
          ? '✅'
          : finalType === 'danger'
            ? '🔴'
            : finalType === 'warning'
              ? '⚠️'
              : 'ℹ️';

        return (
          <div
            key={t.id}
            className={`resp-toast-item ${finalType}`}
          >
            <span style={{ fontSize: '1.15rem', lineHeight: 1 }}>{icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'inherit' }}>{rawTitle}</div>
              {rawMessage && (
                <div style={{ fontSize: '0.78rem', color: 'inherit', opacity: 0.9, marginTop: '2px', lineHeight: 1.4 }}>
                  {rawMessage}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => onRemove(t.id)}
              style={{
                color: 'inherit',
                opacity: 0.65,
                fontSize: '1.25rem',
                lineHeight: 1,
                padding: '0 4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label="Close notification"
            >
              &times;
            </button>
          </div>
        );
      })}
    </div>
  );
}
