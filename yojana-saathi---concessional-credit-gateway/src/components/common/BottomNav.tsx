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

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'home', label: t.navHome, icon: 'home' },
    { id: 'schemes', label: t.navSchemes, icon: 'auto_awesome' },
    { id: 'calculator', label: t.navCalculator, icon: 'calculate' },
    { id: 'locator', label: t.navLocator, icon: 'location_on' }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-white/85 backdrop-blur-xl border-t border-[#e0e3e5]/70 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-xl mx-auto flex justify-around items-center h-20 px-3">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[4.5rem] min-h-[44px] py-1.5 px-3 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-[#dae2fd] text-[#0037b0] font-semibold scale-105'
                  : 'text-[#565e74] hover:text-[#191c1e]'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[24px] ${
                  isActive ? 'material-symbols-fill' : ''
                }`}
              >
                {tab.icon}
              </span>
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
