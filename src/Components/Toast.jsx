import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

let _nextId = 0;

const TYPE_CONFIG = {
  success: {
    bar: "bg-[#2f6b46]",
    wrap: "bg-[#f0faf4] border-[#c3e6d3] text-[#2f6b46]",
    icon: "✓",
  },
  error: {
    bar: "bg-red-500",
    wrap: "bg-red-50 border-red-200 text-red-700",
    icon: "✕",
  },
  info: {
    bar: "bg-[#4f46e5]",
    wrap: "bg-indigo-50 border-indigo-200 text-indigo-700",
    icon: "ℹ",
  },
};

function ToastItem({ toast, onClose }) {
  const cfg = TYPE_CONFIG[toast.type] ?? TYPE_CONFIG.info;
  return (
    <div
      className={`toast-enter flex w-80 items-start gap-3 rounded-2xl border px-4 py-3 shadow-xl ${cfg.wrap}`}
      dir="rtl"
    >
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${cfg.bar}`}
      >
        {cfg.icon}
      </span>
      <p className="flex-1 text-sm font-semibold leading-snug">{toast.message}</p>
      <button
        onClick={onClose}
        className="mt-0.5 text-lg leading-none opacity-40 transition hover:opacity-80"
      >
        ×
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "info") => {
      const id = ++_nextId;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => remove(id), 4500);
    },
    [remove]
  );

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed left-1/2 top-5 z-[9999] flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const showToast = useContext(ToastContext);
  if (!showToast) throw new Error("useToast requires <ToastProvider>");
  return showToast;
}
