import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

/* ─── Contexto ───────────────────────────────────────────────── */
const ToastContext = createContext(null);

/**
 * ToastProvider — envuelve la app (o una sección) para habilitar toasts.
 *
 * Uso:
 *   1. Envuelve tu árbol con <ToastProvider>
 *   2. En cualquier componente hijo: const toast = useToast()
 *      toast.success('Guardado')
 *      toast.error('Error al guardar')
 *      toast.info('Procesando...')
 *      toast.warning('Revisa los campos')
 */
export function ToastProvider({ children, position = 'bottom-right', duration = 4000 }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((message, type = 'info', opts = {}) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, ...opts }]);
    const ms = opts.duration ?? duration;
    if (ms > 0) setTimeout(() => remove(id), ms);
  }, [duration, remove]);

  const api = {
    success: (msg, opts) => add(msg, 'success', opts),
    error:   (msg, opts) => add(msg, 'error',   opts),
    info:    (msg, opts) => add(msg, 'info',     opts),
    warning: (msg, opts) => add(msg, 'warning',  opts),
    remove,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastContainer toasts={toasts} position={position} onRemove={remove} />
    </ToastContext.Provider>
  );
}

/** Hook para disparar toasts desde cualquier componente */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>');
  return ctx;
}

/* ─── Contenedor de toasts ───────────────────────────────────── */
function ToastContainer({ toasts, position, onRemove }) {
  return (
    <div className={`toast-container toast-container--${position}`} aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

/* ─── Toast individual ───────────────────────────────────────── */
function ToastItem({ toast, onRemove }) {
  const ref = useRef(null);

  useEffect(() => {
    // Pequeño retraso para activar la animación de entrada
    requestAnimationFrame(() => {
      if (ref.current) ref.current.classList.add('toast--visible');
    });
  }, []);

  const icons = {
    success: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    error: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    ),
    warning: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    info: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    ),
  };

  return (
    <div ref={ref} className={`toast toast--${toast.type}`} role="status">
      <span className="toast__icon">{icons[toast.type]}</span>
      <span className="toast__message">{toast.message}</span>
      <button
        type="button"
        className="toast__close"
        onClick={() => onRemove(toast.id)}
        aria-label="Cerrar notificación"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  );
}

export default ToastProvider;
