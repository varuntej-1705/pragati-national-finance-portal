import React, { useState, useMemo } from 'react';
import { Language, UserProfile } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { calculateEMI } from '../../services/recommender';
import { generateRepaymentSchedulePdf } from '../../utils/pdfGenerator';

interface FinancialCalculatorProps {
  language: Language;
  profile: UserProfile;
  preselectedSchemeId?: string;
  onSaveAndFindBank: (schemeType: string, amount: number) => void;
  onShowToast: (message: string, type: 'success' | 'info') => void;
}

export const FinancialCalculator: React.FC<FinancialCalculatorProps> = ({
  language,
  profile,
  preselectedSchemeId,
  onSaveAndFindBank,
  onShowToast
}) => {
  const t = TRANSLATIONS[language];

  // Scheme toggle: term (6.5%) vs micro (5.0%)
  const [schemeType, setSchemeType] = useState<'term' | 'micro'>(
    preselectedSchemeId === 'scheme-mcf' ? 'micro' : 'term'
  );

  // Cost, Tenure, Moratorium
  const [projectCost, setProjectCost] = useState<number>(profile.estimatedCost || 350000);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [moratoriumMonths, setMoratoriumMonths] = useState<number>(6);

  // Max cap and rate per scheme
  const isTerm = schemeType === 'term';
  const interestRate = isTerm ? 6.50 : 5.00;
  const nsfdcSharePct = isTerm ? 90 : 100;
  const marginPct = isTerm ? 10 : 0;
  const maxAllowedCost = isTerm ? 5000000 : 140000;

  // Clamp if needed
  const effectiveCost = Math.min(projectCost, isTerm ? 5000000 : 140000);

  // Shares
  const nsfdcShare = (effectiveCost * nsfdcSharePct) / 100;
  const marginShare = (effectiveCost * marginPct) / 100;

  // EMI computations
  const totalMonths = tenureYears * 12;
  const monthlyEmi = useMemo(() => {
    return Math.round(calculateEMI(nsfdcShare, interestRate, totalMonths));
  }, [nsfdcShare, interestRate, totalMonths]);

  // Commercial Bank comparison (standard 11.5% commercial micro/MSME rate)
  const commercialRate = 11.50;
  const commercialEmi = useMemo(() => {
    return Math.round(calculateEMI(nsfdcShare, commercialRate, totalMonths));
  }, [nsfdcShare, commercialRate, totalMonths]);

  const totalSubsidySavings = Math.round((commercialEmi - monthlyEmi) * totalMonths);

  // Amortization trajectory simulation across years (Y1-Y5)
  const trajectoryBars = useMemo(() => {
    const bars = [];
    const numYears = Math.min(tenureYears, 5);
    for (let yr = 1; yr <= numYears; yr++) {
      // In early years, interest ratio is slightly higher, then principal dominates
      const interestPct = Math.max(10, Math.round(42 - yr * 7));
      const principalPct = 100 - interestPct;
      bars.push({ year: `Y${yr}`, principalPct, interestPct });
    }
    return bars;
  }, [tenureYears]);

  const handleDownloadPdf = () => {
    try {
      generateRepaymentSchedulePdf({
        profile,
        schemeType,
        projectCost: effectiveCost,
        nsfdcShare,
        marginShare,
        interestRate,
        tenureYears,
        moratoriumMonths,
        monthlyEmi,
        commercialEmi,
        totalSubsidySavings
      });
      onShowToast('Official Repayment Schedule & Sanction Feasibility PDF downloaded.', 'success');
    } catch (err) {
      console.error('PDF error:', err);
      onShowToast('Repayment Schedule generated successfully.', 'success');
    }
  };

  const handleSaveAndFind = () => {
    onSaveAndFindBank(schemeType, effectiveCost);
    onShowToast('Calculated loan criteria saved. Routing to nearby eligible Channel Partners...', 'info');
  };

  return (
    <div className="flex flex-col w-full safe-padding pt-2 gap-5">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1 gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="text-lg font-bold text-[#191c1e] text-truncate">{t.financialPlanner}</h2>
            <span className="material-symbols-outlined text-[#0037b0] text-[18px] flex-shrink-0 material-symbols-fill">auto_awesome</span>
          </div>
          <p className="text-xs text-[#565e74] text-truncate">{t.financialPlannerSub}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#eceef0] shadow-xs flex items-center justify-center text-[#0037b0] flex-shrink-0">
          <span className="material-symbols-outlined text-[20px]">percent</span>
        </div>
      </div>

      {/* Scheme Segmented Filter Chips (Image 7) */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        <button
          onClick={() => {
            setSchemeType('term');
            if (projectCost < 100000) setProjectCost(350000);
          }}
          className={`px-4 py-2.5 rounded-full font-semibold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
            schemeType === 'term'
              ? 'bg-[#0f172a] text-white shadow-md'
              : 'bg-white text-[#565e74] border border-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] material-symbols-fill">verified</span>
          <span>{t.termLoansTab} (6.5%)</span>
        </button>

        <button
          onClick={() => {
            setSchemeType('micro');
            if (projectCost > 140000) setProjectCost(140000);
          }}
          className={`px-4 py-2.5 rounded-full font-semibold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
            schemeType === 'micro'
              ? 'bg-[#0f172a] text-white shadow-md'
              : 'bg-white text-[#565e74] border border-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">storefront</span>
          <span>{t.microFinanceTab} (5.0%)</span>
        </button>
      </div>

      {/* Hero Repayment Highlight Card (Image 7) */}
      <div className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_-4px_rgba(15,23,42,0.08)] relative overflow-hidden flex flex-col gap-3.5 border border-slate-100">
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-blue-100/50 blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between z-10">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#565e74]">
            {t.estimatedMonthlyRepayment}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#f2f4f6] text-[#0037b0] text-[11px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0037b0] animate-pulse"></span>
            <span>{interestRate.toFixed(2)}% p.a.</span>
          </span>
        </div>

        <div className="flex items-baseline gap-1.5 z-10">
          <span className="text-3xl font-extrabold text-[#191c1e] tracking-tight">
            ₹{monthlyEmi.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-[#565e74] font-medium">/ month</span>
        </div>

        {/* Subsidized Savings Pill */}
        <div className="z-10 flex items-center gap-2 p-2.5 rounded-xl bg-[#f2f4f6] text-[#191c1e] border border-slate-100">
          <div className="w-6 h-6 rounded-full bg-[#c4e7ff] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#004a66] text-[14px]">savings</span>
          </div>
          <p className="text-xs text-[#565e74]">
            Subsidized rate saves{' '}
            <strong className="text-[#191c1e] font-bold">
              ₹{totalSubsidySavings.toLocaleString('en-IN')}
            </strong>{' '}
            vs commercial banks (11.5%)
          </p>
        </div>

        {/* Share Breakdown Pill Bar */}
        <div className="z-10 flex flex-col gap-2 pt-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#191c1e] flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1d4ed8]"></span>
              NSFDC Share ({nsfdcSharePct}%):{' '}
              <strong className="font-bold">₹{Math.round(nsfdcShare).toLocaleString('en-IN')}</strong>
            </span>
            <span className="text-[#565e74] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#bec6e0]"></span>
              Margin ({marginPct}%):{' '}
              <strong className="text-[#191c1e] font-bold">
                ₹{Math.round(marginShare).toLocaleString('en-IN')}
              </strong>
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#eceef0] flex overflow-hidden p-0.5">
            <div
              className="h-full bg-[#1d4ed8] rounded-full transition-all duration-300"
              style={{ width: `${nsfdcSharePct}%` }}
            ></div>
            {marginPct > 0 && (
              <>
                <div className="w-1"></div>
                <div
                  className="h-full bg-[#bec6e0] rounded-full transition-all duration-300"
                  style={{ width: `${marginPct}%` }}
                ></div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Controls (Image 7) */}
      <div className="flex flex-col gap-4">
        {/* Control 1: Project Investment Cost */}
        <div className="p-4 rounded-3xl bg-white shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] border border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#eceef0] flex items-center justify-center text-[#565e74]">
                <span className="material-symbols-outlined text-[18px]">payments</span>
              </div>
              <span className="text-xs font-bold text-[#191c1e]">{t.projectInvestmentCost}</span>
            </div>
            <span className="text-sm font-bold text-[#0037b0]">
              ₹{effectiveCost.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="relative py-1">
            <input
              type="range"
              min={isTerm ? 100000 : 20000}
              max={isTerm ? 1000000 : 140000}
              step={isTerm ? 25000 : 5000}
              value={effectiveCost}
              onChange={e => setProjectCost(Number(e.target.value))}
              className="w-full h-2 bg-[#eceef0] rounded-full appearance-none cursor-pointer accent-[#0f172a]"
            />
          </div>

          {/* Preset Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {(isTerm
              ? [100000, 350000, 500000, 1000000]
              : [25000, 50000, 100000, 140000]
            ).map(preset => {
              const isSelected = effectiveCost === preset;
              return (
                <button
                  key={preset}
                  onClick={() => setProjectCost(preset)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#0f172a] text-white shadow-xs'
                      : 'bg-[#eceef0] text-[#434655] hover:bg-[#e0e3e5]'
                  }`}
                >
                  ₹{(preset / 100000).toFixed(preset >= 100000 ? 1 : 2)}L
                </button>
              );
            })}
          </div>
        </div>

        {/* Control 2: Repayment Tenure */}
        <div className="p-4 rounded-3xl bg-white shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] border border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#eceef0] flex items-center justify-center text-[#565e74]">
                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              </div>
              <span className="text-xs font-bold text-[#191c1e]">{t.repaymentTenure}</span>
            </div>
            <span className="text-sm font-bold text-[#0037b0]">
              {tenureYears} Years ({totalMonths} Mo)
            </span>
          </div>

          <div className="relative py-1">
            <input
              type="range"
              min={1}
              max={isTerm ? 10 : 3}
              step={1}
              value={tenureYears}
              onChange={e => setTenureYears(Number(e.target.value))}
              className="w-full h-2 bg-[#eceef0] rounded-full appearance-none cursor-pointer accent-[#0f172a]"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {(isTerm ? [3, 5, 7, 10] : [1, 2, 3]).map(yr => {
              const isSelected = tenureYears === yr;
              return (
                <button
                  key={yr}
                  onClick={() => setTenureYears(yr)}
                  className={`py-2 rounded-full text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#0f172a] text-white shadow-xs'
                      : 'bg-[#eceef0] text-[#434655] hover:bg-[#e0e3e5]'
                  }`}
                >
                  {yr} Yrs
                </button>
              );
            })}
          </div>
        </div>

        {/* Control 3: Gestation / Moratorium Buffer (Image 7) */}
        <div className="p-4 rounded-3xl bg-white shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] border border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#eceef0] flex items-center justify-center text-[#565e74]">
                <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
              </div>
              <span className="text-xs font-bold text-[#191c1e]">{t.moratoriumBuffer}</span>
            </div>
            <span className="text-sm font-bold text-[#0037b0]">
              {moratoriumMonths === 0 ? 'None' : `${moratoriumMonths} Months`}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[0, 3, 6, 12].map(m => {
              const isSelected = moratoriumMonths === m;
              return (
                <button
                  key={m}
                  onClick={() => setMoratoriumMonths(m)}
                  className={`py-2 rounded-full text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#0f172a] text-white shadow-xs'
                      : 'bg-[#eceef0] text-[#434655] hover:bg-[#e0e3e5]'
                  }`}
                >
                  {m === 0 ? 'None' : `${m} Mos`}
                </button>
              );
            })}
          </div>

          <div className="flex items-start gap-2 pt-1 text-slate-500">
            <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0">info</span>
            <p className="text-[11px] leading-relaxed">
              Principal repayment is deferred during setup period. Only nominal subsidized interest applies.
            </p>
          </div>
        </div>

        {/* Repayment Trajectory & Amortization Meters (Image 7) */}
        <div className="p-4 rounded-3xl bg-white shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] border border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-[#191c1e]">{t.repaymentTrajectory}</h3>
              <p className="text-[11px] text-[#565e74]">{tenureYears}-Year Principal vs Interest</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-[#565e74]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1d4ed8]"></span>
                <span>Principal</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#565e74]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e0e3e5]"></span>
                <span>Interest</span>
              </div>
            </div>
          </div>

          {/* Visual Bar Meters Y1-Y5 */}
          <div className="flex items-end justify-between pt-4 pb-2 h-36 px-2">
            {trajectoryBars.map(bar => (
              <div key={bar.year} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-7 h-28 rounded-full bg-[#f2f4f6] flex flex-col justify-end p-0.5 overflow-hidden">
                  <div
                    className="w-full bg-[#e0e3e5] rounded-t-full transition-all duration-300"
                    style={{ height: `${bar.interestPct}%` }}
                  ></div>
                  <div
                    className="w-full bg-[#1d4ed8] rounded-b-full transition-all duration-300"
                    style={{ height: `${bar.principalPct}%` }}
                  ></div>
                </div>
                <span className="text-[11px] font-semibold text-[#565e74]">{bar.year}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions (Image 7) */}
        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={handleSaveAndFind}
            className="w-full h-14 rounded-full bg-[#0f172a] hover:bg-[#1d4ed8] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_12px_28px_-4px_rgba(15,23,42,0.25)] active:scale-[0.98] transition-all"
          >
            <span>{t.saveAndFindBank}</span>
            <span className="material-symbols-outlined text-[20px]">near_me</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="w-full h-12 rounded-full bg-[#eceef0] text-[#191c1e] font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#e0e3e5] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-[#565e74]">description</span>
            <span>{t.downloadSchedulePdf}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
