import React, { useState } from 'react';
import { FacilitatorCase, Language } from '../../types';
import { recommendSchemes } from '../../services/recommender';

interface FacilitatorDashboardProps {
  language: Language;
  onShowToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export const FacilitatorDashboard: React.FC<FacilitatorDashboardProps> = ({
  onShowToast
}) => {
  const [cases, setCases] = useState<FacilitatorCase[]>([
    {
      id: 'case-101',
      citizenName: 'Rameshwar Kumar',
      phone: '9876543210',
      village: 'Mohanlalganj',
      projectType: 'Dairy & Animal Husbandry',
      estimatedAmount: 350000,
      annualIncome: 240000,
      casteStatus: 'SC Verified',
      recommendedScheme: 'Term Loan Scheme (TLS)',
      matchedScore: 96,
      status: 'Verification',
      lastUpdated: 'Today, 10:15 AM'
    },
    {
      id: 'case-102',
      citizenName: 'Sunita Devi',
      phone: '9876543222',
      village: 'Kallupura',
      projectType: 'Food Processing / Spices',
      estimatedAmount: 140000,
      annualIncome: 180000,
      casteStatus: 'SC Verified',
      recommendedScheme: 'Mahila Samriddhi Yojana (MSY)',
      matchedScore: 98,
      status: 'Sanctioned',
      lastUpdated: 'Yesterday'
    },
    {
      id: 'case-103',
      citizenName: 'Mahesh Rawat',
      phone: '9876543233',
      village: 'Nagram',
      projectType: 'Handloom & Weaving',
      estimatedAmount: 120000,
      annualIncome: 160000,
      casteStatus: 'SC Verified',
      recommendedScheme: 'Micro Credit Finance (MCF)',
      matchedScore: 93,
      status: 'Submitted',
      lastUpdated: '22 Oct 2024'
    },
    {
      id: 'case-104',
      citizenName: 'Pooja Verma',
      phone: '9876543244',
      village: 'Gosainganj',
      projectType: 'Polytechnic Engineering Diploma',
      estimatedAmount: 450000,
      annualIncome: 320000,
      casteStatus: 'Pending Doc',
      recommendedScheme: 'Educational Loan (ELPS)',
      matchedScore: 84,
      status: 'Draft',
      lastUpdated: '20 Oct 2024'
    }
  ]);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Citizen quick entry state
  const [newCitizenName, setNewCitizenName] = useState('');
  const [newCitizenPhone, setNewCitizenPhone] = useState('');
  const [newCitizenIncome, setNewCitizenIncome] = useState(200000);
  const [newCitizenCost, setNewCitizenCost] = useState(250000);
  const [newCitizenProject, setNewCitizenProject] = useState('Dairy & Animal Husbandry');
  const [newHasFemaleCoApplicant, setNewHasFemaleCoApplicant] = useState(false);

  const filteredCases = cases.filter(c => {
    const matchesSearch =
      c.citizenName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.recommendedScheme.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleQuickAddCitizen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCitizenName || !newCitizenPhone) {
      onShowToast('Please fill in citizen name and contact number.', 'error');
      return;
    }

    // Run deterministic recommender engine
    const profileMock = {
      id: 'temp-' + Date.now(),
      name: newCitizenName,
      phone: newCitizenPhone,
      role: 'citizen' as const,
      caste: 'SC' as const,
      isCasteVerified: true,
      annualIncome: newCitizenIncome,
      isIncomeVerified: true,
      location: { tehsil: 'Mohanlalganj', district: 'Lucknow', state: 'UP', pinCode: '226301' },
      projectType: newCitizenProject,
      estimatedCost: newCitizenCost,
      educationStatus: 'High School',
      hasFemaleCoApplicant: newHasFemaleCoApplicant
    };

    const matches = recommendSchemes(profileMock);
    const topMatch = matches[0];

    const newCase: FacilitatorCase = {
      id: `case-${Date.now().toString().slice(-3)}`,
      citizenName: newCitizenName,
      phone: newCitizenPhone,
      village: 'Mohanlalganj Block',
      projectType: newCitizenProject,
      estimatedAmount: newCitizenCost,
      annualIncome: newCitizenIncome,
      casteStatus: 'SC Verified',
      recommendedScheme: topMatch ? topMatch.scheme.name : 'Term Loan Scheme (TLS)',
      matchedScore: topMatch ? topMatch.matchScore : 92,
      status: 'Submitted',
      lastUpdated: 'Just now'
    };

    setCases([newCase, ...cases]);
    setIsAddModalOpen(false);
    setNewCitizenName('');
    setNewCitizenPhone('');
    onShowToast(`Citizen ${newCitizenName} registered. Matched with ${newCase.recommendedScheme} (${newCase.matchedScore}%).`, 'success');
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 py-4 pb-28 gap-5">
      {/* Facilitator Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#dae2fd] text-[#0037b0] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px]">assignment_ind</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#191c1e]">Facilitator Workstation</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Vikas Mitra Active
              </span>
            </div>
            <p className="text-xs text-[#565e74]">
              Mohanlalganj Block Nodal Desk · Total Assisted Citizens: <strong>{cases.length}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-full bg-[#0f172a] hover:bg-[#1d4ed8] text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">person_add</span>
          <span>Quick Citizen Onboarding</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search by citizen name, phone, or scheme..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white text-xs text-[#191c1e] border border-slate-200 focus:outline-none focus:border-[#0037b0]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['all', 'submitted', 'verification', 'sanctioned', 'draft'] as const).map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                filterStatus === st
                  ? 'bg-[#0f172a] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Case List Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#191c1e]">Active Assisted Case Pipeline</h3>
          <span className="text-xs text-slate-400 font-medium">Showing {filteredCases.length} cases</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f9fb] text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Citizen / Contact</th>
                <th className="py-3 px-4">Project / Goal</th>
                <th className="py-3 px-4">Income & Caste</th>
                <th className="py-3 px-4">Matched Scheme</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#191c1e]">{c.citizenName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">+91 {c.phone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-[#191c1e] font-medium">{c.projectType}</div>
                    <div className="text-[11px] text-[#0037b0] font-semibold">
                      ₹{(c.estimatedAmount / 100000).toFixed(2)} Lakh
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-700">₹{(c.annualIncome / 100000).toFixed(2)}L p.a.</div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      {c.casteStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#191c1e]">{c.recommendedScheme}</div>
                    <div className="text-[11px] text-emerald-600 font-bold">{c.matchedScore}% Rule Match</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        c.status === 'Sanctioned'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'Verification'
                          ? 'bg-blue-100 text-blue-800'
                          : c.status === 'Submitted'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onShowToast(`Docket for ${c.citizenName} pushed to SCA Mohanlalganj.`, 'success')}
                      className="px-3 py-1.5 rounded-full bg-[#eceef0] hover:bg-[#dae2fd] text-[#0037b0] font-bold text-[11px] transition-colors"
                    >
                      Sync Docket
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Citizen Onboarding Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0037b0] text-[22px]">person_add</span>
                <h3 className="text-base font-bold text-[#191c1e]">New Citizen Registration</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <form onSubmit={handleQuickAddCitizen} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Citizen Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Paswan"
                  value={newCitizenName}
                  onChange={e => setNewCitizenName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-medium border border-transparent focus:border-[#0037b0] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Mobile Number (Aadhaar linked)</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit mobile"
                  value={newCitizenPhone}
                  onChange={e => setNewCitizenPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-medium border border-transparent focus:border-[#0037b0] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700">Annual Income (₹)</label>
                  <input
                    type="number"
                    step={10000}
                    value={newCitizenIncome}
                    onChange={e => setNewCitizenIncome(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-medium border border-transparent focus:border-[#0037b0] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Capital Needed (₹)</label>
                  <input
                    type="number"
                    step={25000}
                    value={newCitizenCost}
                    onChange={e => setNewCitizenCost(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-medium border border-transparent focus:border-[#0037b0] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Project Type</label>
                <select
                  value={newCitizenProject}
                  onChange={e => setNewCitizenProject(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-medium border border-transparent focus:border-[#0037b0] focus:bg-white focus:outline-none"
                >
                  <option value="Dairy & Animal Husbandry">Dairy & Animal Husbandry</option>
                  <option value="Handloom & Weaving">Handloom & Weaving</option>
                  <option value="Small Manufacturing">Small Manufacturing</option>
                  <option value="Food Processing">Food Processing (MSY)</option>
                  <option value="Commercial Transport">Commercial Transport</option>
                </select>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                <input
                  type="checkbox"
                  id="coapp"
                  checked={newHasFemaleCoApplicant}
                  onChange={e => setNewHasFemaleCoApplicant(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0037b0] accent-[#0037b0]"
                />
                <label htmlFor="coapp" className="font-semibold text-blue-900 cursor-pointer">
                  Include Female Co-Applicant (Unlocks 50% Subsidy)
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 rounded-full bg-[#eceef0] text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-[#0f172a] text-white font-semibold shadow-md hover:bg-[#1d4ed8] transition-colors"
                >
                  Run Match & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
