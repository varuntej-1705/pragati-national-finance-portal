import React from 'react';
import { Language, UserRole } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface LandingPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenLogin: () => void;
  onContinueAsGuest: () => void;
  onOpenAssistance: () => void;
  onQuickRoleSelect: (role: UserRole, phone: string) => void;
  onOpenTeam: () => void;
  onOpenPS: () => void;
  onOpenAboutTeam?: () => void;
  onReplayIntro?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  language,
  onLanguageChange,
  onOpenLogin,
  onContinueAsGuest,
  onOpenTeam,
  onOpenPS,
  onOpenAboutTeam,
  onReplayIntro
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="w-full min-h-screen min-h-[100dvh] bg-gradient-to-b from-[#06183d] via-[#0a2560] to-[#0037b0] text-white flex flex-col justify-between selection:bg-white selection:text-[#0a2560] overflow-x-hidden">
      {/* ══ Top Government Header ══ */}
      <header className="w-full px-3 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between border-b border-white/10 bg-black/15 backdrop-blur-md gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          {/* Indian Tricolor micro-bar */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <span className="w-2 sm:w-2.5 h-1.5 bg-[#FF9933] rounded-xs"></span>
            <span className="w-2 sm:w-2.5 h-1.5 bg-white rounded-xs"></span>
            <span className="w-2 sm:w-2.5 h-1.5 bg-[#138808] rounded-xs"></span>
          </div>
          <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-white/90 uppercase whitespace-nowrap truncate">
            भारत सरकार • <span className="hidden sm:inline">Government of India</span><span className="sm:hidden">GOI</span>
          </span>
        </div>

        {/* Right Header Navigation: Our Team, Our PS & Language */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Our Team Pill */}
          <button
            onClick={onOpenTeam}
            className="px-2.5 sm:px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold border border-white/20 flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
            title="View Team Astra-X"
          >
            <span className="material-symbols-outlined text-[15px] text-amber-300">groups</span>
            <span>Our Team</span>
          </button>

          {/* Our PS Pill */}
          <button
            onClick={onOpenPS}
            className="px-2.5 sm:px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold border border-white/20 flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
            title="View Problem Statement PS 26092"
          >
            <span className="material-symbols-outlined text-[15px] text-cyan-300">assignment</span>
            <span>Our PS</span>
          </button>

          {/* Clean Language Selector */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-white/10 rounded-full p-0.5 sm:p-1 border border-white/15">
            {([
              { code: 'en' as Language, label: 'EN' },
              { code: 'hi' as Language, label: 'हिं' },
              { code: 'te' as Language, label: 'తె' },
              { code: 'ta' as Language, label: 'த' },
              { code: 'mr' as Language, label: 'म' },
              { code: 'kn' as Language, label: 'ಕ' }
            ]).map(item => (
              <button
                key={item.code}
                onClick={() => onLanguageChange(item.code)}
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-semibold whitespace-nowrap transition-all ${
                  language === item.code
                    ? 'bg-white text-[#0a2560] shadow-sm font-bold'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ══ Hero Section: Greeting & Intro Only (Modern Ambient GovTech) ══ */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 text-center max-w-3xl mx-auto w-full relative z-10">
        {/* Subtle Ambient Radial Glow behind Emblem */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-blue-500/20 via-amber-400/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Official National Emblem with modern elevated card */}
        <div className="mb-4 flex flex-col items-center relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-3xl bg-white/95 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.35)] flex items-center justify-center border-2 border-amber-300/50 backdrop-blur-md hover:scale-105 transition-transform duration-300">
            <img
              src="/emblem.png"
              alt="State Emblem of India - सत्यमेव जयते"
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          </div>
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xl text-[10px] sm:text-[11px] font-bold text-amber-200 tracking-widest uppercase border border-white/20 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span>सत्यमेव जयते</span>
          </div>
        </div>

        {/* Tricolor Accent Pill */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-9 h-1 rounded-full bg-[#FF9933] shadow-xs"></div>
          <div className="w-9 h-1 rounded-full bg-white shadow-xs"></div>
          <div className="w-9 h-1 rounded-full bg-[#138808] shadow-xs"></div>
        </div>

        {/* Portal Name in Geometric Font */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-2 font-heading">
          PRAGATI
        </h1>
        <p className="text-base sm:text-lg font-bold text-[#cad3ff] tracking-wide mb-1 font-heading">
          {t.tagline}
        </p>
        <p className="text-xs sm:text-sm text-amber-300/95 font-medium tracking-wide mb-5">
          {t.subTagline}
        </p>

        {/* Warm Greeting & Intro Card */}
        <div className="max-w-xl mx-auto mb-8 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
          <p className="text-lg sm:text-xl font-bold text-white mb-1.5 font-heading">
            नमस्ते • Welcome
          </p>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
            Welcome to the official National Concessional Credit Gateway by the Ministry of Social Justice & Empowerment, Government of India. 
            Facilitating direct concessional credit, interest subsidies, and seamless DBT disbursals for eligible citizens.
          </p>
        </div>

        {/* Action Button */}
        <div className="w-full max-w-md">
          {/* Sign In button */}
          <button
            onClick={onOpenLogin}
            className="w-full py-4 px-6 rounded-full bg-white text-[#0a2560] font-bold text-base shadow-xl hover:bg-slate-50 hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
            <span className="material-symbols-outlined text-[#0037b0] text-[22px] group-hover:translate-x-0.5 transition-transform">login</span>
            <span>Sign In</span>
          </button>
        </div>

        {/* SIH 2026 Presentation Quick Access: Our Team & Our PS */}
        <div className="flex items-center justify-center gap-2.5 w-full max-w-md mt-4">
          <button
            onClick={onOpenTeam}
            className="flex-1 py-2.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 shadow-sm hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group active:scale-95"
          >
            <span className="material-symbols-outlined text-amber-300 text-[18px]">groups</span>
            <span>Our Team (Astra-X)</span>
          </button>

          <button
            onClick={onOpenPS}
            className="flex-1 py-2.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 shadow-sm hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group active:scale-95"
          >
            <span className="material-symbols-outlined text-[#7bd0ff] text-[18px]">assignment</span>
            <span>Our PS (26092)</span>
          </button>
        </div>
      </main>

      {/* ══ Simple Official Footer ══ */}
      <footer className="w-full py-3 px-4 text-center border-t border-white/10 bg-black/20 text-white/70 text-[11px] sm:text-xs">
        <p className="font-semibold text-white/90">
          Ministry of Social Justice & Empowerment • Government of India
        </p>
        <p className="text-[10px] text-white/60 mt-0.5">
          National Scheduled Castes Finance & Development Corporation (NSFDC)
        </p>

        {/* SIH 2026 Team & PS Links */}
        <div className="flex items-center justify-center gap-3 mt-2 pt-2 border-t border-white/10 text-[11px] text-amber-300 font-semibold">
          <button
            onClick={onOpenTeam}
            className="hover:underline flex items-center gap-1 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[13px]">groups</span>
            Our Team
          </button>
          <span className="text-white/30">•</span>
          <button
            onClick={onOpenPS}
            className="hover:underline flex items-center gap-1 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[13px]">assignment</span>
            Our PS (26092)
          </button>
        </div>
      </footer>
    </div>
  );
};
