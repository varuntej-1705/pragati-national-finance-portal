import React, { useState } from 'react';
import { matchCitizenSchemes } from './services/api';

export default function App() {
  const [cases, setCases] = useState<any[]>([
    {
      id: 'case-101',
      name: 'Ramesh Kumar',
      phone: '9840123456',
      income: '₹2,20,000',
      category: 'SC',
      district: 'Chennai',
      topScheme: 'NSFDC Micro Credit (MCS)',
      confidence: 'Likely eligible',
      status: 'Document Verification'
    },
    {
      id: 'case-102',
      name: 'Priya Dharshini',
      phone: '9443210987',
      income: '₹1,80,000',
      category: 'SC',
      district: 'Tiruvallur',
      topScheme: 'Mahila Samriddhi Yojana (MSY)',
      confidence: 'Likely eligible',
      status: 'Routed to TAHDCO'
    },
    {
      id: 'case-103',
      name: 'Anand Sundaram',
      phone: '9789012345',
      income: '₹3,40,000',
      category: 'SC',
      district: 'Kanchipuram',
      topScheme: 'NSFDC Term Loan',
      confidence: 'Maybe eligible',
      status: 'Pending DPR'
    }
  ]);

  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newIncome, setNewIncome] = useState('');
  const [newCost, setNewCost] = useState('');

  const handleAddCitizen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    setCases([
      {
        id: `case-${Date.now()}`,
        name: newName,
        phone: newPhone,
        income: `₹${Number(newIncome).toLocaleString('en-IN')}`,
        category: 'SC',
        district: 'Chennai',
        topScheme: Number(newCost) <= 140000 ? 'NSFDC Micro Credit (MCS)' : 'NSFDC Term Loan',
        confidence: 'Likely eligible',
        status: 'Profile Captured'
      },
      ...cases
    ]);

    setNewName('');
    setNewPhone('');
    setNewIncome('');
    setNewCost('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#0D5C3A] text-white px-8 py-4 shadow-sm flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-green-200 font-bold">Smart India Hackathon 2026 · PS 26092</div>
          <h1 className="text-xl font-bold">CSC / NGO Facilitator Assisted Portal</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="bg-green-800 text-green-100 text-xs px-3 py-1 rounded-full font-semibold">Teynampet Common Service Centre</span>
          <span className="text-sm font-medium">Operator (CSC-TN-042)</span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-8 space-y-8">
        {/* Quick Intake Form */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Quick Citizen Entry & Eligibility Scan</h2>
          <p className="text-xs text-slate-500 mb-4">Assists walk-in citizens without smartphones in discovering NSFDC concessional loans</p>

          <form onSubmit={handleAddCitizen} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Citizen Full Name</label>
              <input
                type="text"
                placeholder="e.g. Meenakshi S"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#107C41]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Mobile Number</label>
              <input
                type="text"
                placeholder="10 digits"
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#107C41]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Annual Family Income (₹)</label>
              <input
                type="number"
                placeholder="<= 500000"
                value={newIncome}
                onChange={e => setNewIncome(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#107C41]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Project Cost / Requirement (₹)</label>
              <input
                type="number"
                placeholder="e.g. 120000"
                value={newCost}
                onChange={e => setNewCost(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#107C41]"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-[#107C41] hover:bg-[#0D5C3A] text-white font-semibold py-2 px-4 rounded-lg text-sm transition"
              >
                Scan & Save Case
              </button>
            </div>
          </form>
        </section>

        {/* Assisted Cases List */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Assisted Beneficiary Case Management</h2>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1"
            >
              <span>🖨️ Print Summary for Citizen</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3 px-6">Case ID</th>
                  <th className="py-3 px-6">Citizen</th>
                  <th className="py-3 px-6">Income</th>
                  <th className="py-3 px-6">Top Matched Scheme</th>
                  <th className="py-3 px-6">Confidence</th>
                  <th className="py-3 px-6">Application Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cases.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 font-mono text-xs text-slate-500">{c.id}</td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900">{c.name}</div>
                      <div className="text-xs text-slate-500">{c.phone}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-700">{c.income}</td>
                    <td className="py-4 px-6 font-medium text-[#107C41]">{c.topScheme}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${c.confidence === 'Likely eligible' ? 'bg-green-100 text-[#107C41]' : 'bg-amber-100 text-[#D97706]'}`}>
                        {c.confidence}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
