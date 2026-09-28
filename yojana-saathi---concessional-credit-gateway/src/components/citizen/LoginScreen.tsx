import React, { useState } from 'react';
import { Language, UserRole } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';

interface LoginScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLoginSuccess: (role: UserRole, phone: string) => void;
  onContinueAsGuest: () => void;
  onOpenAssistance: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  language,
  onLanguageChange,
  onLoginSuccess,
  onContinueAsGuest,
  onOpenAssistance
}) => {
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['1', '2', '3', '4']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const t = TRANSLATIONS[language];

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(val);
    setErrorMsg('');
  };

  const handleSendOtp = () => {
    if (mobileNumber.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Aadhaar-linked mobile number.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOtpSent(true);
      setErrorMsg('');
    }, 600);
  };

  const handleOtpChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = clean;
    setOtp(newOtp);

    // Auto focus next input
    if (clean && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const code = otp.join('');
    if (code.length < 4) {
      setErrorMsg('Please enter the 4-digit verification code.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Demo accounts check: if number ends in 00 -> admin, 11 -> facilitator, else citizen
      let assignedRole: UserRole = 'citizen';
      if (mobileNumber.endsWith('00')) assignedRole = 'admin';
      else if (mobileNumber.endsWith('11')) assignedRole = 'facilitator';
      
      onLoginSuccess(assignedRole, mobileNumber);
    }, 500);
  };

  return (
    <div className="flex flex-col w-full relative min-h-screen bg-[#f7f9fb] pb-10">
      {/* Top Atmospheric Gradient Banner */}
      <div className="relative w-full bg-gradient-to-b from-[#0a2560] via-[#0037b0] to-[#1d4ed8] px-5 pt-8 pb-12 flex flex-col justify-between items-center rounded-b-[2.5rem] shadow-xl overflow-hidden">
        {/* Glow elements */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-blue-300/10 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -left-20 w-64 h-64 rounded-full bg-sky-400/10 blur-3xl pointer-events-none"></div>

        {/* Brand Emblem */}
        <div className="flex flex-col items-center text-center z-10 w-full mt-2">
          <div className="relative mb-4 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20">
              <span className="material-symbols-outlined text-white text-[34px]">hub</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[#0037b0] text-[15px] material-symbols-fill">
                verified
              </span>
            </div>
          </div>

          {/* App Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2 drop-shadow-sm">
            {t.appName}
            <span className="material-symbols-outlined text-white/80 text-[22px]">public</span>
          </h1>
          <p className="text-[14px] text-[#cad3ff] max-w-[270px] mt-2 font-normal leading-relaxed text-center">
            {t.tagline}
          </p>
          <p className="text-[11px] text-[#cad3ff]/80 tracking-wider uppercase mt-1">
            {t.subTagline}
          </p>

          {/* Language Selector Carousel */}
          <div className="mt-6 flex flex-col items-center w-full">
            <span className="text-[11px] font-medium text-white/70 mb-2 tracking-wide">
              {t.chooseLang}
            </span>
            <div className="flex items-center gap-2 overflow-x-auto max-w-full px-2 py-1 no-scrollbar">
              {(
                [
                  { code: 'en', label: 'English' },
                  { code: 'hi', label: 'हिंदी' },
                  { code: 'mr', label: 'मराठी' },
                  { code: 'ta', label: 'தமிழ்' }
                ] as { code: Language; label: string }[]
              ).map(item => {
                const isActive = language === item.code;
                return (
                  <button
                    key={item.code}
                    onClick={() => onLanguageChange(item.code)}
                    type="button"
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-white text-[#191c1e] shadow-md scale-105'
                        : 'bg-white/15 backdrop-blur-md text-white hover:bg-white/25'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="material-symbols-outlined text-[13px]">check</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="w-full flex items-center justify-center gap-4 sm:gap-6 z-10 my-4 text-white/90 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-[#c4e7ff]">percent</span>
            <span>4%–6% Int.</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/40"></div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-[#c4e7ff]">bolt</span>
            <span>Instant Sanction</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/40"></div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-[#c4e7ff]">security</span>
            <span>Direct DBT</span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Card */}
      <div className="max-w-md w-full mx-auto px-4 -mt-8 relative z-20 flex flex-col">
        <div className="w-full bg-white rounded-3xl shadow-xl p-6 border border-slate-100 flex flex-col">
          {/* Drag pill line */}
          <div className="w-10 h-1 rounded-full bg-[#e0e3e5] mx-auto mb-4"></div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#191c1e]">{t.quickAccess}</h2>
              <p className="text-xs text-[#565e74]">{t.signInSub}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#0037b0]">
              <span className="material-symbols-outlined text-[20px]">phone_iphone</span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-3 p-2.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {!otpSent ? (
            <>
              {/* Mobile Input */}
              <div className="relative flex items-center bg-[#f2f4f6] rounded-2xl p-2 mb-3.5 focus-within:bg-[#eceef0] transition-colors border border-transparent focus-within:border-[#0037b0]/20">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl shadow-xs text-[#191c1e] font-semibold text-xs shrink-0">
                  <span className="w-4 h-3 rounded-xs flex flex-col overflow-hidden shadow-xs">
                    <span className="h-1 bg-amber-500 w-full"></span>
                    <span className="h-1 bg-white w-full flex items-center justify-center">
                      <span className="w-1 h-1 rounded-full bg-[#0037b0] inline-block"></span>
                    </span>
                    <span className="h-1 bg-green-600 w-full"></span>
                  </span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  id="mobile-input"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={handleMobileChange}
                  placeholder="Enter 10-digit number"
                  className="w-full bg-transparent px-3 py-1 text-[#191c1e] text-sm placeholder:text-slate-400 focus:outline-none tracking-wider font-medium"
                />
                <button
                  type="button"
                  onClick={() => setMobileNumber('9876543210')}
                  title="Demo Number"
                  className="p-1.5 text-slate-400 hover:text-slate-700 mr-1"
                >
                  <span className="material-symbols-outlined text-[18px]">dialpad</span>
                </button>
              </div>

              {/* Send OTP CTA */}
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-full bg-[#0f172a] hover:bg-[#1d4ed8] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all group"
              >
                {isSubmitting ? (
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                ) : (
                  <>
                    <span>{t.sendOtp}</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="flex flex-col animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#565e74]">
                  Code sent to <span className="font-semibold text-slate-800">+91 {mobileNumber}</span>
                </span>
                <button
                  onClick={() => setOtpSent(false)}
                  className="text-xs text-[#0037b0] font-semibold hover:underline"
                >
                  Edit
                </button>
              </div>

              {/* Large Tappable OTP boxes */}
              <div className="flex items-center justify-center gap-3 my-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-2xl bg-[#f2f4f6] text-[#191c1e] border-2 border-transparent focus:border-[#0037b0] focus:bg-white focus:outline-none shadow-xs transition-all"
                  />
                ))}
              </div>
              <p className="text-[11px] text-center text-slate-400 mb-3">
                Default Demo OTP: <strong className="text-slate-600">1234</strong>
              </p>

              {/* Verify OTP CTA */}
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-full bg-[#1d4ed8] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all hover:bg-[#0037b0]"
              >
                {isSubmitting ? (
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                ) : (
                  <>
                    <span>{t.otpVerified}</span>
                    <span className="material-symbols-outlined text-[18px]">login</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Secondary Quick Links */}
          <div className="mt-4 flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="text-xs font-semibold text-[#0037b0] hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>{t.continueGuest}</span>
            </button>
            <button
              type="button"
              onClick={onOpenAssistance}
              className="text-xs font-medium text-[#565e74] hover:text-[#191c1e] flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">help_outline</span>
              <span>{t.assistance}</span>
            </button>
          </div>
        </div>

        {/* Demo Fast Role Selectors for Judges */}
        <div className="mt-4 p-3 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/60 flex flex-col gap-1.5 shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
            <span>Fast Role Switcher (For Judges)</span>
            <span className="text-[#0037b0]">Single Unified Login</span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => onLoginSuccess('citizen', '9876543210')}
              className="px-2.5 py-1.5 rounded-xl bg-blue-50 text-[#0037b0] text-[11px] font-bold hover:bg-blue-100 transition-colors text-center"
            >
              Citizen App
            </button>
            <button
              onClick={() => onLoginSuccess('facilitator', '9876543211')}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-[11px] font-bold hover:bg-emerald-100 transition-colors text-center"
            >
              Facilitator
            </button>
            <button
              onClick={() => onLoginSuccess('admin', '9876543200')}
              className="px-2.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-[11px] font-bold hover:bg-purple-100 transition-colors text-center"
            >
              Admin Portal
            </button>
          </div>
        </div>

        {/* Official Trust Seal Bar */}
        <div className="mt-5 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6e8ea]/60 backdrop-blur-sm text-[#434655] text-[11px] font-semibold">
            <span className="material-symbols-outlined text-[15px] text-[#004a66] material-symbols-fill">
              account_balance
            </span>
            <span>MoSJ&E • Govt. of India • 100% Paperless</span>
          </div>
          <p className="text-[11px] text-[#565e74] mt-1.5 leading-tight">
            NBCFDC • NSFDC • NSKFDC Unified Concessional Credit Gateway
          </p>
        </div>
      </div>
    </div>
  );
};
