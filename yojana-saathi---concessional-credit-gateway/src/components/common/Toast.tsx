import React from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl shadow-xl backdrop-blur-md border animate-in slide-in-from-top-2 duration-200 text-xs font-medium ${
            toast.type === 'success'
              ? 'bg-[#0f172a] text-white border-emerald-500/30'
              : toast.type === 'error'
              ? 'bg-[#ba1a1a] text-white border-red-400/30'
              : 'bg-[#191c1e] text-white border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`material-symbols-outlined text-[18px] ${
                toast.type === 'success'
                  ? 'text-emerald-400'
                  : toast.type === 'error'
                  ? 'text-red-200'
                  : 'text-blue-300'
              }`}
            >
              {toast.type === 'success'
                ? 'check_circle'
                : toast.type === 'error'
                ? 'error'
                : 'info'}
            </span>
            <p className="leading-snug">{toast.message}</p>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-white/70 hover:text-white p-1 rounded-full transition-colors ml-2"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};
