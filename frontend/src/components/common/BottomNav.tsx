import React from 'react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

export type TabId = 'home' | 'schemes' | 'calculator' | 'locator';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  language
}) => {
  const t = TRANSLATIONS[language];

  const tabs: { id: TabId; label: string; icon: string; activeIcon: string }[] = [
    { id: 'home', label: t.navHome, icon: 'home', activeIcon: 'home' },
    { id: 'schemes', label: t.navSchemes, icon: 'account_balance', activeIcon: 'account_balance' },
    { id: 'calculator', label: t.navCalculator, icon: 'payments', activeIcon: 'payments' },
    { id: 'locator', label: t.navLocator, icon: 'travel_explore', activeIcon: 'travel_explore' }
  ];

  return (
    <nav className="app-bottom-nav" aria-label="Main navigation">
      <div className="flex justify-around items-center h-full px-2 max-w-lg mx-auto">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 touch-target ${
                isActive
                  ? 'bg-[#dae2fd] text-[#0037b0] font-semibold'
                  : 'text-[#565e74] hover:text-[#191c1e]'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${
                  isActive ? 'material-symbols-fill' : ''
                }`}
              >
                {isActive ? tab.activeIcon : tab.icon}
              </span>
              <span className="text-[10px] mt-0.5 leading-tight text-truncate max-w-[4rem] text-center">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
