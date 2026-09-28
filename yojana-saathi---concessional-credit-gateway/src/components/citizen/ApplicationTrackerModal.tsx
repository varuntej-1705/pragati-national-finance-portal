import React from 'react';
import { ApplicationTrackerItem } from '../../types';

interface ApplicationTrackerModalProps {
  application: ApplicationTrackerItem;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type: 'success' | 'info') => void;
}

export const ApplicationTrackerModal: React.FC<ApplicationTrackerModalProps> = ({
  application,
  isOpen,
  onClose,
  onShowToast
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0037b0] text-[22px]">timeline</span>
            <h3 className="text-base font-bold text-[#191c1e]">Application Status Tracker</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Top Info Box */}
        <div className="p-4 rounded-2xl bg-[#f2f4f6] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#0037b0] tracking-wider">
              {application.refNumber}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
              In-Verification
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#191c1e]">{application.schemeTitle}</h4>
          <div className="flex justify-between items-center text-xs text-slate-600">
            <span>Channel: {application.channelPartnerName}</span>
            <span className="font-bold text-[#0037b0]">₹{application.requestedAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Officer Inspection Schedule Card */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
            <span className="material-symbols-outlined text-[18px] text-amber-700">event</span>
            <span>Field Inspection Scheduled</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Bank Inspection Officer <strong>Shri R.K. Mishra</strong> is scheduled for on-site premise verification on <strong>24 Oct 2024 at 11:30 AM</strong>.
          </p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onShowToast('Officer contact verified. SMS confirmation sent.', 'info')}
              className="text-[11px] font-bold text-[#0037b0] hover:underline"
            >
              Confirm Availability
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={() => onShowToast('Reschedule request registered with Mohanlalganj Nodal Desk.', 'info')}
              className="text-[11px] font-semibold text-slate-600 hover:underline"
            >
              Request Date Change
            </button>
          </div>
        </div>

        {/* Detailed Timeline Steps */}
        <div className="flex flex-col gap-3 py-1">
          <h5 className="text-xs font-bold text-[#191c1e] uppercase tracking-wider">Audit Log & Progression</h5>
          {application.timeline.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3 relative">
              {idx < application.timeline.length - 1 && (
                <div className="absolute left-3.5 top-6 bottom-0 w-0.5 bg-slate-200 -z-10"></div>
              )}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                  step.completed
                    ? 'bg-emerald-600 text-white'
                    : step.active
                    ? 'bg-[#0037b0] text-white ring-4 ring-blue-100'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {step.completed ? (
                  <span className="material-symbols-outlined text-[14px]">check</span>
                ) : (
                  idx + 1
                )}
              </div>
              <div className="flex flex-col flex-1 pb-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${step.active ? 'text-[#0037b0]' : 'text-[#191c1e]'}`}>
                    {step.title}
                  </span>
                  <span className="text-[10px] text-slate-400">{step.date}</span>
                </div>
                {step.note && <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{step.note}</p>}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-[#0f172a] text-white text-xs font-bold hover:bg-[#1d4ed8] transition-colors"
        >
          Close Tracker
        </button>
      </div>
    </div>
  );
};
