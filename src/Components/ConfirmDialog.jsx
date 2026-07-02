import { createContext, useContext, useState, useCallback } from "react";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null);

  const showConfirm = useCallback(
    (message) =>
      new Promise((resolve) => {
        setDialog({ message, resolve });
      }),
    []
  );

  function close(result) {
    dialog?.resolve(result);
    setDialog(null);
  }

  return (
    <ConfirmContext.Provider value={showConfirm}>
      {children}

      {dialog && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          dir="rtl"
        >
          <div className="mx-4 w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <p className="mb-6 text-center text-base font-semibold leading-relaxed text-gray-800">
              {dialog.message}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => close(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                ביטול
              </button>

              <button
                onClick={() => close(true)}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
              >
                אישור
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const showConfirm = useContext(ConfirmContext);
  if (!showConfirm) throw new Error("useConfirm requires <ConfirmProvider>");
  return showConfirm;
}
