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

  // Filter schemes
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
    return true; // 'matched' shows all ranked
  });

  return (
    <div className="flex flex-col w-full pb-28 pt-2">
      {/* Greeting Header */}
      <section className="px-5 pt-1 pb-4 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <h2 className="text-xl font-bold text-[#191c1e] tracking-tight">
              {t.greeting || `Hi, ${profile.name}`}
            </h2>
            <span className="text-[20px] select-none">👋</span>
          </div>
          <p className="text-xs text-[#565e74] mt-0.5">{t.greetingSub}</p>
        </div>

        {/* Profile Avatar with status ring */}
        <button
          onClick={onEditProfile}
          title="Edit Profile & Verification Details"
          className="relative group focus:outline-none"
        >
          <div className="w-11 h-11 rounded-full overflow-hidden shadow-sm bg-[#e6e8ea] p-0.5 border border-slate-200 group-hover:scale-105 transition-transform">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDE5yngGe93hqJbVoDKwyvbis-Jkgz3DULBWFzQRgXjkAGLikpUD-3G2Y2G3RC3dtJeHc9fMQHi72hxVc3Bpn3Tl2TO-6Fbk0ohvytJeJAjB3JcNUe0mp8JS2yNWwTmZDEySArhCkP0W_gnRHl-sGwLfPUqDEfomVktGsh7DY_Nt5lnz0azWlyTO0cYxbOjRGnQKsJ7t30EjIGguouBG4cYC4eTvt06QmzN6ZYl0IIb5UMvTfivzODZ"
              alt="Profile of citizen entrepreneur"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#0037b0] rounded-full ring-2 ring-white"></span>
        </button>
      </section>

      {/* Search Bar with Filter Toggle */}
      <section className="px-5 mb-4">
        <div className="relative flex items-center w-full bg-white rounded-full shadow-[0_4px_20px_-2px_rgba(15,23,42,0.06)] px-4 py-2.5 border border-slate-100">
          <span className="material-symbols-outlined text-[#565e74] text-[22px] mr-2.5 shrink-0">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent text-sm text-[#191c1e] placeholder:text-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
          <div className="w-px h-5 bg-[#e0e3e5] mx-2"></div>
          <button
            onClick={() => onNavigateTab('schemes')}
            aria-label="Filter Options"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-[#eceef0] text-[#191c1e] hover:bg-[#e6e8ea] transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
        </div>
      </section>

      {/* Category Filter Pills */}
      <section className="mb-5">
        <div className="flex items-center gap-2 overflow-x-auto px-5 scrollbar-none pb-1">
          {categories.map(c => {
            const isSelected = activeCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold shadow-xs transition-all duration-200 ${
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

      {/* Recommended Schemes Carousel (Image 3) */}
      <section className="mb-6">
        <div className="px-5 flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-[#191c1e]">{t.recommendedForYou}</h3>
            <p className="text-[11px] text-[#565e74]">{t.recommendedSub}</p>
          </div>
          <button
            onClick={() => onNavigateTab('schemes')}
            className="text-xs font-semibold text-[#0037b0] flex items-center gap-0.5 hover:underline"
          >
            <span>{t.viewAll}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* Horizontal Swipe Cards */}
        <div className="flex gap-4 overflow-x-auto px-5 scrollbar-none snap-x snap-mandatory pb-2">
          {filteredSchemes.map(s => {
            const isBookmarked = bookmarkedIds.includes(s.id);
            const isHero = s.id === 'scheme-tls';
            const matchScore = isHero ? 96 : s.id === 'scheme-mcf' ? 91 : 94;

            return (
              <div
                key={s.id}
                className="snap-start shrink-0 w-[84vw] max-w-[325px] h-[400px] rounded-3xl relative overflow-hidden shadow-[0_12px_32px_-4px_rgba(15,23,42,0.12)] flex flex-col justify-between p-4 group border border-slate-100/50"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${s.imageUrl})` }}
                ></div>

                {/* Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/95 via-[#0f172a]/40 to-black/25"></div>

                {/* Top Badges */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-[#191c1e] text-[11px] font-semibold shadow-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#0037b0] material-symbols-fill">
                      verified
                    </span>
                    <span>{t.govtSubsidized}</span>
                  </span>

                  <button
                    onClick={() => toggleBookmark(s.id)}
                    aria-label="Bookmark Scheme"
                    className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                      isBookmarked
                        ? 'bg-[#0037b0] text-white shadow-md'
                        : 'bg-white/70 text-[#191c1e] hover:bg-white'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        isBookmarked ? 'material-symbols-fill' : ''
                      }`}
                    >
                      {isBookmarked ? 'bookmark' : 'bookmark_border'}
                    </span>
                  </button>
                </div>

                {/* Floating Glass Bottom Plaque */}
                <div className="relative z-10 p-3.5 rounded-2xl bg-[#0f172a]/80 backdrop-blur-xl text-white shadow-lg border border-white/10">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-[#1d4ed8] text-white text-[10px] font-bold uppercase tracking-wider">
                      {matchScore}% Match
                    </span>
                    <span className="text-xs text-slate-200 flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-[14px] text-[#7bd0ff]">percent</span>
                      {s.interestRate.toFixed(2)}% APR
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white truncate mb-0.5">
                    {s.name}
                  </h4>
                  <p className="text-[11px] text-slate-300 flex items-center gap-1 mb-2.5 truncate">
                    <span className="material-symbols-outlined text-[13px]">account_balance</span>
                    <span>NSFDC • {s.categoryLabel}</span>
                  </p>

                  <div className="pt-2 flex items-center justify-between bg-white/10 rounded-xl px-2.5 py-1.5">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-300 uppercase tracking-wide">
                        {t.maxFunding}
                      </span>
                      <span className="text-sm font-bold text-white">
                        ₹{(s.maxFunding / 100000).toFixed(1)} Lakh
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectSchemeForEmi(s.id)}
                      className="px-3.5 py-1.5 rounded-full bg-white text-[#191c1e] text-xs font-bold hover:bg-slate-100 transition-colors inline-flex items-center gap-1 shadow-sm active:scale-95"
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

      {/* Active Application Progress Tracker Card (Image 3) */}
      <section className="px-5 mb-6">
        <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.06)] border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0037b0] animate-ping"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0037b0]">
                {t.inReviewApp}
              </span>
            </div>
            <span className="text-xs text-[#565e74] font-medium">{application.refNumber}</span>
          </div>

          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-[#191c1e] leading-snug">
                {application.schemeTitle}
              </h4>
              <p className="text-xs text-[#565e74] mt-0.5">{application.channelPartnerName}</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-[#0037b0]">
                ₹{application.requestedAmount.toLocaleString('en-IN')}
              </span>
              <p className="text-[10px] text-[#565e74]">{t.sanctionRequested}</p>
            </div>
          </div>

          {/* 4-Step Pill Tracker */}
          <div className="relative pt-1 pb-1">
            <div className="grid grid-cols-4 gap-2">
              {/* Step 1: Applied */}
              <div className="flex flex-col items-center text-center">
                <div className="w-full h-1.5 rounded-full bg-[#0037b0] mb-1.5"></div>
                <span className="text-[11px] text-[#191c1e] font-semibold">{t.applied}</span>
                <span className="text-[10px] text-[#565e74]">12 Oct</span>
              </div>

              {/* Step 2: Bank Verification (Active) */}
              <div className="flex flex-col items-center text-center">
                <div className="w-full h-1.5 rounded-full bg-[#0037b0] mb-1.5"></div>
                <span className="text-[11px] text-[#0037b0] font-bold">{t.bankVerification}</span>
                <span className="text-[9px] text-[#0037b0] font-medium leading-tight">
                  Pending Field Visit
                </span>
              </div>

              {/* Step 3: Corp Approval */}
              <div className="flex flex-col items-center text-center">
                <div className="w-full h-1.5 rounded-full bg-[#e0e3e5] mb-1.5"></div>
                <span className="text-[11px] text-slate-400">{t.corpApproval}</span>
                <span className="text-[10px] text-slate-400">Stage 3</span>
              </div>

              {/* Step 4: Disbursal */}
              <div className="flex flex-col items-center text-center">
                <div className="w-full h-1.5 rounded-full bg-[#e0e3e5] mb-1.5"></div>
                <span className="text-[11px] text-slate-400">{t.disbursal}</span>
                <span className="text-[10px] text-slate-400">Stage 4</span>
              </div>
            </div>
          </div>

          {/* Officer Visit scheduled notification */}
          <div className="mt-4 pt-3 flex items-center justify-between bg-[#f2f4f6] rounded-2xl px-3 py-2 border border-slate-100">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0037b0] text-[18px]">info</span>
              <span className="text-xs text-[#191c1e] font-medium">{t.officerVisit}</span>
            </div>
            <button
              onClick={onOpenAppTracker}
              className="text-xs font-bold text-[#0037b0] hover:underline"
            >
              {t.trackDetails}
            </button>
          </div>
        </div>
      </section>

      {/* Citizen Services 2x2 Grid (Image 3) */}
      <section className="px-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-[#191c1e]">{t.citizenServices}</h3>
          <span className="text-xs text-[#565e74]">{t.utilitiesSub}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Tile 1: Find Schemes */}
          <button
            onClick={() => onNavigateTab('schemes')}
            className="bg-white p-4 rounded-3xl shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] hover:bg-[#f2f4f6] transition-colors flex flex-col justify-between h-32 group border border-slate-100 text-left active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#0037b0] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#191c1e] leading-tight">{t.findSchemes}</h4>
              <p className="text-[11px] text-[#565e74] mt-0.5">{t.findSchemesSub}</p>
            </div>
          </button>

          {/* Tile 2: EMI Calculator */}
          <button
            onClick={() => onNavigateTab('calculator')}
            className="bg-white p-4 rounded-3xl shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] hover:bg-[#f2f4f6] transition-colors flex flex-col justify-between h-32 group border border-slate-100 text-left active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#0037b0] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">calculate</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#191c1e] leading-tight">{t.emiCalc}</h4>
              <p className="text-[11px] text-[#565e74] mt-0.5">{t.emiCalcSub}</p>
            </div>
          </button>

          {/* Tile 3: Channel Partners */}
          <button
            onClick={() => onNavigateTab('locator')}
            className="bg-white p-4 rounded-3xl shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] hover:bg-[#f2f4f6] transition-colors flex flex-col justify-between h-32 group border border-slate-100 text-left active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#0037b0] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">storefront</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#191c1e] leading-tight">{t.channelPartners}</h4>
              <p className="text-[11px] text-[#565e74] mt-0.5">{t.channelPartnersSub}</p>
            </div>
          </button>

          {/* Tile 4: Voice Saathi */}
          <button
            onClick={onOpenVoiceSaathi}
            className="bg-white p-4 rounded-3xl shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] hover:bg-[#f2f4f6] transition-colors flex flex-col justify-between h-32 group border border-slate-100 text-left active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#0037b0] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[22px]">mic</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#191c1e] leading-tight">{t.voiceSaathi}</h4>
              <p className="text-[11px] text-[#565e74] mt-0.5">{t.voiceSaathiSub}</p>
            </div>
          </button>
        </div>
      </section>

      {/* Toll Free Support & Help Banner */}
      <section className="px-5 mb-3">
        <div className="bg-[#eceef0] rounded-2xl p-3.5 flex items-center justify-between border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0037b0] shadow-xs shrink-0">
              <span className="material-symbols-outlined text-[20px]">support_agent</span>
            </div>
            <div>
              <p className="text-[11px] text-[#565e74] font-medium">{t.tollFree}</p>
              <p className="text-xs font-bold text-[#191c1e]">1800-11-2244 (Mon - Sat)</p>
            </div>
          </div>
          <a
            href="tel:1800112244"
            className="px-3.5 py-1.5 rounded-full bg-[#0f172a] text-white text-xs font-semibold shadow-xs hover:opacity-90 active:scale-95 transition-all"
          >
            {t.callNow}
          </a>
        </div>
      </section>
    </div>
  );
};
