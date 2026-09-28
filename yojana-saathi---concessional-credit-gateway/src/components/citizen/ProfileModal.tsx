import React, { useState } from 'react';
import { UserProfile } from '../../types';

interface ProfileModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(profile.name);
  const [caste, setCaste] = useState(profile.caste);
  const [annualIncome, setAnnualIncome] = useState(profile.annualIncome);
  const [projectType, setProjectType] = useState(profile.projectType);
  const [estimatedCost, setEstimatedCost] = useState(profile.estimatedCost);
  const [hasFemaleCoApplicant, setHasFemaleCoApplicant] = useState(profile.hasFemaleCoApplicant);
  const [femaleCoApplicantName, setFemaleCoApplicantName] = useState(profile.femaleCoApplicantName || '');

  const projectOptions = [
    'Dairy & Animal Husbandry',
    'Agro Processing',
    'Handloom & Weaving',
    'Small Manufacturing',
    'Commercial Transport',
    'Service Enterprise',
    'Food Processing',
    'Higher Education',
    'E-Rickshaw / EV Fleet'
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...profile,
      name,
      caste,
      annualIncome,
      projectType,
      estimatedCost,
      hasFemaleCoApplicant,
      femaleCoApplicantName: hasFemaleCoApplicant ? femaleCoApplicantName : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0037b0] text-[22px]">manage_accounts</span>
            <h3 className="text-base font-bold text-[#191c1e]">Guided Profile Setup</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-3.5 text-xs">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-slate-700">Citizen Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-medium border border-transparent focus:border-[#0037b0] focus:bg-white focus:outline-none"
              required
            />
          </div>

          {/* Social Category / Caste */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700">Community Category</label>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">verified</span>
                DigiLocker Linked
              </span>
            </div>
            <select
              value={caste}
              onChange={e => setCaste(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-medium border border-transparent focus:border-[#0037b0] focus:bg-white focus:outline-none"
            >
              <option value="SC">Scheduled Caste (SC) — NSFDC Target Beneficiary</option>
              <option value="ST">Scheduled Tribe (ST)</option>
              <option value="OBC">Other Backward Class (OBC)</option>
              <option value="General">General Category</option>
            </select>
          </div>

          {/* Annual Income */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700">Annual Family Income (INR)</label>
              <span className="text-[10px] text-[#0037b0] font-bold">
                ₹{(annualIncome / 100000).toFixed(2)} Lakh
              </span>
            </div>
            <input
              type="range"
              min={50000}
              max={600000}
              step={20000}
              value={annualIncome}
              onChange={e => setAnnualIncome(Number(e.target.value))}
              className="w-full h-2 bg-[#eceef0] rounded-full appearance-none cursor-pointer accent-[#0037b0]"
            />
            <span className="text-[10px] text-slate-400">
              *NSFDC schemes require annual income up to ₹3.00 Lakh (₹5.00 Lakh for education).
            </span>
          </div>

          {/* Project Type */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-slate-700">Project / Enterprise Goal</label>
            <select
              value={projectType}
              onChange={e => setProjectType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-medium border border-transparent focus:border-[#0037b0] focus:bg-white focus:outline-none"
            >
              {projectOptions.map(p => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Estimated Capital Needed */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-slate-700">Estimated Project Cost</label>
            <input
              type="number"
              value={estimatedCost}
              onChange={e => setEstimatedCost(Number(e.target.value))}
              step={25000}
              className="px-3.5 py-2 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-medium border border-transparent focus:border-[#0037b0] focus:bg-white focus:outline-none"
              required
            />
          </div>

          {/* Female Co-Applicant Option */}
          <div className="p-3 rounded-2xl bg-[#dae2fd]/40 border border-blue-200/60 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#0037b0] text-[18px]">female</span>
                <span className="font-bold text-[#0037b0]">Nominate Female Co-Applicant</span>
              </div>
              <input
                type="checkbox"
                checked={hasFemaleCoApplicant}
                onChange={e => setHasFemaleCoApplicant(e.target.checked)}
                className="w-4 h-4 rounded text-[#0037b0] accent-[#0037b0]"
              />
            </div>
            <p className="text-[11px] text-slate-600">
              Unlocks 50% Capital Subsidy (up to ₹60,000) under Mahila Samriddhi Yojana and lower interest rate!
            </p>
            {hasFemaleCoApplicant && (
              <input
                type="text"
                placeholder="Female Co-applicant Name (e.g., Savitri Devi)"
                value={femaleCoApplicantName}
                onChange={e => setFemaleCoApplicantName(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white text-xs border border-blue-200 focus:outline-none"
              />
            )}
          </div>

          {/* Submit */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full bg-[#eceef0] text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-full bg-[#0f172a] text-white font-semibold shadow-md hover:bg-[#1d4ed8] transition-colors"
            >
              Save & Recalculate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
