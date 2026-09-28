import React, { useState, useEffect } from 'react';
import { fetchOverviewKPIs, fetchAllPartners } from './services/api';

export default function App() {
  const [kpis, setKpis] = useState<any>({
    total_beneficiaries_assisted: '14,280',
    total_matches_generated: '38,450',
    total_sanctions_facilitated: '₹18.4 Cr',
    active_channel_partners: 128,
    high_npa_restricted_partners: 14
  });

  const [partners, setPartners] = useState<any[]>([
    {
      id: 'cp-sca-tn-01',
      name: 'Tamil Nadu Adi Dravidar Housing and Development Corp (TAHDCO)',
      partner_type: 'SCA',
      district: 'Chennai',
      state: 'Tamil Nadu',
      npa_status: 'ELIGIBLE',
      npa_ratio_percent: 3.4,
      fund_utilisation_score: 94
    },
    {
      id: 'cp-psb-sbi-04',
      name: 'State Bank of India (MSME Specialized Division)',
      partner_type: 'PSB',
      district: 'Chennai',
      state: 'Tamil Nadu',
      npa_status: 'ELIGIBLE',
      npa_ratio_percent: 2.9,
      fund_utilisation_score: 96
    },
    {
      id: 'cp-sca-dl-09',
      name: 'Delhi SC/ST/OBC Development Corporation (DSFDC)',
      partner_type: 'SCA',
      district: 'North West Delhi',
      state: 'Delhi',
      npa_status: 'OVERDUE_RESTRICTED',
      npa_ratio_percent: 9.2,
      fund_utilisation_score: 64
    },
    {
      id: 'cp-psb-bob-10',
      name: 'Bank of Baroda (Old Industrial Area)',
      partner_type: 'PSB',
      district: 'Ghaziabad',
      state: 'Uttar Pradesh',
      npa_status: 'HIGH_NPA_BLOCKED',
      npa_ratio_percent: 18.7,
      fund_utilisation_score: 28
    }
  ]);

  useEffect(() => {
    fetchOverviewKPIs().then(data => { if (data) setKpis(data); }).catch(() => {});
    fetchAllPartners().then(data => { if (data && data.length) setPartners(data); }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-[#0D5C3A] text-white px-8 py-4 shadow-sm flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-green-200 font-bold">Smart India Hackathon 2026 · PS 26092</div>
          <h1 className="text-xl font-bold">NSFDC Scheme & Channel Partner Administration</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="bg-green-800 text-green-100 text-xs px-3 py-1 rounded-full font-semibold">MoSJE Central Dashboard</span>
          <span className="text-sm font-medium">Administrator (varun.admin)</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 space-y-8">
        {/* KPI Cards */}
        <section className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase">Assisted Citizens</span>
            <div className="text-2xl font-bold text-slate-900 mt-2">{kpis.total_beneficiaries_assisted}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Matches</span>
            <div className="text-2xl font-bold text-slate-900 mt-2">{kpis.total_matches_generated}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase">Sanctions Facilitated</span>
            <div className="text-2xl font-bold text-[#107C41] mt-2">{kpis.total_sanctions_facilitated}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase">Active Channel Partners</span>
            <div className="text-2xl font-bold text-slate-900 mt-2">{kpis.active_channel_partners}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase">NPA Blocked / Restricted</span>
            <div className="text-2xl font-bold text-red-600 mt-2">{kpis.high_npa_restricted_partners}</div>
          </div>
        </section>

        {/* Channel Partner & Routing Status Table */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Channel Partner Network & Fund Utilisation Standing</h2>
              <p className="text-xs text-slate-500 mt-1">Prevents misrouting to non-performing agencies or high-NPA banking branches</p>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">Real-time NSFDC Partner Registry</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3 px-6">Channel Partner</th>
                  <th className="py-3 px-6">Type</th>
                  <th className="py-3 px-6">Region</th>
                  <th className="py-3 px-6">NPA Standing Flag</th>
                  <th className="py-3 px-6">NPA Ratio</th>
                  <th className="py-3 px-6">Fund Utilisation Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {partners.map((partner, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 font-semibold text-slate-900">{partner.name}</td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 rounded text-xs font-bold bg-slate-100 text-slate-700">{partner.partner_type}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{partner.district}, {partner.state}</td>
                    <td className="py-4 px-6">
                      {partner.npa_status === 'ELIGIBLE' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-[#107C41]">ELIGIBLE</span>
                      )}
                      {partner.npa_status === 'OVERDUE_RESTRICTED' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-[#D97706]">RESTRICTED</span>
                      )}
                      {partner.npa_status === 'HIGH_NPA_BLOCKED' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">BLOCKED (HIGH NPA)</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-700 font-medium">{partner.npa_ratio_percent}%</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-900">{partner.fund_utilisation_score}%</span>
                        <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${partner.fund_utilisation_score > 80 ? 'bg-[#107C41]' : partner.fund_utilisation_score > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${partner.fund_utilisation_score}%` }}
                          />
                        </div>
                      </div>
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
