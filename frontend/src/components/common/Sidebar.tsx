import React from 'react';
import { UserRole, Language, UserProfile } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { TabId } from './BottomNav';

interface SidebarProps {
  role: UserRole;
  activeTab: TabId;
  language: Language;
  profile: UserProfile;
  onTabChange: (tab: TabId) => void;
  onRoleChange: (role: UserRole) => void;
  onLogout: () => void;
  onProfileClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  activeTab,
  language,
  profile,
  onTabChange,
  onRoleChange,
  onLogout,
  onProfileClick
}) => {
  const t = TRANSLATIONS[language];

  const citizenNav: { id: TabId; label: string; icon: string }[] = [
    { id: 'home', label: t.navHome, icon: 'home' },
    { id: 'schemes', label: t.navSchemes, icon: 'account_balance' },
    { id: 'calculator', label: t.navCalculator, icon: 'payments' },
    { id: 'locator', label: t.navLocator, icon: 'travel_explore' }
  ];

  const roleLabels: Record<UserRole, { label: string; icon: string; color: string }> = {
    citizen: { label: 'Citizen App', icon: 'person', color: 'bg-blue-500/20' },
    facilitator: { label: 'Facilitator', icon: 'support_agent', color: 'bg-emerald-500/20' },
    admin: { label: 'Admin Portal', icon: 'admin_panel_settings', color: 'bg-purple-500/20' },
    guest: { label: 'Guest Mode', icon: 'visibility', color: 'bg-slate-500/20' }
  };

  return (
    <aside className="app-sidebar">
      {/* Brand */}
      <div className="px-5 mb-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg border border-amber-300/40 flex-shrink-0">
            <img
              src="/emblem.png"
              alt="Government of India Emblem"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold text-white leading-tight text-truncate tracking-wider">
                PRAGATI
              </h1>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933]"></span>
            </div>
            <p className="text-[11px] text-amber-200/90 font-medium leading-tight text-truncate">
              {t.subTagline}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Card - Prominent, Default Photo, No Redirection */}
      <div className="px-4 mb-5">
        <div
          className="w-full p-3.5 rounded-2xl bg-white/12 border border-white/20 shadow-md flex items-center gap-3 select-none"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 p-0.5 border-2 border-amber-300/80 shadow-md flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src="/default-avatar.svg"
              alt="Default Citizen Avatar"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-base font-bold text-white text-truncate tracking-tight">{profile.name}</span>
              <span className="material-symbols-outlined text-amber-300 text-[15px] material-symbols-fill">verified</span>
            </div>
            <span className="text-xs text-white/80 font-medium text-truncate mt-0.5">+91 {profile.phone}</span>
            <span className="text-[10px] text-emerald-300 font-semibold tracking-wider uppercase mt-0.5">
              Verified Citizen
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {(role === 'citizen' || role === 'guest') && (
        <nav className="px-3 flex-1">
          <p className="px-3 mb-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
            Navigation
          </p>
          {citizenNav.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all text-left ${
                  isActive
                    ? 'bg-white/20 text-white font-semibold shadow-sm'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'material-symbols-fill' : ''}`}>
                  {item.icon}
                </span>
                <span className="text-sm text-truncate">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></span>
                )}
              </button>
            );
          })}
        </nav>
      )}

      {/* Admin/Facilitator - simple active state */}
      {(role === 'admin' || role === 'facilitator') && (
        <nav className="px-3 flex-1">
          <p className="px-3 mb-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
            Dashboard
          </p>
          <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/20 text-white font-semibold">
            <span className="material-symbols-outlined text-[20px] material-symbols-fill">
              {role === 'admin' ? 'admin_panel_settings' : 'support_agent'}
            </span>
            <span className="text-sm text-truncate">
              {role === 'admin' ? t.adminTitle : t.facilitatorTitle}
            </span>
          </div>
        </nav>
      )}

      {/* Role Switcher */}
      <div className="px-3 mt-4 border-t border-white/10 pt-4">
        <p className="px-3 mb-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
          Switch Portal
        </p>
        {(['citizen', 'facilitator', 'admin'] as UserRole[]).map(r => {
          const info = roleLabels[r];
          const isActive = role === r;
          return (
            <button
              key={r}
              onClick={() => onRoleChange(r)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl mb-0.5 transition-all text-left ${
                isActive
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-white/60 hover:bg-white/8 hover:text-white/80'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{info.icon}</span>
              <span className="text-xs text-truncate">{info.label}</span>
              {isActive && (
                <span className="material-symbols-outlined text-[14px] ml-auto">check</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <div className="px-3 pb-4 pt-3 mt-auto border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:bg-red-500/15 hover:text-red-300 transition-all text-left"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
