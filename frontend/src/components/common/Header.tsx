import React, { useState, useEffect } from 'react';
import { UserRole, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface HeaderProps {
  title: string;
  role: UserRole;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onRoleChange: (role: UserRole) => void;
  onProfileClick: () => void;
  onNotificationsClick: () => void;
  isOffline: boolean;
  onToggleOffline: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  role,
  language,
  onLanguageChange,
  onRoleChange,
  onProfileClick,
  onNotificationsClick
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useEffect(() => {
    if (!roleMenuOpen && !langMenuOpen) return;
    const handleClick = () => {
      setRoleMenuOpen(false);
      setLangMenuOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [roleMenuOpen, langMenuOpen]);

  const roleLabels: Record<UserRole, string> = {
    citizen: 'Citizen Portal',
    facilitator: 'Channel Partner',
    admin: 'Ministry Admin',
    guest: 'Public Access'
  };

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' }
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <header className="app-header relative flex flex-col justify-between select-none shadow-lg">
      {/* ── Official Indian Tricolor Top Ribbon ── */}
      <div className="w-full h-[3px] bg-gradient-to-r from-[#FF9933] via-white to-[#138808] flex-shrink-0" />

      {/* ── Main Government Navigation Bar ── */}
      <div className="w-full flex-1 px-3 sm:px-5 md:px-7 flex items-center justify-between gap-3">
        {/* Left: Official Emblem & Ministry Header */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Ashoka Stambh Emblem in Gold-trimmed circular badge */}
          <div 
            onClick={onProfileClick}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-white/95 p-1 shadow-md border-2 border-amber-400/80 flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 transition-transform"
            title="Government of India Official Portal"
          >
            <img
              src="/emblem.png"
              alt="State Emblem of India"
              className="w-full h-full object-contain filter drop-shadow-xs"
            />
          </div>

          <div className="flex flex-col min-w-0">
            {/* Top Micro-Label: Dual Language Government Title */}
            <div className="flex items-center gap-2 leading-none">
              <span className="text-[9px] sm:text-[10px] font-bold text-amber-300 tracking-wider uppercase whitespace-nowrap truncate">
                भारत सरकार • GOVT OF INDIA
              </span>
              <span className="hidden sm:inline-block text-[9px] text-white/60 font-medium">|</span>
              <span className="hidden sm:inline-block text-[9px] text-slate-200 tracking-tight font-medium uppercase truncate max-w-[220px]">
                Min. of Social Justice & Empowerment
              </span>
            </div>

            {/* Portal Title */}
            <div className="flex items-center gap-2 mt-0.5 min-w-0">
              <h1 className="text-[13px] sm:text-[16px] font-extrabold text-white leading-tight whitespace-nowrap truncate font-heading tracking-tight">
                {title || 'National Concessional Finance Portal'}
              </h1>
              <span className="hidden md:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-400/40 items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Official DBT Gateway
              </span>
            </div>
          </div>
        </div>

        {/* Right: Official Utilities & Verification Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Security & Authenticity Badge (Gov Portal Indicator) */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-[11px] font-medium">
            <span className="material-symbols-outlined text-[14px] text-emerald-400">verified_user</span>
            <span className="font-semibold text-white text-[10px]">NIC Certified</span>
          </div>

          {/* Multilingual Language Dropdown Selector */}
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-md transition-all active:scale-95 text-xs font-bold shadow-xs"
              aria-label="Select Language"
              aria-expanded={langMenuOpen}
            >
              <span className="material-symbols-outlined text-[15px] text-amber-300">translate</span>
              <span className="font-bold tracking-wide">{currentLang.native}</span>
              <span className="material-symbols-outlined text-[14px] text-white/80 transition-transform duration-200">
                {langMenuOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-1.5 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-1 text-[9px] uppercase font-black text-slate-400 tracking-wider border-b border-slate-100 mb-1">
                  Choose Language
                </div>
                {languages.map(item => {
                  const isSelected = language === item.code;
                  return (
                    <button
                      key={item.code}
                      onClick={() => {
                        onLanguageChange(item.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        isSelected ? 'text-[#0037b0] font-bold bg-blue-50/80' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase w-5">
                          {item.code}
                        </span>
                        <span className="font-semibold text-slate-800">{item.native}</span>
                      </div>
                      {isSelected && (
                        <span className="material-symbols-outlined text-[16px] text-[#0037b0]">check</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile Role Switcher */}
          <div className="relative md:hidden" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold text-[10px] sm:text-[11px] flex items-center gap-1 border border-white/20 backdrop-blur-md transition-all active:scale-95"
            >
              <span className="whitespace-nowrap">{roleLabels[role]}</span>
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-1.5 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                  Select User Interface
                </div>
                {(['citizen', 'facilitator', 'admin'] as UserRole[]).map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      onRoleChange(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      role === r ? 'text-[#0037b0] font-bold bg-blue-50/80' : 'text-slate-700'
                    }`}
                  >
                    <span>{roleLabels[r]}</span>
                    {role === r && <span className="material-symbols-outlined text-[14px]">check</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <button
            onClick={onNotificationsClick}
            aria-label="Notifications"
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md transition-all relative active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-[#0a2560] animate-pulse"></span>
          </button>
        </div>
      </div>

      {/* ── Sub-Hairline Accent ── */}
      <div className="w-full h-[1px] bg-white/10 flex-shrink-0" />
    </header>
  );
};
