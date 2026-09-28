import React, { useState } from 'react';
import { TEAM, TeamMember } from '../../config/team';
import { Language } from '../../types';

interface IntroSequenceProps {
  onComplete: () => void;
  initialTab?: 'team' | 'ps' | 'problem' | 'solution';
  standaloneTeamOnly?: boolean;
  onCloseStandalone?: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({
  onComplete,
  initialTab = 'team',
  standaloneTeamOnly = false,
  onCloseStandalone,
  language,
  onLanguageChange
}) => {
  const [activeTab, setActiveTab] = useState<'team' | 'ps' | 'problem' | 'solution'>(initialTab);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync activeTab whenever initialTab changes
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleLinkClick = (url?: string, label?: string) => {
    if (!url || url === '#' || url.trim() === '') {
      showToast(`Link will be connected soon: ${label}`);
      return;
    }
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      navigator.clipboard?.writeText(url);
      showToast(`Copied ${label} profile URL`);
    }
  };

  const navTabs: { id: 'team' | 'ps' | 'problem' | 'solution'; label: string; icon: string }[] = [
    { id: 'team', label: 'Team Astra-X', icon: 'groups' },
    { id: 'ps', label: 'PS 26092', icon: 'assignment' },
    { id: 'problem', label: 'Existing Problem', icon: 'report_problem' },
    { id: 'solution', label: 'What We Solved', icon: 'verified' }
  ];

  return (
    <div className="w-full min-h-screen min-h-[100dvh] bg-[#f7f9fb] text-slate-800 flex flex-col justify-between selection:bg-[#0037b0] selection:text-white relative font-sans">
      {/* ══ Official Tricolor Top Accent Ribbon ══ */}
      <div className="w-full h-[4px] bg-gradient-to-r from-[#FF9933] via-white to-[#138808] flex-shrink-0 z-30" />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-[#0a2560] text-white font-bold text-xs shadow-2xl animate-bounce border border-blue-400">
          {toastMessage}
        </div>
      )}

