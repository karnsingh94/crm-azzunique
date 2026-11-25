'use client';

import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = '640px' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="resp-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="resp-modal-card"
        style={{
          maxWidth,
        }}
      >
        <div className="resp-modal-header">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0, minWidth: 0, overflowWrap: 'anywhere' }}>{title}</h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              fontSize: '1.5rem',
              color: '#94a3b8',
              lineHeight: 1,
              padding: '0.25rem',
              borderRadius: '6px',
              flexShrink: 0,
              transition: 'color 0.15s',
            }}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div className="resp-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
