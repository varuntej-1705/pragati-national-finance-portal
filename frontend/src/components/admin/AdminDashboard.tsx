import React, { useState } from 'react';
import { ChannelPartner, Language } from '../../types';
import { CHANNEL_PARTNERS } from '../../data/partners';
import { NSFDC_SCHEMES } from '../../data/schemes';

interface AdminDashboardProps {
  language: Language;
  onShowToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onShowToast
}) => {
  const [partners, setPartners] = useState<ChannelPartner[]>(CHANNEL_PARTNERS);
  const [activeTab, setActiveTab] = useState<'overview' | 'partners' | 'schemes'>('overview');

  // Toggle NPA safeguard pause
  const handleTogglePartnerStatus = (partnerId: string) => {
    setPartners(prev =>
      prev.map(p => {
        if (p.id === partnerId) {
          const newStatus = p.status === 'active' ? 'paused' : 'active';
          return {
            ...p,
            status: newStatus,
            isNpaSafeguardActive: newStatus === 'paused'
          };
        }
        return p;
      })
    );
    const target = partners.find(p => p.id === partnerId);
    onShowToast(
      `Status toggled for ${target?.name || 'Channel Partner'}. Routing pipeline updated.`,
      'info'
    );
  };

  const handleUpdateQuota = (partnerId: string, delta: number) => {
    setPartners(prev =>
      prev.map(p => {
        if (p.id === partnerId) {
          const newQuota = Math.max(0, Number((p.quotaAvailableCrores + delta).toFixed(2)));
          return { ...p, quotaAvailableCrores: newQuota };
        }
        return p;
      })
    );
    onShowToast('Channel quota allocation updated in real-time.', 'success');
  };

  const totalQuotaCr = partners.reduce((sum, p) => sum + p.quotaAvailableCrores, 0);
  const activeCount = partners.filter(p => p.status === 'active').length;
  const pausedCount = partners.filter(p => p.status === 'paused').length;

  return (
    <div className="flex flex-col w-full py-4 gap-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 card p-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-xs border border-purple-200 flex items-center justify-center flex-shrink-0">
            <img src="/emblem.png" alt="Emblem" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base md:text-lg font-bold text-[#191c1e] text-truncate">PRAGATI National Control Center</h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold flex-shrink-0">
                Official Gateway
              </span>
            </div>
            <p className="text-xs text-[#565e74] text-truncate">
              Unified Concessional Credit Architecture · MoSJ&E, Govt. of India
            </p>
          </div>
        </div>

        {/* Sub-nav Tabs */}
        <div className="flex items-center gap-1.5 bg-[#f2f4f6] p-1 rounded-full border border-slate-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'overview' ? 'bg-white text-[#191c1e] shadow-xs' : 'text-slate-600'
            }`}
          >
            Overview & Heatmap
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'partners' ? 'bg-white text-[#191c1e] shadow-xs' : 'text-slate-600'
            }`}
          >
            Channel Partners ({partners.length})
          </button>
          <button
            onClick={() => setActiveTab('schemes')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'schemes' ? 'bg-white text-[#191c1e] shadow-xs' : 'text-slate-600'
            }`}
          >
            Scheme Master ({NSFDC_SCHEMES.length})
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="flex flex-col gap-5 animate-in fade-in duration-150">
          {/* 4 KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-xs flex flex-col justify-between h-28">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Applications
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-[#191c1e]">14,892</span>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> +18%
                </span>
              </div>
              <span className="text-[10px] text-slate-500">Across 100+ Channel Partners</span>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-xs flex flex-col justify-between h-28">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Disbursed FY24-25
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-[#0037b0]">₹148.6 Cr</span>
                <span className="text-[10px] font-bold text-emerald-600">92% DBT</span>
              </div>
              <span className="text-[10px] text-slate-500">Concessional Credit Sanctions</span>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-xs flex flex-col justify-between h-28">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Active Channels / Paused
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-[#191c1e]">
                  {activeCount} <span className="text-sm font-normal text-slate-400">/ {pausedCount}</span>
                </span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">
                  NPA Guard
                </span>
              </div>
              <span className="text-[10px] text-slate-500">Available Quota: ₹{totalQuotaCr.toFixed(2)} Cr</span>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-xs flex flex-col justify-between h-28">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Average TAT
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-emerald-700">8.4 Days</span>
                <span className="text-[10px] font-bold text-emerald-600">Down from 28d</span>
              </div>
              <span className="text-[10px] text-slate-500">From submit to sanction</span>
            </div>
          </div>

          {/* Regional Heatmap & Gateway Health */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Regional Heatmap Breakdown */}
            <div className="md:col-span-2 p-5 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#191c1e]">Regional Heatmap & Disbursal Velocity</h3>
                  <p className="text-xs text-slate-500">Key Focus Districts across Uttar Pradesh & Central India</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0037b0] text-[11px] font-bold">
                  GIS Sync Active
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { district: 'Lucknow (incl. Mohanlalganj)', cases: 3840, valCr: 41.2, health: '98% On-Time', color: 'bg-emerald-500' },
                  { district: 'Varanasi Central', cases: 2910, valCr: 32.8, health: '94% On-Time', color: 'bg-emerald-500' },
                  { district: 'Kanpur Rural', cases: 2450, valCr: 27.5, health: '89% Healthy', color: 'bg-blue-500' },
                  { district: 'Prayagraj Tehsil', cases: 2120, valCr: 23.4, health: '86% Healthy', color: 'bg-blue-500' },
                  { district: 'Agra Zone (Leather & Agro)', cases: 1890, valCr: 21.0, health: 'NPA Alert (14.2%)', color: 'bg-amber-500' }
                ].map(d => (
                  <div key={d.district} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#191c1e]">{d.district}</span>
                      <span className="text-slate-600 font-mono text-[11px]">
                        {d.cases} cases · <strong>₹{d.valCr} Cr</strong> ({d.health})
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full ${d.color} rounded-full`}
                        style={{ width: `${(d.valCr / 45) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gateway Health */}
            <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-[#191c1e]">Digital Verification & Central Repositories</h3>
                <p className="text-xs text-slate-500">Live national authentication gateways</p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-50 text-emerald-900 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span className="font-bold">DigiLocker Caste Verification Gateway</span>
                  </div>
                  <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full text-emerald-800">
                    99.9% Uptime
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-50 text-emerald-900 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span className="font-bold">PFMS / DBT Disbursal</span>
                  </div>
                  <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full text-emerald-800">
                    Live
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-blue-50 text-blue-900 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span className="font-bold">State SCA Core Ledger</span>
                  </div>
                  <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full text-blue-800">
                    Synced (2m ago)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-purple-50 text-purple-900 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                    <span className="font-bold">NPA Auto-Safeguard Daemon</span>
                  </div>
                  <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full text-purple-800">
                    Threshold: 15%
                  </span>
                </div>
              </div>

              <button
                onClick={() => onShowToast('Forced full reconciliation with State SCA ledger initiated.', 'info')}
                className="w-full py-2.5 rounded-full bg-[#0f172a] text-white text-xs font-bold hover:bg-[#1d4ed8] transition-colors"
              >
                Trigger Sync Reconciliation
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'partners' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-150">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#191c1e]">Channel Partner & NPA Management</h3>
              <p className="text-xs text-slate-500">
                Configure partner quota, toggle auto-pause safeguarding, and test live applicant routing.
              </p>
            </div>
            <div className="text-xs font-semibold text-[#0037b0]">
              Safeguard Rule: Auto-pause when NPA &gt; 15.0%
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7f9fb] text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Channel Partner</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Available Quota</th>
                  <th className="py-3 px-4">Current NPA</th>
                  <th className="py-3 px-4">Routing Status</th>
                  <th className="py-3 px-4 text-right">Admin Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {partners.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#191c1e]">{p.name}</div>
                      <div className="text-[11px] text-slate-400">{p.address}</div>
                    </td>
                    <td className="py-3 px-4 font-medium uppercase text-slate-600">{p.type}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-[#191c1e]">
                        <span>₹{p.quotaAvailableCrores} Cr</span>
                        <button
                          onClick={() => handleUpdateQuota(p.id, 0.25)}
                          title="Add Quota (+₹25L)"
                          className="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-bold font-mono ${
                          p.npaPercentage > 15 ? 'text-red-600' : 'text-[#0037b0]'
                        }`}
                      >
                        {p.npaPercentage}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {p.status === 'active' ? 'Active' : 'Paused (Safeguard)'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleTogglePartnerStatus(p.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                          p.status === 'active'
                            ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                            : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                        }`}
                      >
                        {p.status === 'active' ? 'Pause Direct Routing' : 'Resume Routing'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'schemes' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 flex flex-col gap-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#191c1e]">Official NSFDC Schemes Catalog</h3>
              <p className="text-xs text-slate-500">
                Rule thresholds: Annual income caps, interest ceilings, moratorium allowances
              </p>
            </div>
            <button
              onClick={() => onShowToast('Scheme rule master is up-to-date with MoSJ&E gazette notification.', 'info')}
              className="px-3.5 py-1.5 rounded-full bg-[#0f172a] text-white text-xs font-bold hover:bg-[#1d4ed8]"
            >
              Verify Gazette Sync
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {NSFDC_SCHEMES.map(s => (
              <div key={s.id} className="p-4 rounded-2xl bg-[#f7f9fb] border border-slate-200/80 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#191c1e]">{s.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#0037b0] text-[10px] font-bold">
                    {s.interestRate !== null ? `${s.interestRate}% p.a.` : 'Negotiated Terms'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2">{s.description}</p>
                <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] text-slate-500 border-t border-slate-200">
                  <div>Max: <strong>₹{(s.maxFunding / 100000).toFixed(0)}L</strong></div>
                  <div>NSFDC: <strong>{s.nsfdcSharePercent}%</strong></div>
                  <div>Moratorium: <strong>{s.moratoriumMonths}m</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
