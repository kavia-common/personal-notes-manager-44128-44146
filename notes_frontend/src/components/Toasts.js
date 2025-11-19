import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastCtx = createContext(null);

// PUBLIC_INTERFACE
export function useToasts() {
  return useContext(ToastCtx);
}

// PUBLIC_INTERFACE
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback((msg, opts = {}) => {
    const id = `${Date.now()}-${Math.random()}`;
    const toast = {
      id,
      message: msg,
      type: opts.type || 'info',
      timeout: opts.timeout ?? 2500
    };
    setToasts((t) => [toast, ...t]);
    if (toast.timeout > 0) {
      setTimeout(() => remove(id), toast.timeout);
    }
    return id;
  }, [remove]);

  return (
    <ToastCtx.Provider value={{ push, remove }}>
      {children}
      <div className="toast-container" role="status" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type === 'error' ? 'error' : ''}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
