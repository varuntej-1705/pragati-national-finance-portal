import React from 'react';
import { Language } from '../../types';

interface LanguageSelectDialogProps {
  isOpen: boolean;
  onSelect: (lang: Language) => void;
  currentLanguage: Language;
}

const LANGUAGES: { code: Language; label: string; nativeLabel: string; flag: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', flag: '🇮🇳' }
];

export const LanguageSelectDialog: React.FC<LanguageSelectDialogProps> = ({
  isOpen,
  onSelect,
  currentLanguage
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Tricolor */}
        <div className="relative bg-gradient-to-br from-[#06183d] via-[#0a2560] to-[#0037b0] px-6 pt-6 pb-8 text-center">
          {/* Tricolor accent */}
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

          {/* Ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />

          {/* Emblem */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/95 p-2 shadow-lg border-2 border-amber-300/50 mb-3 relative z-10">
            <img src="/emblem.png" alt="National Emblem" className="w-full h-full object-contain" />
          </div>

          <h2 className="text-xl font-black text-white tracking-tight font-heading relative z-10">
            Choose Your Language
          </h2>
          <p className="text-xs text-white/70 mt-1 font-medium relative z-10">
            अपनी भाषा चुनें • మీ భాషను ఎంచుకోండి
          </p>
        </div>

        {/* Language Grid */}
        <div className="px-5 py-5">
          <div className="grid grid-cols-2 gap-3">
            {LANGUAGES.map(lang => {
              const isActive = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => onSelect(lang.code)}
                  className={`relative p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-1.5 group active:scale-[0.97] ${isActive
                      ? 'border-[#0037b0] bg-blue-50 shadow-md ring-2 ring-[#0037b0]/20'
                      : 'border-slate-200 bg-white hover:border-[#0037b0]/40 hover:bg-blue-50/50 hover:shadow-sm'
                    }`}
                >
                  {/* Selected checkmark */}
                  {isActive && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#0037b0] flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[14px]">check</span>
                    </div>
                  )}

                  {/* Native label (large) */}
                  <span className={`text-lg font-bold transition-colors ${isActive ? 'text-[#0037b0]' : 'text-slate-800 group-hover:text-[#0037b0]'
                    }`}>
                    {lang.nativeLabel}
                  </span>

                  {/* English label */}
                  <span className={`text-[11px] font-semibold uppercase tracking-wider ${isActive ? 'text-[#0037b0]/70' : 'text-slate-400'
                    }`}>
                    {lang.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <button
            onClick={() => onSelect(currentLanguage)}
            className="w-full py-3.5 rounded-full bg-[#0037b0] hover:bg-[#0a2560] text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            <span>Continue</span>
          </button>
          <p className="text-center text-[10px] text-slate-400 mt-2.5 font-medium">
            You can change the language anytime from settings
          </p>
        </div>
      </div>
    </div>
  );
};
