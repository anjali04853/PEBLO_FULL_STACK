import { createContext, useContext, useState, useCallback } from 'react';
import Icon from './Icon.jsx';

const ToastContext = createContext(null);

/** Minimal toast system — one message at a time, auto-dismisses. */
export function ToastProvider({ children }) {
  const [msg, setMsg] = useState(null);

  const show = useCallback((text) => {
    setMsg(text);
    setTimeout(() => setMsg(null), 2800);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {msg && (
        <div className="toast">
          <Icon name="check" size={16} />
          {msg}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
