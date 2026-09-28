import React, { useState } from 'react';
import { Language, UserProfile, SchemeMatchResult } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { recommendSchemes } from '../../services/recommender';

interface SchemeRecommenderProps {
  language: Language;
  profile: UserProfile;
  onOpenProfileFilter: () => void;
  onSelectSchemeForEmi: (schemeId: string) => void;
  onSelectSchemeForLocator: (schemeId: string) => void;
  onAddCoApplicant: () => void;
}

export const SchemeRecommender: React.FC<SchemeRecommenderProps> = ({
  language,
  profile,
  onOpenProfileFilter,
  onSelectSchemeForEmi,
  onSelectSchemeForLocator,
  onAddCoApplicant
}) => {
  const t = TRANSLATIONS[language];
  const [activeCategory, setActiveCategory] = useState<'all' | 'term' | 'micro' | 'women'>('all');
  const [qualifyOpen, setQualifyOpen] = useState(true);
  const [expandedDetailsId, setExpandedDetailsId] = useState<string | null>(null);

  // Compute matches using deterministic rule engine
  const recommendations: SchemeMatchResult[] = recommendSchemes(profile);

  const filteredMatches = recommendations.filter(r => {
    if (activeCategory === 'term') return r.scheme.category === 'term';
    if (activeCategory === 'micro') return r.scheme.category === 'micro';
    if (activeCategory === 'women') return r.scheme.category === 'women';
    return true;
  });

  return (
    <div className="flex flex-col w-full px-5 pb-28 pt-2 gap-4">
      {/* Profile & Match Status Banner (Image 5) */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <h2 className="text-lg font-bold text-[#191c1e]">{t.schemesTitle}</h2>
            <span className="material-symbols-outlined text-[18px] text-[#0037b0] material-symbols-fill">
              verified
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#565e74] font-medium">{profile.name}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="text-[#004a66] font-semibold px-2 py-0.5 rounded-full bg-[#dae2fd]/60">
              {profile.caste} Verified • ₹{(profile.annualIncome / 100000).toFixed(2)}L p.a.
            </span>
          </div>
        </div>

        <button
          onClick={onOpenProfileFilter}
          aria-label="Scheme Filter Settings"
          title="Adjust Profile / Eligibility Criteria"
          className="w-10 h-10 rounded-full bg-[#eceef0] flex items-center justify-center text-[#191c1e] shadow-xs active:scale-95 transition-transform hover:bg-[#e0e3e5]"
        >
          <span className="material-symbols-outlined text-[20px]">tune</span>
        </button>
      </div>

      {/* Filter Pill Carousel (Image 5) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-none">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-[#2d3133] text-white shadow-sm'
              : 'bg-[#eceef0] text-[#565e74] hover:bg-[#e0e3e5]'
          }`}
        >
          {t.allSchemesLabel} ({recommendations.length})
        </button>
        <button
          onClick={() => setActiveCategory('term')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'term'
              ? 'bg-[#2d3133] text-white shadow-sm'
              : 'bg-[#eceef0] text-[#565e74] hover:bg-[#e0e3e5]'
          }`}
        >
          {t.termLoansTab}
        </button>
        <button
          onClick={() => setActiveCategory('micro')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'micro'
              ? 'bg-[#2d3133] text-white shadow-sm'
              : 'bg-[#eceef0] text-[#565e74] hover:bg-[#e0e3e5]'
          }`}
        >
          {t.microFinanceTab}
        </button>
        <button
          onClick={() => setActiveCategory('women')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'women'
              ? 'bg-[#2d3133] text-white shadow-sm'
              : 'bg-[#eceef0] text-[#565e74] hover:bg-[#e0e3e5]'
          }`}
        >
          {t.womenSpecialTab}
        </button>
      </div>

      {/* Render Ranked Schemes */}
      <div className="flex flex-col gap-4">
        {filteredMatches.map((item, index) => {
          const { scheme, matchScore, qualifyingReasons, missingOrCautionCriteria, confidence } = item;
          const isHero = index === 0 && activeCategory === 'all';
          const isDetailsOpen = expandedDetailsId === scheme.id;

          if (isHero) {
            // Hero Card 1: Term Loan Scheme (Exact layout of Image 5)
            return (
              <div
                key={scheme.id}
                className="w-full rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.05)] overflow-hidden flex flex-col border border-slate-100 transition-all"
              >
                {/* Visual Image Header with badges */}
                <div className="relative w-full h-48 bg-[#e6e8ea] overflow-hidden">
                  <img
                    src={scheme.imageUrl}
                    alt={scheme.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-slate-900/60 backdrop-blur-md flex items-center gap-1 shadow-xs border border-white/10">
                      <span className="material-symbols-outlined text-[14px] text-sky-300 material-symbols-fill">
                        bolt
                      </span>
                      <span>{matchScore}% {t.eligibilityMatch}</span>
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#191c1e] shadow-xs">
                      <span className="material-symbols-outlined text-[16px]">bookmark_border</span>
                    </div>
                  </div>

                  {/* Overlaid Title Plaque */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                      {scheme.categoryLabel}
                    </div>
                    <h3 className="text-xl font-bold text-white leading-snug">{scheme.name}</h3>
                  </div>
                </div>

                {/* Body Metrics Bento */}
                <div className="p-4 flex flex-col gap-3.5">
                  <div className="grid grid-cols-3 gap-2 py-1 bg-[#f2f4f6] p-3 rounded-2xl">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[#565e74]">{t.maxFunding}</span>
                      <span className="text-sm font-bold text-[#191c1e] mt-0.5">
                        ₹{(scheme.maxFunding / 100000).toFixed(0)} Lakh
                      </span>
                    </div>
                    <div className="flex flex-col text-center">
                      <span className="text-[11px] text-[#565e74]">{t.interestLabel}</span>
                      <span className="text-sm font-bold text-[#0037b0] mt-0.5">
                        {scheme.interestRate.toFixed(2)}% <span className="text-[10px] font-normal">p.a.</span>
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[11px] text-[#565e74]">{t.nsfdcShare}</span>
                      <span className="text-sm font-bold text-[#191c1e] mt-0.5">
                        {scheme.nsfdcSharePercent}%
                      </span>
                    </div>
                  </div>

                  {/* Collapsible 'Why You Qualify' Checklist (Image 5) */}
                  <div className="rounded-2xl bg-[#f2f4f6]/80 overflow-hidden border border-slate-100">
                    <button
                      onClick={() => setQualifyOpen(!qualifyOpen)}
                      className="w-full px-3 py-2.5 flex items-center justify-between text-left active:bg-slate-200/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#006387] material-symbols-fill">
                          task_alt
                        </span>
                        <span className="text-xs font-bold text-[#191c1e]">
                          {t.whyYouQualify} ({qualifyingReasons.length} {t.eligibilityMatch})
                        </span>
                      </div>
                      <span
                        className={`material-symbols-outlined text-[20px] text-[#565e74] transition-transform duration-200 ${
                          qualifyOpen ? 'rotate-0' : '-rotate-90'
                        }`}
                      >
                        expand_more
                      </span>
                    </button>

                    {qualifyOpen && (
                      <div className="px-3 pb-3 flex flex-col gap-2">
                        {qualifyingReasons.map((reason, idx) => (
                          <div key={idx} className="flex items-start gap-2 pt-0.5">
                            <span className="w-4 h-4 rounded-full bg-[#dae2fd] flex items-center justify-center shrink-0 mt-0.5">
                              <span className="material-symbols-outlined text-[12px] text-[#0037b0] material-symbols-fill">
                                check
                              </span>
                            </span>
                            <span className="text-xs text-[#565e74] leading-relaxed">{reason}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2.5 pt-0.5">
                    <button
                      onClick={() => onSelectSchemeForLocator(scheme.id)}
                      className="flex-1 py-3 px-4 rounded-full bg-[#0f172a] hover:bg-[#1d4ed8] text-white font-semibold text-xs shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>{t.applyNearestBank}</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>

                    <button
                      onClick={() => onSelectSchemeForEmi(scheme.id)}
                      className="py-3 px-4 rounded-full bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] font-semibold text-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">calculate</span>
                      <span>{t.calculateEmi}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          // Card 2 / Secondary Cards (e.g. Micro Credit Finance)
          return (
            <div
              key={scheme.id}
              className="w-full rounded-3xl bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-3.5 border border-slate-100 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#dae2fd] text-[#0037b0] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px] material-symbols-fill">
                        verified
                      </span>
                      <span>{matchScore}% Match</span>
                    </span>
                    {scheme.fastSanctionDays && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#c4e7ff] text-[#001e2c] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                        <span>{scheme.fastSanctionDays}-Day Sanction</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-[#191c1e] mt-1">{scheme.name}</h3>
                  <p className="text-xs text-[#565e74] leading-relaxed">{scheme.description}</p>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-[#eceef0] flex items-center justify-center text-[#0037b0] shrink-0">
                  <span className="material-symbols-outlined text-[22px]">
                    {scheme.category === 'micro'
                      ? 'storefront'
                      : scheme.category === 'education'
                      ? 'school'
                      : 'eco'}
                  </span>
                </div>
              </div>

              {/* Loan Metrics Bar */}
              <div className="grid grid-cols-3 gap-2 bg-[#f2f4f6] p-3 rounded-2xl">
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#565e74]">Limit</span>
                  <span className="text-sm font-bold text-[#191c1e] mt-0.5">
                    ₹{(scheme.maxFunding / 100000).toFixed(2)} Lakh
                  </span>
                </div>
                <div className="flex flex-col text-center">
                  <span className="text-[11px] text-[#565e74]">Interest</span>
                  <span className="text-sm font-bold text-[#0037b0] mt-0.5">
                    {scheme.interestRate.toFixed(2)}% <span className="text-[10px] font-normal">p.a.</span>
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[11px] text-[#565e74]">Margin Money</span>
                  <span className="text-sm font-bold text-[#191c1e] mt-0.5">
                    {scheme.marginPercent === 0 ? 'Nil (0%)' : `${scheme.marginPercent}%`}
                  </span>
                </div>
              </div>

              {/* Expandable Checklist & Documents */}
              {isDetailsOpen && (
                <div className="p-3 bg-[#f7f9fb] rounded-2xl border border-slate-100 flex flex-col gap-2 animate-in fade-in duration-150">
                  <div className="text-xs font-bold text-[#191c1e]">Required Documents Checklist:</div>
                  <ul className="text-xs text-[#565e74] space-y-1">
                    {scheme.requiredDocuments.map((doc, dIdx) => (
                      <li key={dIdx} className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-emerald-600">
                          check_circle
                        </span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 mt-1">
                    <span className="text-[11px] text-[#565e74]">
                      Moratorium: {scheme.moratoriumMonths} Months Buffer
                    </span>
                    <button
                      onClick={() => onSelectSchemeForEmi(scheme.id)}
                      className="text-xs font-bold text-[#0037b0] hover:underline"
                    >
                      Plan EMI Repayment →
                    </button>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="flex gap-2">
                <button
                  onClick={() => setExpandedDetailsId(isDetailsOpen ? null : scheme.id)}
                  className="flex-1 py-2.5 px-4 rounded-full bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] text-xs font-semibold active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                >
                  <span>{isDetailsOpen ? 'Hide Required Documents' : 'View Details & Required Documents'}</span>
                  <span
                    className={`material-symbols-outlined text-[16px] transition-transform ${
                      isDetailsOpen ? 'rotate-90' : ''
                    }`}
                  >
                    chevron_right
                  </span>
                </button>
                <button
                  onClick={() => onSelectSchemeForLocator(scheme.id)}
                  className="py-2.5 px-4 rounded-full bg-[#0f172a] text-white text-xs font-semibold hover:bg-[#1d4ed8] active:scale-[0.98] transition-all flex items-center justify-center gap-1"
                >
                  <span>Find Bank</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Mahila Samriddhi Incentive Card (Image 5) */}
        <div className="w-full rounded-3xl bg-gradient-to-br from-[#dae2fd]/50 via-white to-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-3 border border-blue-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[18px]">loyalty</span>
            </div>
            <span className="text-xs text-[#0037b0] font-bold uppercase tracking-wider">
              Female Co-Applicant Benefit
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-[#191c1e]">Mahila Samriddhi Yojana (MSY)</h3>
            <p className="text-xs text-[#565e74] leading-relaxed">
              Unlock <strong className="text-[#0037b0] font-bold">50% Capital Subsidy (Up to ₹60,000)</strong> with
              interest relief at just 4.00% p.a. by nominating a female family member.
            </p>
          </div>

          <div className="pt-1">
            <button
              onClick={onAddCoApplicant}
              className={`w-full py-3 px-4 rounded-full font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
                profile.hasFemaleCoApplicant
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                  : 'bg-[#0037b0] hover:bg-[#1d4ed8] text-white shadow-[#0037b0]/20'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {profile.hasFemaleCoApplicant ? 'verified' : 'group_add'}
              </span>
              <span>
                {profile.hasFemaleCoApplicant
                  ? 'Co-Applicant Active: 50% Subsidy Unlocked!'
                  : 'Add Co-Applicant & Unlock'}
              </span>
            </button>
          </div>
        </div>

        {/* Helper Assistance Footnote (Image 5) */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f2f4f6] text-[#565e74] border border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#0037b0]">support_agent</span>
            <span className="text-xs font-medium">Need help choosing? Call toll-free 1800-11-0396</span>
          </div>
          <a href="tel:1800110396" className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          </a>
        </div>
      </div>
    </div>
  );
};
