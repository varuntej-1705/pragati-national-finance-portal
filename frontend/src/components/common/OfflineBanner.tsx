import React from 'react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface OfflineBannerProps {
  isOffline: boolean;
  onRetry: () => void;
  language: Language;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOffline, onRetry, language }) => {
  if (!isOffline) return null;
  const t = TRANSLATIONS[language];

  return (
    <div className="bg-amber-600 text-white px-4 py-2 text-xs flex items-center justify-between sticky top-16 z-30 shadow-md animate-in slide-in-from-top duration-200">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px]">wifi_off</span>
        <div>
          <span className="font-bold">{t.offlineBanner}</span>
          <span className="hidden sm:inline ml-1 text-amber-100"> — {t.offlineBannerSub}</span>
        </div>
      </div>
      <button
        onClick={onRetry}
        className="px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white font-medium text-[11px] flex items-center gap-1 transition-all"
      >
        <span className="material-symbols-outlined text-[13px]">refresh</span>
        <span>{t.retry}</span>
      </button>
    </div>
  );
};
