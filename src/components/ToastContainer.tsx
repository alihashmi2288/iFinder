import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useAppStore } from '../store/AppContext';

export const ToastContainer: React.FC = () => {
  const { state, dismissToast } = useAppStore();

  if (state.toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-20 sm:bottom-4 right-4 z-[90] flex flex-col gap-2 max-w-sm w-[calc(100%-2rem)] pointer-events-none"
    >
      {state.toasts.map((toast) => {
        const isSuccess = toast.variant === 'success';
        const isDanger = toast.variant === 'danger';
        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 rounded-xl px-4 py-3 shadow-lg border text-sm transition-all ${
              isSuccess
                ? 'bg-verified-bg text-verified-text border-verified-border'
                : isDanger
                ? 'bg-paper text-danger border-danger'
                : 'bg-navy-800 text-paper border-navy-700'
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.75} />
            ) : isDanger ? (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.75} />
            ) : (
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-gold-500" strokeWidth={1.75} />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold leading-snug">{toast.title}</p>
              {toast.description && (
                <p className="text-xs opacity-85 mt-0.5 leading-snug">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="p-1 rounded-md opacity-70 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-gold-500"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
