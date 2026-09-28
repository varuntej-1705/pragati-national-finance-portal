import React from 'react';
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
  onNotificationsClick,
  isOffline,
  onToggleOffline
}) => {
  const t = TRANSLATIONS[language];
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);
  const [langMenuOpen, setLangMenuOpen] = React.useState(false);

  const roleLabels: Record<UserRole, string> = {
    citizen: 'Citizen / नागरिक',
    facilitator: 'Facilitator / मित्र',
    admin: 'Admin / प्रशासक',
    guest: 'Guest / अतिथि'
  };

  return (
    <header className="sticky top-0 inset-x-0 z-40 bg-[#f7f9fb]/90 backdrop-blur-xl border-b border-[#e0e3e5]/70">
      <div className="max-w-xl mx-auto h-16 px-4 flex items-center justify-between">
        {/* Left branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#1d4ed8]/10 flex items-center justify-center text-[#0037b0] shadow-xs">
            <span className="material-symbols-outlined text-[20px]">account_balance</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-[#565e74] tracking-wider uppercase leading-none">
              {t.portalHeader}
            </span>
            <h1 className="text-[15px] font-bold text-[#191c1e] leading-tight truncate max-w-[210px]">
              {title}
            </h1>
          </div>
        </div>

        {/* Right utility buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Dedicated English <-> Hindi Language Toggle Feature */}
          <div
            role="group"
            aria-label="Language selection toggle"
            className="flex items-center bg-[#eceef0] p-0.5 rounded-full border border-slate-200/90 shadow-2xs"
          >
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 sm:px-2.5 rounded-full text-[11px] font-bold transition-all duration-150 flex items-center gap-1 ${
                language === 'en'
                  ? 'bg-[#0037b0] text-white shadow-xs scale-102'
                  : 'text-[#565e74] hover:text-[#191c1e]'
              }`}
              title="Switch application language to English"
              aria-pressed={language === 'en'}
            >
              <span>EN</span>
              {language === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>}
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('hi')}
              className={`px-2 py-1 sm:px-2.5 rounded-full text-[11px] font-bold transition-all duration-150 flex items-center gap-1 ${
                language === 'hi'
                  ? 'bg-[#0037b0] text-white shadow-xs scale-102'
                  : 'text-[#565e74] hover:text-[#191c1e]'
              }`}
              title="एप्लिकेशन की भाषा हिंदी में बदलें (Switch to Hindi)"
              aria-pressed={language === 'hi'}
            >
              <span>हिंदी</span>
              {language === 'hi' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>}
            </button>
          </div>

          {/* More Languages Dropdown (Marathi / Tamil / All) */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="w-7 h-7 rounded-full bg-[#eceef0] flex items-center justify-center text-[#565e74] hover:text-[#191c1e] hover:bg-[#e0e3e5] transition-all"
              title="More regional languages / अधिक भाषाएं"
              aria-label="More languages"
            >
              <span className="material-symbols-outlined text-[15px]">translate</span>
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                {(['en', 'hi', 'mr', 'ta'] as Language[]).map(l => (
                  <button
                    key={l}
                    onClick={() => {
                      onLanguageChange(l);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      language === l ? 'text-[#0037b0] font-bold bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{l === 'en' ? 'English' : l === 'hi' ? 'हिंदी' : l === 'mr' ? 'मराठी' : 'தமிழ்'}</span>
                    {language === l && <span className="material-symbols-outlined text-[14px]">check</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Offline indicator toggle */}
          <button
            onClick={onToggleOffline}
            title={isOffline ? 'Offline Mode Active' : 'Online Mode (Click to simulate offline)'}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors ${
              isOffline ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] sm:text-[16px]">
              {isOffline ? 'cloud_off' : 'wifi'}
            </span>
          </button>

          {/* Role Switcher Pill for SIH Demonstration */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="px-2.5 py-1 rounded-full bg-[#dae2fd] text-[#0037b0] font-semibold text-[11px] flex items-center gap-1 hover:bg-[#c4e7ff] transition-all"
              title="Switch Hackathon View Role"
            >
              <span className="capitalize">{role}</span>
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>
            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Select Portal Role
                </div>
                {(['citizen', 'facilitator', 'admin', 'guest'] as UserRole[]).map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      onRoleChange(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      role === r ? 'text-[#0037b0] font-bold bg-blue-50' : 'text-slate-700'
                    }`}
                  >
                    <span>{roleLabels[r]}</span>
                    {role === r && <span className="material-symbols-outlined text-[14px]">check</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification bell */}
          <button
            onClick={onNotificationsClick}
            aria-label="Notifications"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#434655] hover:text-[#191c1e] hover:bg-[#eceef0] transition-colors relative"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#0037b0] rounded-full ring-2 ring-white"></span>
          </button>

          {/* Profile / Avatar */}
          <button
            onClick={onProfileClick}
            aria-label="User Profile"
            className="w-8 h-8 rounded-full bg-[#0037b0] flex items-center justify-center text-white hover:opacity-90 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
