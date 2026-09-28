import React, { useState } from 'react';
import { Language, UserProfile, ApplicationTrackerItem } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { NSFDC_SCHEMES } from '../../data/schemes';

interface CitizenDashboardProps {
  language: Language;
  profile: UserProfile;
  application: ApplicationTrackerItem;
  onNavigateTab: (tab: 'home' | 'schemes' | 'calculator' | 'locator') => void;
  onOpenVoiceSaathi: () => void;
  onOpenAppTracker: () => void;
  onEditProfile: () => void;
  onSelectSchemeForEmi: (schemeId: string) => void;
  onBookmarkToggle?: (schemeId: string) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  language,
  profile,
  application,
  onNavigateTab,
  onOpenVoiceSaathi,
  onOpenAppTracker,
  onEditProfile,
  onSelectSchemeForEmi
}) => {
  const t = TRANSLATIONS[language];
  const [activeCategory, setActiveCategory] = useState<string>('matched');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['scheme-tls']);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const categories = [
    { id: 'matched', label: t.filterMostMatched },
    { id: 'term-loans', label: t.filterTermLoans },
    { id: 'micro-credit', label: t.filterMicroCredit },
    { id: 'women-quota', label: t.filterWomenQuota },
    { id: 'education', label: t.filterSkillLoans }
  ];

  const filteredSchemes = NSFDC_SCHEMES.filter(s => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.categoryLabel.toLowerCase().includes(q)
      );
    }
    if (activeCategory === 'term-loans') return s.category === 'term';
    if (activeCategory === 'micro-credit') return s.category === 'micro';
    if (activeCategory === 'women-quota') return s.category === 'women';
    if (activeCategory === 'education') return s.category === 'education';
    return true;
  });

  return (
    <div className="flex flex-col w-full pt-2">
      {/* ── Greeting Header ── */}
      <section className="safe-padding pt-1 pb-3 flex items-center justify-between gap-2 overflow-hidden">
        <div className="flex flex-col min-w-0 overflow-hidden">
          <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-[#191c1e] tracking-tight whitespace-nowrap truncate max-w-[160px] sm:max-w-none">
              {profile.name ? (language === 'hi' ? `नमस्ते, ${profile.name}` : `Hi, ${profile.name}`) : t.greeting}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200/80 inline-flex items-center gap-1 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Verified Citizen
            </span>
          </div>
          <p className="text-xs text-[#565e74] mt-0.5 whitespace-nowrap truncate flex items-center gap-1.5">
            <span className="font-semibold text-slate-800 font-mono">+91 {profile.phone || '9959999429'}</span>
            <span className="text-slate-400">•</span>
            <span>{t.greetingSub}</span>
          </p>
        </div>

        <button
          onClick={onEditProfile}
          title="Edit Profile"
          className="relative group focus:outline-none flex-shrink-0"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden shadow-sm bg-[#e6e8ea] p-0.5 border border-slate-200 group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-[#0037b0] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px] sm:text-[22px]">person</span>
            </div>
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#0037b0] rounded-full ring-2 ring-white"></span>
        </button>
      </section>

      {/* ── National Welfare Credit Banner (India Representation) ── */}
      <section className="safe-padding mb-4">
        <div
          onClick={() => onNavigateTab('schemes')}
          className="bg-gradient-to-r from-[#06183d] via-[#0a2560] to-[#0037b0] rounded-3xl p-4 sm:p-5 text-white shadow-lg relative overflow-hidden flex items-center justify-between gap-3 border-l-4 border-amber-400 cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-400/20 transition-all" />

          <div className="flex flex-col min-w-0 z-10">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[10px] font-bold text-amber-300 tracking-wider uppercase border border-white/20 backdrop-blur-md">
                सत्यमेव जयते • भारत सरकार
              </span>
              <span className="text-[11px] text-white/80 font-medium">Direct Benefit Transfer</span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug font-heading tracking-tight">
              National Concessional Credit Gateway Active
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-200 mt-1 leading-normal max-w-xl">
              Direct loans from 4.0% – 6.0% interest backed by NSFDC, NBCFDC & NSKFDC with up to 50% capital subsidies for eligible citizens.
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white p-1.5 shrink-0 shadow-md flex items-center justify-center border border-amber-300/60 z-10 hidden sm:flex group-hover:scale-105 transition-transform">
            <img src="/emblem.png" alt="National Emblem" className="w-full h-full object-contain filter drop-shadow-xs" />
          </div>
        </div>
      </section>

      {/* ── Document Verification & OCR Prompt Card ── */}
      <section className="safe-padding mb-4">
        <div
          onClick={onEditProfile}
          className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-blue-50 border-2 border-amber-300/80 shadow-sm cursor-pointer hover:shadow-md hover:border-amber-400 transition-all flex items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">assignment_turned_in</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[9px] font-bold uppercase tracking-wider">
                  Official Verification
                </span>
                <span className="text-[10px] text-slate-500 font-medium">AI OCR Assisted</span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#191c1e] font-heading mt-0.5 truncate">
                Upload Required Documents & Get AI Scheme Match
              </h4>
              <p className="text-[11px] text-slate-600 truncate">
                Aadhaar, Caste, Income, Bank Passbook • Auto OCR data extraction
              </p>
            </div>
          </div>
          <button className="px-3.5 py-1.5 rounded-full bg-[#0037b0] text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-sm group-hover:bg-[#0a2560] transition-colors">
            <span>Upload Docs</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* ── Search Bar ── */}
      <section className="safe-padding mb-4">
        <div className="relative flex items-center w-full bg-white rounded-full shadow-[0_4px_20px_-2px_rgba(15,23,42,0.06)] px-4 py-2.5 border border-slate-100">
          <span className="material-symbols-outlined text-[#565e74] text-[22px] mr-2.5 flex-shrink-0">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent text-sm text-[#191c1e] placeholder:text-slate-400 focus:outline-none min-w-0"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
          <div className="w-px h-5 bg-[#e0e3e5] mx-2 flex-shrink-0"></div>
          <button
            onClick={() => onNavigateTab('schemes')}
            aria-label="Filter Options"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-[#eceef0] text-[#191c1e] hover:bg-[#e6e8ea] transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
        </div>
      </section>

      {/* ── Category Filter Pills ── */}
      <section className="mb-5">
        <div className="flex items-center gap-2 overflow-x-auto safe-padding scrollbar-none pb-1">
          {categories.map(c => {
            const isSelected = activeCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold shadow-xs transition-all duration-200 whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#2d3133] text-white shadow-md'
                    : 'bg-[#f2f4f6] text-[#565e74] hover:bg-[#eceef0]'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Recommended Schemes ── */}
      <section className="mb-6">
        <div className="safe-padding flex items-center justify-between mb-3 gap-2">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-[#191c1e] text-truncate">{t.recommendedForYou}</h3>
            <p className="text-[11px] text-[#565e74] text-truncate">{t.recommendedSub}</p>
          </div>
          <button
            onClick={() => onNavigateTab('schemes')}
            className="text-xs font-semibold text-[#0037b0] flex items-center gap-0.5 hover:underline flex-shrink-0"
          >
            <span>{t.viewAll}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* Horizontal Scroll Cards */}
        <div className="scheme-scroll">
          {filteredSchemes.map(s => {
            const isBookmarked = bookmarkedIds.includes(s.id);
            const matchScore = s.id === 'scheme-tls' ? 96 : s.id === 'scheme-mcf' ? 91 : 94;

            return (
              <div key={s.id} className="scheme-card shadow-[0_12px_32px_-4px_rgba(15,23,42,0.12)] flex flex-col justify-between p-4 group border border-slate-100/50">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${s.imageUrl})` }}
                ></div>

                {/* Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/95 via-[#0f172a]/40 to-black/25"></div>

                {/* Top Badges */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-md text-[#191c1e] text-[10px] font-semibold shadow-xs flex items-center gap-1 min-w-0">
                    <span className="material-symbols-outlined text-[13px] text-[#0037b0] material-symbols-fill flex-shrink-0">verified</span>
                    <span className="text-truncate">{t.govtSubsidized}</span>
                  </span>

                  <button
                    onClick={() => toggleBookmark(s.id)}
                    aria-label="Bookmark"
                    className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all flex-shrink-0 ${
                      isBookmarked
                        ? 'bg-[#0037b0] text-white shadow-md'
                        : 'bg-white/70 text-[#191c1e] hover:bg-white'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${isBookmarked ? 'material-symbols-fill' : ''}`}>
                      {isBookmarked ? 'bookmark' : 'bookmark_border'}
                    </span>
                  </button>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 p-3 rounded-2xl bg-[#0f172a]/80 backdrop-blur-xl text-white shadow-lg border border-white/10">
                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#1d4ed8] text-white text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
                      {matchScore}% Match
                    </span>
                    <span className="text-xs text-slate-200 flex items-center gap-1 font-medium flex-shrink-0">
                      <span className="material-symbols-outlined text-[14px] text-[#7bd0ff]">percent</span>
                      {s.interestRate !== null ? `${s.interestRate.toFixed(1)}%` : 'Govt Terms'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white text-truncate mb-0.5">{s.name}</h4>
                  <p className="text-[11px] text-slate-300 flex items-center gap-1 mb-2 text-truncate">
                    <span className="material-symbols-outlined text-[13px] flex-shrink-0">account_balance</span>
                    <span className="text-truncate">NSFDC • {s.categoryLabel}</span>
                  </p>

                  <div className="flex items-center justify-between bg-white/10 rounded-xl px-2.5 py-1.5 gap-2">
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-white">
                        {s.maxFunding === 0 ? 'Free (Stipend)' : `₹${(s.maxFunding / 100000).toFixed(1)}L`}
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectSchemeForEmi(s.id)}
                      className="px-3 py-1.5 rounded-full bg-white text-[#191c1e] text-xs font-bold hover:bg-slate-100 transition-colors inline-flex items-center gap-1 shadow-sm active:scale-95 flex-shrink-0"
                    >
                      <span>{t.apply}</span>
                      <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Active Application Tracker ── */}
      <section className="safe-padding mb-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0037b0] pulse-gentle flex-shrink-0"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0037b0] text-truncate">
                {t.inReviewApp}
              </span>
            </div>
            <span className="text-xs text-[#565e74] font-medium flex-shrink-0">{application.refNumber}</span>
          </div>

          <div className="flex items-start justify-between mb-4 gap-3">
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-[#191c1e] leading-snug text-clamp-2">
                {application.schemeTitle}
              </h4>
              <p className="text-xs text-[#565e74] mt-0.5 text-truncate">{application.channelPartnerName}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-sm font-bold text-[#0037b0]">
                ₹{application.requestedAmount.toLocaleString('en-IN')}
              </span>
              <p className="text-[10px] text-[#565e74]">{t.sanctionRequested}</p>
            </div>
          </div>

          {/* 4-Step Progress */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {[
              { label: t.applied, sub: '12 Oct', done: true, active: false },
              { label: t.bankVerification, sub: 'In Progress', done: false, active: true },
              { label: t.corpApproval, sub: 'Stage 3', done: false, active: false },
              { label: t.disbursal, sub: 'Stage 4', done: false, active: false }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center min-w-0">
                <div className={`w-full h-1.5 rounded-full mb-1.5 ${
                  step.done || step.active ? 'bg-[#0037b0]' : 'bg-[#e0e3e5]'
                }`}></div>
                <span className={`text-[10px] sm:text-[11px] font-semibold leading-tight text-truncate w-full ${
                  step.active ? 'text-[#0037b0]' : step.done ? 'text-[#191c1e]' : 'text-slate-400'
                }`}>
                  {step.label}
                </span>
                <span className={`text-[9px] sm:text-[10px] leading-tight text-truncate w-full ${
                  step.active ? 'text-[#0037b0] font-medium' : 'text-slate-400'
                }`}>
                  {step.sub}
                </span>
              </div>
            ))}
          </div>

          {/* Officer Visit */}
          <div className="mt-4 flex items-center justify-between bg-[#f2f4f6] rounded-2xl px-3 py-2 border border-slate-100 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[#0037b0] text-[18px] flex-shrink-0">info</span>
              <span className="text-xs text-[#191c1e] font-medium text-truncate">{t.officerVisit}</span>
            </div>
            <button
              onClick={onOpenAppTracker}
              className="text-xs font-bold text-[#0037b0] hover:underline flex-shrink-0"
            >
              {t.trackDetails}
            </button>
          </div>
        </div>
      </section>

      {/* ── Citizen Services Grid ── */}
      <section className="safe-padding mb-5">
        <div className="flex items-center justify-between mb-3 gap-2">
          <h3 className="text-base font-bold text-[#191c1e] text-truncate">{t.citizenServices}</h3>
          <span className="text-xs text-[#565e74] flex-shrink-0">{t.utilitiesSub}</span>
        </div>

        <div className="services-grid">
          {/* Find Schemes */}
          <button
            onClick={() => onNavigateTab('schemes')}
            className="card p-4 hover:bg-[#f2f4f6] transition-colors flex flex-col justify-between h-28 md:h-32 group text-left active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#0037b0] group-hover:scale-110 transition-transform flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-[#191c1e] leading-tight text-truncate">{t.findSchemes}</h4>
              <p className="text-[11px] text-[#565e74] mt-0.5 text-truncate">{t.findSchemesSub}</p>
            </div>
          </button>

          {/* EMI Calculator */}
          <button
            onClick={() => onNavigateTab('calculator')}
            className="card p-4 hover:bg-[#f2f4f6] transition-colors flex flex-col justify-between h-28 md:h-32 group text-left active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#0037b0] group-hover:scale-110 transition-transform flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">calculate</span>
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-[#191c1e] leading-tight text-truncate">{t.emiCalc}</h4>
              <p className="text-[11px] text-[#565e74] mt-0.5 text-truncate">{t.emiCalcSub}</p>
            </div>
          </button>

          {/* Channel Partners */}
          <button
            onClick={() => onNavigateTab('locator')}
            className="card p-4 hover:bg-[#f2f4f6] transition-colors flex flex-col justify-between h-28 md:h-32 group text-left active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#0037b0] group-hover:scale-110 transition-transform flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">storefront</span>
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-[#191c1e] leading-tight text-truncate">{t.channelPartners}</h4>
              <p className="text-[11px] text-[#565e74] mt-0.5 text-truncate">{t.channelPartnersSub}</p>
            </div>
          </button>

          {/* Voice Saathi */}
          <button
            onClick={onOpenVoiceSaathi}
            className="card p-4 hover:bg-[#f2f4f6] transition-colors flex flex-col justify-between h-28 md:h-32 group text-left active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#0037b0] group-hover:scale-110 transition-transform flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">mic</span>
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-[#191c1e] leading-tight text-truncate">{t.voiceSaathi}</h4>
              <p className="text-[11px] text-[#565e74] mt-0.5 text-truncate">{t.voiceSaathiSub}</p>
            </div>
          </button>
        </div>
      </section>

      {/* ── Help Banner ── */}
      <section className="safe-padding mb-6">
        <div className="bg-[#eceef0] rounded-2xl p-3.5 flex items-center justify-between border border-slate-200 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0037b0] shadow-xs flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">support_agent</span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-[#565e74] font-medium text-truncate">{t.tollFree}</p>
              <p className="text-xs font-bold text-[#191c1e] text-truncate">1800-11-2244 (Mon - Sat)</p>
            </div>
          </div>
          <a
            href="tel:1800112244"
            className="px-3.5 py-1.5 rounded-full bg-[#0f172a] text-white text-xs font-semibold shadow-xs hover:opacity-90 active:scale-95 transition-all flex-shrink-0"
          >
            {t.callNow}
          </a>
        </div>
      </section>
    </div>
  );
};