      {/* ══ Top Government Style Header Bar ══ */}
      <header className="w-full bg-white border-b border-slate-200/80 shadow-xs z-20">
        <div className="max-w-6xl mx-auto px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
          {/* Emblem & Portal Title */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white p-1 border border-amber-300 shadow-xs flex items-center justify-center shrink-0">
              <img
                src="/emblem.png"
                alt="State Emblem of India"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  SIH 2026 • PS 26092
                </span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="text-[9px] sm:text-[10px] font-bold text-[#0037b0] uppercase tracking-wider hidden sm:inline">
                  TEAM ID: {TEAM.teamId}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-black text-[#0a2560] font-heading tracking-tight mt-0.5 truncate">
                {TEAM.teamName}
              </h1>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">

            {/* Standalone Back or Proceed to App */}
            {standaloneTeamOnly || onCloseStandalone ? (
              <button
                onClick={onCloseStandalone || onComplete}
                className="py-1 px-3 sm:px-4 rounded-full bg-[#0a2560] hover:bg-[#0037b0] text-white font-bold text-[11px] sm:text-xs transition-all flex items-center gap-1 shadow-xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                <span>Back</span>
              </button>
            ) : (
              <button
                onClick={onComplete}
                className="py-1.5 px-3.5 sm:px-5 rounded-full bg-[#0037b0] hover:bg-[#0a2560] text-white font-bold text-[11px] sm:text-xs shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center gap-1"
              >
                <span>Launch Portal</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs (Light Theme matching Inner App) */}
        <div className="max-w-6xl mx-auto px-3 sm:px-8 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1.5">
          {navTabs.map(t => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                  isActive
                    ? 'bg-[#0037b0] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════
          TAB 1: TEAM ASTRA-X (ALL 6 MEMBERS ON THE SAME PAGE)
         ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'team' && (
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-4 sm:py-6 flex flex-col justify-center animate-fadeIn">
          {/* Clean Section Title (Two line description removed as requested) */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-[#0a2560] font-heading tracking-tight">
              Meet Team Astra-X
            </h2>
          </div>

          {/* ═══ 6 CARDS ON THE SAME PAGE (MATCHING LIGHT THEME & REFERENCE) ═══ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {TEAM.members.map((member: TeamMember, idx: number) => {
              const initials = member.name
                .split(' ')
                .map(n => n.replace('.', ''))
                .filter(Boolean)
                .map(n => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase();

              return (
                <div
                  key={member.id || idx}
                  className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(15,23,42,0.06)] border border-slate-200/80 hover:shadow-[0_12px_32px_rgba(0,55,176,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group"
                >
                  {/* Circular Avatar Container with Prominent Dark Rim Border */}
                  <div className="relative mb-3.5">
                    <div className="w-32 h-32 rounded-full border-4 border-slate-900 overflow-hidden shadow-md flex items-center justify-center p-0.5 bg-slate-900 relative">
                      {member.photo ? (
                        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white">
                          <img
                            src={member.photo}
                            alt={member.name}
                            style={member.photoCropStyle || { objectFit: 'cover' }}
                            className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        // Clean Light Theme Profile Default Avatar Option
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-50 via-slate-100 to-amber-50 flex flex-col items-center justify-center text-[#0a2560]">
                          <span className="text-3xl font-black font-heading tracking-wider">
                            {initials}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            Member
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Floating Orange Circular Badge with Icon at Bottom-Right */}
                    <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gradient-to-tr from-[#D95D1E] to-[#F97316] text-white flex items-center justify-center shadow-md border-2 border-white">
                      {member.badgeIcon === 'code' ? (
                        <span className="text-xs font-black tracking-tighter leading-none">&lt;&gt;</span>
                      ) : (
                        <span className="material-symbols-outlined text-[15px]">{member.badgeIcon}</span>
                      )}
                    </div>
                  </div>

                  {/* Member Name in Bold Terracotta/Rust */}
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#D95D1E] font-heading tracking-tight leading-snug">
                    {member.name}
                  </h3>

                  {/* Role subtitle with code symbol */}
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1 flex items-center justify-center gap-1">
                    <span className="text-[#D95D1E] font-bold text-xs">&lt;&gt;</span>
                    <span>{member.role}</span>
                  </p>

                  {/* Social Icon Pills: LinkedIn & GitHub */}
                  <div className="flex items-center gap-2.5 mt-4">
                    {/* LinkedIn Icon Pill */}
                    <button
                      onClick={() => handleLinkClick(member.linkedin, `${member.name} LinkedIn`)}
                      className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-blue-50 shadow-xs border border-slate-200/80 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 text-slate-700 hover:text-[#0077b5] transition-all flex items-center justify-center active:scale-95"
                      title={`Open ${member.name}'s LinkedIn`}
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </button>

                    {/* GitHub Icon Pill */}
                    <button
                      onClick={() => handleLinkClick(member.github, `${member.name} GitHub`)}
                      className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 shadow-xs border border-slate-200/80 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 text-slate-700 hover:text-slate-950 transition-all flex items-center justify-center active:scale-95"
                      title={`Open ${member.name}'s GitHub`}
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 2: PROBLEM STATEMENT (PS 26092) - LIGHT THEME
         ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'ps' && (
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-6 flex flex-col justify-center animate-fadeIn my-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(15,23,42,0.06)] border border-slate-200/80">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-blue-100 text-[#0037b0] text-[10px] font-black uppercase tracking-wider">
                SIH 2026 OFFICIAL PROBLEM STATEMENT
              </span>
              <span className="text-xs text-slate-500 font-semibold">Government of India</span>
            </div>
            <h2 className="text-3xl font-black text-[#0a2560] font-heading tracking-tight">
              PS 26092
            </h2>

            {/* Title Card */}
            <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-slate-50 to-amber-50 border border-blue-200/60">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#0037b0] text-white text-[10px] font-black uppercase tracking-wide">
                  Software
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wide">
                  Smart Automation
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug font-heading">
                AI-Driven Scheme Matching for Marginalized Entrepreneurs
              </h3>
            </div>

            {/* Institutional Information */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-extrabold text-[#0037b0] uppercase tracking-widest block">
                  MINISTRY
                </span>
                <p className="text-xs font-bold text-slate-800 mt-1 leading-snug">
                  Ministry of Social Justice & Empowerment (MoSJE)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-extrabold text-[#0037b0] uppercase tracking-widest block">
                  DEPARTMENT
                </span>
                <p className="text-xs font-bold text-slate-800 mt-1 leading-snug">
                  Department of Social Justice and Empowerment
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-extrabold text-[#0037b0] uppercase tracking-widest block">
                  TARGET BENEFICIARIES
                </span>
                <p className="text-xs font-bold text-slate-800 mt-1 leading-snug">
                  SC entrepreneurs, SHGs & marginalized students
                </p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 3: THE EXISTING GAP - LIGHT THEME
         ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'problem' && (
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-6 flex flex-col justify-center animate-fadeIn my-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(15,23,42,0.06)] border border-slate-200/80">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider">
                CURRENT BOTTLENECK
              </span>
              <span className="text-xs text-slate-500 font-semibold">Why applicants struggle today</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              Funds exist. Access doesn't.
            </h2>

            {/* Key Scheme Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-center">
                <span className="text-[10px] font-bold text-slate-500 block">Income Limit</span>
                <span className="text-xs font-black text-amber-800">≤ ₹5.00 Lakh</span>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200 text-center">
                <span className="text-[10px] font-bold text-slate-500 block">Govt Funding</span>
                <span className="text-xs font-black text-[#0037b0]">Up to 90% Costs</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
                <span className="text-[10px] font-bold text-slate-500 block">Interest Rate</span>
                <span className="text-xs font-black text-emerald-800">4.0% – 6.0% p.a.</span>
              </div>
              <div className="p-3 rounded-2xl bg-red-50/70 border border-red-200 text-center">
                <span className="text-[10px] font-bold text-red-700 block">Root Issue</span>
                <span className="text-xs font-black text-slate-800">No Direct Portal</span>
              </div>
            </div>

            {/* 4 Problems Breakdown */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  num: "1",
                  title: "Which scheme fits me?",
                  desc: "Micro Finance up to ₹1.4 L, Term Loan up to ₹50 L, Education Loan — citizens cannot distinguish."
                },
                {
                  num: "2",
                  title: "Cannot apply directly",
                  desc: "Loans flow exclusively via 100+ Channel Partners: SCAs, PSBs, RRBs and NBFC-MFIs."
                },
                {
                  num: "3",
                  title: "Which partner? Where?",
                  desc: "No easy way to locate nearby active partner branches, resulting in rejection."
                },
                {
                  num: "4",
                  title: "Misrouted & delayed applications",
                  desc: "Manual paper processing, offline confusion, and delayed DBT disbursals."
                }
              ].map(item => (
                <div key={item.num} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                    {item.num}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 4: WHAT WE SOLVED - LIGHT THEME
         ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'solution' && (
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-6 flex flex-col justify-center animate-fadeIn my-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(15,23,42,0.06)] border border-slate-200/80">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                CORE INNOVATIONS
              </span>
              <span className="text-xs text-slate-500 font-semibold">PRAGATI Gateway Features</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              From confusion to clarity.
            </h2>

            {/* 4 Feature Solutions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {[
                {
                  pain: "Which scheme fits me?",
                  feature: "Smart Scheme Recommender",
                  desc: "Rule-based engine with grounded 'why you qualify' explanations and document-verified matching."
                },
                {
                  pain: "What will I repay?",
                  feature: "Financial Calculator",
                  desc: "Live EMI projections respecting official project cost ceilings, moratoriums, and women interest rebates."
                },
                {
                  pain: "Which partner is near & eligible?",
                  feature: "Partner Locator & Router",
                  desc: "Geo-routed matching to nearest SCA, PSB, RRB, and NBFC-MFI with NPA safeguard filtering."
                },
                {
                  pain: "Language & literacy barriers",
                  feature: "Multilingual + AI Voice Saathi",
                  desc: "English, Hindi, Marathi & Tamil voice explanations designed for rural citizens."
                }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/70">
                  <div className="text-[10px] text-slate-400 line-through">
                    {item.pain}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="material-symbols-outlined text-[16px] text-emerald-700">check_circle</span>
                    <h4 className="text-xs font-extrabold text-emerald-800">{item.feature}</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onComplete}
                className="py-2.5 px-6 rounded-full bg-[#0037b0] hover:bg-[#0a2560] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Launch Gateway</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </main>
      )}

      {/* ══ Government Footer ══ */}
      <footer className="w-full bg-white border-t border-slate-200/80 py-3.5 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <span>Smart India Hackathon 2026</span>
            <span>•</span>
            <span>Ministry of Social Justice & Empowerment</span>
            <span>•</span>
            <span>National Scheduled Castes Finance & Development Corporation</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <span>Team Astra-X (ID: {TEAM.teamId})</span>
            <span>•</span>
            <button onClick={onComplete} className="text-[#0037b0] hover:underline font-extrabold">
              Proceed to Portal →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
