'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * AnimatedModal: Reusable wrapper providing smooth entrance & exit animations.
 * When isOpen becomes false (or onClose is triggered), it applies .closing
 * allowing the CSS transform and fadeOut animations to run smoothly before unmounting.
 */
export function AnimatedModal({
  isOpen,
  onClose,
  maxWidth = '640px',
  children,
  className = '',
}) {
  const [shouldRender, setShouldRender] = useState(Boolean(isOpen));
  const [isClosing, setIsClosing] = useState(false);
  const timerRef = useRef(null);
  const cachedChildrenRef = useRef(null);

  if (children) {
    cachedChildrenRef.current = children;
  }

  const handleClose = useCallback((e) => {
    if (e) {
      e.stopPropagation?.();
      e.preventDefault?.();
    }
    if (isClosing) return;
    onClose?.();
  }, [isClosing, onClose]);

  useEffect(() => {
    if (isOpen) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setShouldRender(true);
      setIsClosing(false);
      document.body.style.overflow = 'hidden';
    } else if (shouldRender && !isClosing) {
      setIsClosing(true);
      timerRef.current = setTimeout(() => {
        setIsClosing(false);
        setShouldRender(false);
        cachedChildrenRef.current = null;
        document.body.style.overflow = 'unset';
      }, 200);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, shouldRender, isClosing]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && shouldRender && !isClosing) {
        handleClose(e);
      }
    };
    if (shouldRender) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shouldRender, isClosing, handleClose]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!shouldRender) return null;

  const contentToRender = children || (isClosing ? cachedChildrenRef.current : null);

  return (
    <div
      className={`resp-modal-backdrop ${isClosing ? 'closing' : ''} ${className}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose(e);
        }
      }}
    >
      <div
        className={`resp-modal-card ${isClosing ? 'closing' : ''}`}
        style={{ maxWidth, maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {typeof contentToRender === 'function'
          ? contentToRender({ close: handleClose })
          : contentToRender}
      </div>
    </div>
  );
}

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '640px',
}) {
  return (
    <AnimatedModal isOpen={isOpen} onClose={onClose} maxWidth={maxWidth}>
      {({ close }) => (
        <>
          <div className="resp-modal-header">
            <div>
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  margin: 0,
                  minWidth: 0,
                  overflowWrap: 'anywhere',
                }}
              >
                {title}
              </h3>
              {subtitle && (
                <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                  {subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                close(e);
              }}
              style={{
                fontSize: '1.5rem',
                color: '#94a3b8',
                lineHeight: 1,
                padding: '0.25rem',
                borderRadius: '6px',
                flexShrink: 0,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.15s',
              }}
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
          <div className="resp-modal-body">
            {typeof children === 'function' ? children({ close }) : children}
          </div>
        </>
      )}
    </AnimatedModal>
  );
}
