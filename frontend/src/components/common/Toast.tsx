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
    <div className="fixed bottom-6 right-6 z-[120] flex flex-col gap-2.5 max-w-[min(24rem,calc(100vw-2rem))] w-full pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_12px_36px_rgba(15,23,42,0.12)] text-slate-800 animate-in slide-in-from-bottom-3 fade-in duration-200 group"
          >
            {/* Type Icon Badge */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                isSuccess
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  : isError
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-blue-50 text-[#0037b0] border-blue-200'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isSuccess ? 'check_circle' : isError ? 'error' : 'info'}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider ${
                    isSuccess
                      ? 'text-emerald-700'
                      : isError
                      ? 'text-rose-700'
                      : 'text-[#0037b0]'
                  }`}
                >
                  {isSuccess ? 'Success' : isError ? 'Attention Required' : 'Portal Update'}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-700 leading-snug">
                {toast.message}
              </p>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1 rounded-full transition-colors shrink-0 -mr-1 -mt-0.5"
              aria-label="Close notification"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
