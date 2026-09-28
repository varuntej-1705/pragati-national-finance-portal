import React, { useState } from 'react';
import { UserProfile } from '../../types';

interface DocumentWalletModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type: 'success' | 'info') => void;
}

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  status: 'verified' | 'uploaded' | 'pending';
  source: string;
  date?: string;
}

export const DocumentWalletModal: React.FC<DocumentWalletModalProps> = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  if (!isOpen) return null;

  const [docs, setDocs] = useState<DocumentItem[]>([
    {
      id: 'doc-1',
      name: 'Aadhaar Card (UIDAI Linked)',
      type: 'Identity & Address Proof',
      status: 'verified',
      source: 'DigiLocker Verified',
      date: '14 Oct 2024'
    },
    {
      id: 'doc-2',
      name: 'Scheduled Caste (SC) Certificate',
      type: 'Category Authentication',
      status: 'verified',
      source: 'Tehsil E-District Portal',
      date: '12 Oct 2024'
    },
    {
      id: 'doc-3',
      name: 'Annual Family Income Certificate (<₹3.0L)',
      type: 'Means Verification',
      status: 'verified',
      source: 'Revenue Department UP',
      date: '10 Oct 2024'
    },
    {
      id: 'doc-4',
      name: 'Detailed Project Report (DPR - Dairy Farm)',
      type: 'Business Plan',
      status: 'uploaded',
      source: 'Self-Upload (PDF)',
      date: '15 Oct 2024'
    },
    {
      id: 'doc-5',
      name: 'Bank Passbook / 6-Month Bank Statement',
      type: 'Account Verification',
      status: 'pending',
      source: 'Bank of Baroda Gramin Branch'
    }
  ]);

  const handleSimulateUpload = (id: string) => {
    setDocs(prev =>
      prev.map(d => (d.id === id ? { ...d, status: 'uploaded', date: 'Just now' } : d))
    );
    onShowToast('Document uploaded successfully & enqueued for verification.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0037b0] text-[22px]">folder_shared</span>
            <div>
              <h3 className="text-base font-bold text-[#191c1e]">Citizen Document Wallet</h3>
              <p className="text-[10px] text-slate-400">DigiLocker & Paperless Concessional Vault</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Status Strip */}
        <div className="p-3 bg-[#dae2fd]/40 rounded-2xl border border-blue-200/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0037b0] text-[18px]">verified_user</span>
            <span className="font-bold text-[#0037b0]">DigiLocker Linked</span>
          </div>
          <span className="text-slate-600 font-semibold">4 / 5 Complete</span>
        </div>

        {/* Document Items List */}
        <div className="flex flex-col gap-2.5">
          {docs.map(doc => (
            <div
              key={doc.id}
              className="p-3.5 rounded-2xl bg-[#f7f9fb] border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <span
                  className={`material-symbols-outlined text-[20px] shrink-0 mt-0.5 ${
                    doc.status === 'verified'
                      ? 'text-emerald-600'
                      : doc.status === 'uploaded'
                      ? 'text-blue-600'
                      : 'text-amber-600'
                  }`}
                >
                  {doc.status === 'verified'
                    ? 'task_alt'
                    : doc.status === 'uploaded'
                    ? 'description'
                    : 'pending_actions'}
                </span>
                <div className="min-w-0 flex flex-col">
                  <span className="font-bold text-[#191c1e] truncate">{doc.name}</span>
                  <span className="text-[11px] text-slate-500">
                    {doc.type} · {doc.source}
                  </span>
                </div>
              </div>

              <div>
                {doc.status === 'pending' ? (
                  <button
                    onClick={() => handleSimulateUpload(doc.id)}
                    className="px-3 py-1 rounded-full bg-[#0037b0] text-white text-[11px] font-bold hover:bg-[#1d4ed8]"
                  >
                    Upload
                  </button>
                ) : (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      doc.status === 'verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {doc.status === 'verified' ? 'Verified' : 'Attached'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-[#0f172a] text-white text-xs font-bold hover:bg-[#1d4ed8] transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};
