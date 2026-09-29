import React, { useState, useMemo } from 'react';
import { Language, UserProfile } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { NSFDC_SCHEMES } from '../../data/schemes';
import { recommendSchemes } from '../../services/recommender';
import { DocumentWalletModal } from './DocumentWalletModal';

interface SchemeRecommenderProps {
  language: Language;
  profile: UserProfile;
  onOpenProfileFilter: () => void;
  onSelectSchemeForEmi: (schemeId: string) => void;
  onSelectSchemeForLocator: (schemeId: string) => void;
  onAddCoApplicant: () => void;
}

export type CategoryFilterKey = 'small_business' | 'larger_business' | 'education' | 'women_shg';

export const SchemeRecommender: React.FC<SchemeRecommenderProps> = ({
  language,
  profile,
  onOpenProfileFilter,
  onSelectSchemeForEmi,
  onSelectSchemeForLocator,
  onAddCoApplicant
}) => {
  const t = TRANSLATIONS[language];

  // ── Step 1: 4-Card Category Selector State ──
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilterKey>('small_business');

  // ── Category-Relevant Secondary Inputs (Single Screen) ──
  const [projectCost, setProjectCost] = useState<number>(profile.estimatedCost || 125000);
  const [familyIncome, setFamilyIncome] = useState<number>(profile.annualIncome || 240000);
  const [applicantGender, setApplicantGender] = useState<'male' | 'female' | 'other'>(
    profile.hasFemaleCoApplicant ? 'female' : 'male'
  );
  const [courseType, setCourseType] = useState<'professional' | 'vocational'>('professional');
  const [isShgMember, setIsShgMember] = useState<boolean>(true);

  // Expanded "Why You Qualify" drawer state per scheme
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(null);

  // Document Upload modal state
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docModalTargetScheme, setDocModalTargetScheme] = useState<string>('NSFDC Scheme');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Define Category Ceiling Limits for the Nudge Card logic
  const CATEGORY_CEILINGS: Record<CategoryFilterKey, { maxCost: number; label: string; nextCategory: CategoryFilterKey; nextLabel: string }> = {
    small_business: {
      maxCost: 140000,
      label: 'Small Business (₹1.40 Lakh)',
      nextCategory: 'larger_business',
      nextLabel: 'Larger Business / Term Loan (up to ₹45 Lakh)'
    },
    women_shg: {
      maxCost: 500000,
      label: 'Women-Led SHG (₹5.00 Lakh)',
      nextCategory: 'larger_business',
      nextLabel: 'Larger Business / Term Loan (up to ₹45 Lakh)'
    },
    education: {
      maxCost: 3000000,
      label: 'Education Loan (₹30.00 Lakh)',
      nextCategory: 'larger_business',
      nextLabel: 'Commercial Enterprise Scheme'
    },
    larger_business: {
      maxCost: 5000000,
      label: 'Term Loan (₹50.00 Lakh)',
      nextCategory: 'larger_business',
      nextLabel: 'Maximum NSFDC Ceiling'
    }
  };

  // Check if project cost exceeds category ceiling
  const isCeilingExceeded = projectCost > CATEGORY_CEILINGS[selectedCategory].maxCost && selectedCategory !== 'larger_business';

  // ── Step 2: Client-side Filter by Category ──
  const categoryFilteredSchemes = useMemo(() => {
    return NSFDC_SCHEMES.filter(scheme => {
      if (selectedCategory === 'small_business') {
        // Micro-finance schemes & small business under 2 Lakh
        return scheme.category === 'micro' || (scheme.category === 'term' && scheme.maxFunding <= 200000);
      }
      if (selectedCategory === 'larger_business') {
        // Term loan schemes > 2 Lakh + Green Business
        return (scheme.category === 'term' && scheme.maxFunding > 200000) || scheme.category === 'green';
      }
      if (selectedCategory === 'education') {
        // Education & vocational schemes
        return scheme.category === 'education' || scheme.category === 'skill';
      }
      if (selectedCategory === 'women_shg') {
        // Women empowerment & SHG schemes
        return scheme.category === 'women' || scheme.id === 'msynsfdc' || scheme.id === 'swarnimansfdc' || scheme.id === 'maynsfdc';
      }
      return true;
    });
  }, [selectedCategory]);

  // ── Step 3: Run Eligibility Rule Engine against the category-filtered pool ──
  const effectiveProfile: UserProfile = useMemo(() => ({
    ...profile,
    estimatedCost: projectCost,
    annualIncome: familyIncome,
    hasFemaleCoApplicant: applicantGender === 'female' || profile.hasFemaleCoApplicant
  }), [profile, projectCost, familyIncome, applicantGender]);

  const allRecommendations = useMemo(() => recommendSchemes(effectiveProfile), [effectiveProfile]);

  const matchedRankedSchemes = useMemo(() => {
    const categoryIds = new Set(categoryFilteredSchemes.map(s => s.id));
    return allRecommendations.filter(r => categoryIds.has(r.scheme.id));
  }, [allRecommendations, categoryFilteredSchemes]);

  const toggleWhyYouQualify = (schemeId: string) => {
    setExpandedSchemeId(prev => (prev === schemeId ? null : schemeId));
  };

  const handleOpenDocUpload = (schemeName: string) => {
    setDocModalTargetScheme(schemeName);
    setIsDocModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full safe-padding pt-2 gap-5 pb-16">
      {/* Toast banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-white/95 text-slate-800 text-xs font-semibold shadow-xl border border-slate-200/80 backdrop-blur-md flex items-center gap-2.5 animate-in slide-in-from-bottom-2">
          <span className={`material-symbols-outlined text-[18px] ${toastMessage.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
            {toastMessage.type === 'error' ? 'error' : 'check_circle'}
          </span>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* ══ Header & Title ══ */}
      <div className="flex items-center justify-between pt-1 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-white p-1 shadow-xs border border-slate-200 flex items-center justify-center shrink-0">
            <img src="/emblem.png" alt="Emblem" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-extrabold text-[#191c1e] font-heading tracking-tight truncate">
                Scheme Matcher & Recommender
              </h2>
              <span className="w-1.5 h-1.5 rounded-full bg-[#138808]"></span>
            </div>
            <p className="text-xs text-[#565e74] truncate">
              {profile.name} • {profile.caste} Verified • Real-Time Concessional Credit Evaluation
            </p>
          </div>
        </div>

        <button
          onClick={onOpenProfileFilter}
          aria-label="Profile Settings"
          title="Adjust Profile Criteria"
          className="w-9 h-9 rounded-full bg-[#eceef0] flex items-center justify-center text-[#191c1e] shadow-xs active:scale-95 transition-transform hover:bg-[#e0e3e5] shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          STEP 1: 4-CARD CATEGORY SELECTOR (MANDATORY REQUIREMENT)
      ════════════════════════════════════════════════════════════════ */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-[#0037b0] uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">grid_view</span>
            Step 1: Select Your Loan Category
          </label>
          <span className="text-[11px] font-medium text-slate-500">4 NSFDC Core Tracks</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Card 1: Small Business */}
          <div
            onClick={() => {
              setSelectedCategory('small_business');
              if (projectCost > 140000) setProjectCost(125000);
            }}
            className={`p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all flex flex-col justify-between gap-3 ${
              selectedCategory === 'small_business'
                ? 'card-modern-active bg-gradient-subtle-blue shadow-md'
                : 'card-modern hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                selectedCategory === 'small_business' ? 'bg-[#0037b0] text-white' : 'bg-blue-50 text-[#0037b0]'
              }`}>
                <span className="material-symbols-outlined text-[20px]">storefront</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                ≤ ₹1.40L
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#191c1e] font-heading leading-tight">
                Small Business
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                Micro-credit, trade, vending & artisanal activities (MSY, MCF, AMY)
              </p>
            </div>
          </div>

          {/* Card 2: Larger Business */}
          <div
            onClick={() => {
              setSelectedCategory('larger_business');
              if (projectCost < 500000) setProjectCost(1000000);
            }}
            className={`p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all flex flex-col justify-between gap-3 ${
              selectedCategory === 'larger_business'
                ? 'card-modern-active bg-gradient-subtle-emerald shadow-md'
                : 'card-modern hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                selectedCategory === 'larger_business' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700'
              }`}>
                <span className="material-symbols-outlined text-[20px]">factory</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Up to ₹45L
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#191c1e] font-heading leading-tight">
                Larger Business
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                Medium-large commercial ventures & equipment (Suvidha, Utkarsh, Green)
              </p>
            </div>
          </div>

          {/* Card 3: Education Loan */}
          <div
            onClick={() => {
              setSelectedCategory('education');
              if (projectCost < 300000) setProjectCost(600000);
            }}
            className={`p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all flex flex-col justify-between gap-3 ${
              selectedCategory === 'education'
                ? 'card-modern-active bg-gradient-subtle-purple shadow-md'
                : 'card-modern hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                selectedCategory === 'education' ? 'bg-purple-700 text-white' : 'bg-purple-50 text-purple-700'
              }`}>
                <span className="material-symbols-outlined text-[20px]">school</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                Up to ₹30L
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#191c1e] font-heading leading-tight">
                Education Loan
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                Technical, professional degrees & vocational skilling (ELS, VETL)
              </p>
            </div>
          </div>

          {/* Card 4: Women-led Business (SHG) */}
          <div
            onClick={() => {
              setSelectedCategory('women_shg');
              setApplicantGender('female');
              if (projectCost > 200000) setProjectCost(125000);
            }}
            className={`p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all flex flex-col justify-between gap-3 ${
              selectedCategory === 'women_shg'
                ? 'card-modern-active bg-gradient-subtle-amber shadow-md'
                : 'card-modern hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                selectedCategory === 'women_shg' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700'
              }`}>
                <span className="material-symbols-outlined text-[20px]">diversity_1</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                50% Subsidy
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#191c1e] font-heading leading-tight">
                Women-led Business
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                Women SHG priority credit, 4% rate & capital subsidy (MSY, Swarnima)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          STEP 2: CATEGORY-RELEVANT SECONDARY INPUTS (SINGLE SCREEN)
      ════════════════════════════════════════════════════════════════ */}
      <div className="card-modern p-4 sm:p-5 bg-white border border-slate-200/90 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-bold text-[#191c1e] uppercase tracking-wider flex items-center gap-1.5 font-heading">
            <span className="material-symbols-outlined text-[16px] text-[#0037b0]">tune</span>
            Step 2: Category-Specific Parameters
          </span>
          <span className="text-[11px] text-slate-500">Live Eligibility Calibration</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Input 1: Project / Loan Cost */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Project / Required Loan</label>
              <span className="text-xs font-bold text-[#0037b0]">
                ₹{(projectCost / 100000).toFixed(2)} Lakh
              </span>
            </div>
            <input
              type="range"
              min={selectedCategory === 'larger_business' ? 200000 : 25000}
              max={selectedCategory === 'larger_business' ? 5000000 : selectedCategory === 'education' ? 3000000 : 300000}
              step={25000}
              value={projectCost}
              onChange={e => setProjectCost(Number(e.target.value))}
              className="w-full accent-[#0037b0] cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Min: ₹25k</span>
              <span>Ceiling: {CATEGORY_CEILINGS[selectedCategory].label}</span>
            </div>
          </div>

          {/* Input 2: Family Annual Income (with official 5 Lakh limit check) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Annual Family Income</label>
              <span className={`text-xs font-bold ${familyIncome <= 500000 ? 'text-emerald-700' : 'text-rose-600'}`}>
                ₹{(familyIncome / 100000).toFixed(2)} L {familyIncome <= 500000 ? '✓ SC Compliant' : '⚠ Exceeds Limit'}
              </span>
            </div>
            <input
              type="range"
              min={50000}
              max={800000}
              step={25000}
              value={familyIncome}
              onChange={e => setFamilyIncome(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>₹50,000</span>
              <span className="font-bold text-emerald-700">Official Limit: ≤ ₹5.00 Lakh</span>
              <span>₹8,00,000</span>
            </div>
          </div>

          {/* Input 3: Gender / Co-Applicant */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Applicant / Beneficiary Gender</label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setApplicantGender('female')}
                className={`py-1.5 rounded-lg transition-all ${
                  applicantGender === 'female' ? 'bg-white text-[#0037b0] shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                Female (Special Concession)
              </button>
              <button
                type="button"
                onClick={() => setApplicantGender('male')}
                className={`py-1.5 rounded-lg transition-all ${
                  applicantGender === 'male' ? 'bg-white text-[#0037b0] shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setApplicantGender('other')}
                className={`py-1.5 rounded-lg transition-all ${
                  applicantGender === 'other' ? 'bg-white text-[#0037b0] shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                Other
              </button>
            </div>
            <span className="text-[10px] text-slate-400">
              {applicantGender === 'female' ? '★ 0.5%–1.0% interest rate rebate applied' : 'Standard concessional rate applied'}
            </span>
          </div>
        </div>

        {/* Dynamic Category Specific Question */}
        {selectedCategory === 'education' && (
          <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-purple-900">Enrolled Course Category:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCourseType('professional')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  courseType === 'professional' ? 'bg-purple-700 text-white' : 'bg-white text-purple-700 border border-purple-200'
                }`}
              >
                B.Tech / MBBS / MBA (ELS)
              </button>
              <button
                onClick={() => setCourseType('vocational')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  courseType === 'vocational' ? 'bg-purple-700 text-white' : 'bg-white text-purple-700 border border-purple-200'
                }`}
              >
                ITI / Polytechnic (VETL)
              </button>
            </div>
          </div>
        )}

        {selectedCategory === 'women_shg' && (
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-amber-900">Self-Help Group (SHG) Affiliation:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsShgMember(true)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  isShgMember ? 'bg-amber-600 text-white' : 'bg-white text-amber-700 border border-amber-200'
                }`}
              >
                SHG Member (MSY 50% Subsidy)
              </button>
              <button
                onClick={() => setIsShgMember(false)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  !isShgMember ? 'bg-amber-600 text-white' : 'bg-white text-amber-700 border border-amber-200'
                }`}
              >
                Individual Woman Entrepreneur
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          CEILING NUDGE CARD (MANDATORY REQUIREMENT)
          If user's project cost exceeds category ceiling, show nudge
          suggesting the next category up rather than "no match".
      ════════════════════════════════════════════════════════════════ */}
      {isCeilingExceeded && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 border border-amber-300 text-slate-800 shadow-sm flex items-start sm:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Project Cost (₹{(projectCost / 100000).toFixed(2)}L) Exceeds {CATEGORY_CEILINGS[selectedCategory].label}
              </h4>
              <p className="text-xs text-slate-700 mt-0.5">
                Looking for higher financing? Switch to <strong>{CATEGORY_CEILINGS[selectedCategory].nextLabel}</strong> for loans up to ₹45.00 Lakh.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedCategory(CATEGORY_CEILINGS[selectedCategory].nextCategory);
              showToast('Switched to Larger Business category.', 'info');
            }}
            className="px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold whitespace-nowrap shadow-sm active:scale-95 transition-all shrink-0"
          >
            Switch to Larger Business →
          </button>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          STEP 3: MATCHING & DISPLAY (RANKED CARDS)
      ════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-[#191c1e] font-heading uppercase tracking-wider">
              Passing Schemes for {selectedCategory.replace('_', ' ').toUpperCase()} ({matchedRankedSchemes.length} Available)
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Ranked by Eligibility Score
            </span>
          </div>
          <span className="text-xs text-slate-500">Official NSFDC Rate Table</span>
        </div>

        {/* Scheme Cards List */}
        <div className="flex flex-col gap-4">
          {matchedRankedSchemes.map((matchItem, idx) => {
            const { scheme, matchScore, confidence, qualifyingReasons, missingOrCautionCriteria, estimatedEmi } = matchItem;
            const isExpanded = expandedSchemeId === scheme.id;
            const isLikely = confidence === 'likely';
            const isUnverified = scheme.verifyBeforeUse || scheme.interestRate === null;

            // Top 2 reasons shown always visible
            const visibleReasons = qualifyingReasons.slice(0, 2);
            const remainingReasons = qualifyingReasons.slice(2);

            return (
              <div
                key={scheme.id}
                className="card-modern overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {/* Visual Top Bar */}
                <div className="p-4 sm:p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Image Thumbnail */}
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <img
                          src={scheme.imageUrl}
                          alt={scheme.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-[#0037b0] uppercase tracking-wider">
                            {scheme.categoryLabel}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {scheme.code}
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-extrabold text-[#191c1e] font-heading leading-snug">
                          {scheme.name}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                          {scheme.description}
                        </p>
                      </div>
                    </div>

                    {/* Color-coded Confidence Badge */}
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs ${
                          isLikely
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300/80'
                            : 'bg-amber-100 text-amber-900 border border-amber-300/80'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isLikely ? 'bg-emerald-600' : 'bg-amber-600'
                          }`}
                        ></span>
                        {isLikely ? 'Likely eligible' : 'Maybe eligible'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {matchScore}% Match Score
                      </span>
                    </div>
                  </div>

                  {/* ── Match Score Progress Bar ── */}
                  <div className="flex items-center gap-2.5">
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          matchScore >= 75 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                          matchScore >= 50 ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                          'bg-gradient-to-r from-rose-500 to-rose-400'
                        }`}
                        style={{ width: `${matchScore}%` }}
                      />
                    </div>
                    <span className={`text-xs font-extrabold min-w-[3rem] text-right ${
                      matchScore >= 75 ? 'text-emerald-700' :
                      matchScore >= 50 ? 'text-amber-700' :
                      'text-rose-700'
                    }`}>
                      {matchScore}%
                    </span>
                  </div>

                  {/* ── Always-Visible: Why This Matches You ── */}
                  <div className={`p-3 rounded-2xl border text-xs flex flex-col gap-2 ${
                    isLikely
                      ? 'bg-emerald-50/70 border-emerald-200/80'
                      : 'bg-amber-50/70 border-amber-200/80'
                  }`}>
                    <div className="flex items-center gap-1.5">
                      <span className={`material-symbols-outlined text-[16px] ${
                        isLikely ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        {isLikely ? 'verified' : 'info'}
                      </span>
                      <span className={`font-bold uppercase tracking-wider text-[10px] ${
                        isLikely ? 'text-emerald-800' : 'text-amber-800'
                      }`}>
                        Why This Scheme Matches You
                      </span>
                    </div>
                    <ul className="flex flex-col gap-1.5 pl-0.5">
                      {visibleReasons.map((reason, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2 text-slate-700">
                          <span className="material-symbols-outlined text-[14px] text-emerald-600 shrink-0 mt-0.5">
                            check_circle
                          </span>
                          <span className="leading-snug">{reason}</span>
                        </li>
                      ))}
                    </ul>
                    {(remainingReasons.length > 0 || missingOrCautionCriteria.length > 0) && (
                      <span className="text-[10px] text-slate-500 font-medium">
                        +{remainingReasons.length + missingOrCautionCriteria.length} more factors • Tap below for full breakdown
                      </span>
                    )}
                  </div>

                  {/* ── Key Parameters Grid (With Fallback for Null Rates/Terms) ── */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-[#f7f9fb] border border-slate-200/80 text-xs">
                    {/* Max Loan */}
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-medium">Max Loan / Ceiling</span>
                      <span className="text-sm font-extrabold text-[#191c1e]">
                        ₹{(scheme.maxFunding / 100000).toFixed(2)} Lakh
                      </span>
                    </div>

                    {/* Interest Rate */}
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-medium">Interest Rate</span>
                      {scheme.interestRate !== null ? (
                        <span className="text-sm font-extrabold text-emerald-700">
                          {scheme.womenInterestRate && applicantGender === 'female'
                            ? `${scheme.womenInterestRate}% p.a. (Women)`
                            : `${scheme.interestRate}% p.a.`}
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-700 leading-tight">
                          Contact your nearest Channel Partner for current terms
                        </span>
                      )}
                    </div>

                    {/* Tenure & Moratorium */}
                    <div className="flex flex-col col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-500 font-medium">Repayment & Moratorium</span>
                      {scheme.maxTenureYears !== null ? (
                        <span className="text-xs font-bold text-[#191c1e]">
                          {scheme.maxTenureYears} Years ({scheme.moratoriumMonths || 0} mo moratorium)
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-700 leading-tight">
                          Contact your nearest Channel Partner for current terms
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Estimated EMI or Capital Subsidy highlight */}
                  {scheme.subsidyPercentage ? (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                        <span className="material-symbols-outlined text-[16px] text-amber-600">savings</span>
                        <span>50% Direct Capital Subsidy Active</span>
                      </div>
                      <span className="font-extrabold text-amber-900">
                        Save up to ₹{(scheme.maxSubsidyAmount || 60000).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ) : estimatedEmi > 0 ? (
                    <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">
                        Estimated Repayment for ₹{(Math.min(projectCost, scheme.maxFunding) / 100000).toFixed(2)}L loan:
                      </span>
                      <span className="font-extrabold text-[#0037b0]">
                        ₹{estimatedEmi.toLocaleString('en-IN')} / month
                      </span>
                    </div>
                  ) : null}

                  {/* ── Expandable Full Match Breakdown ── */}
                  <div className="border-t border-slate-100 pt-2">
                    <button
                      onClick={() => toggleWhyYouQualify(scheme.id)}
                      className="w-full flex items-center justify-between text-xs font-bold text-[#0037b0] py-1 hover:text-[#0a2560] transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">analytics</span>
                        {isExpanded ? 'Hide Full Match Breakdown' : 'View Full Match Breakdown'}
                      </span>
                      <span className="material-symbols-outlined text-[16px]">
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs flex flex-col gap-3">
                        {/* Qualifying Factors */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">check_circle</span>
                            Qualifying Factors ({qualifyingReasons.length} Passed)
                          </span>
                          <ul className="flex flex-col gap-1.5 pl-1">
                            {qualifyingReasons.map((reason, rIdx) => (
                              <li key={rIdx} className="flex items-start gap-2 text-slate-700">
                                <span className="material-symbols-outlined text-[15px] text-emerald-600 shrink-0 mt-0.5">
                                  check_circle
                                </span>
                                <span>{reason}</span>
                              </li>
                            ))}
                            <li className="flex items-start gap-2 text-slate-700">
                              <span className="material-symbols-outlined text-[15px] text-emerald-600 shrink-0 mt-0.5">
                                verified
                              </span>
                              <span>Target group: {scheme.targetGroupDescription || scheme.eligibilityConditions.targetGroup}</span>
                            </li>
                          </ul>
                        </div>

                        {/* Caution / Missing Criteria */}
                        {missingOrCautionCriteria.length > 0 && (
                          <div className="flex flex-col gap-2 pt-2 border-t border-slate-200/60">
                            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">warning</span>
                              Points to Note ({missingOrCautionCriteria.length})
                            </span>
                            <ul className="flex flex-col gap-1.5 pl-1">
                              {missingOrCautionCriteria.map((caution, cIdx) => (
                                <li key={cIdx} className="flex items-start gap-2 text-slate-600">
                                  <span className="material-symbols-outlined text-[15px] text-amber-500 shrink-0 mt-0.5">
                                    info
                                  </span>
                                  <span>{caution}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* How Match Score Is Calculated */}
                        <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200/60">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">calculate</span>
                            How Match Score Is Calculated
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <div className="p-2 rounded-xl bg-white border border-slate-200 text-center">
                              <span className="text-[10px] text-slate-500 block">Caste</span>
                              <span className="text-xs font-bold text-emerald-700">30 pts</span>
                            </div>
                            <div className="p-2 rounded-xl bg-white border border-slate-200 text-center">
                              <span className="text-[10px] text-slate-500 block">Income</span>
                              <span className="text-xs font-bold text-emerald-700">30 pts</span>
                            </div>
                            <div className="p-2 rounded-xl bg-white border border-slate-200 text-center">
                              <span className="text-[10px] text-slate-500 block">Project Fit</span>
                              <span className="text-xs font-bold text-emerald-700">25 pts</span>
                            </div>
                            <div className="p-2 rounded-xl bg-white border border-slate-200 text-center">
                              <span className="text-[10px] text-slate-500 block">Funding Range</span>
                              <span className="text-xs font-bold text-emerald-700">15 pts</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">
                            Your profile is evaluated across 4 eligibility dimensions. Women applicants receive up to 20 bonus points. 
                            Schemes requiring verification are capped at 75% score until confirmed by a Channel Partner.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── Action Buttons ── */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
                    {/* Primary Button: Document Upload & Apply */}
                    <button
                      onClick={() => handleOpenDocUpload(scheme.name)}
                      className="flex-1 py-2.5 px-4 rounded-full bg-[#0037b0] hover:bg-[#0a2560] text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">upload_file</span>
                      <span>Upload Documents & Apply</span>
                    </button>

                    {/* Secondary: Financial Calculator */}
                    <button
                      onClick={() => onSelectSchemeForEmi(scheme.id)}
                      className="py-2.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold active:scale-95 transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">calculate</span>
                      <span>EMI</span>
                    </button>

                    {/* Secondary: Bank Locator */}
                    <button
                      onClick={() => onSelectSchemeForLocator(scheme.id)}
                      className="py-2.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold active:scale-95 transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">near_me</span>
                      <span>Partner Banks</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          DOCUMENT VERIFICATION PIPELINE MODAL
          Both options visible: Option A (Manual + OCR) & Option B (DigiLocker)
      ════════════════════════════════════════════════════════════════ */}
      <DocumentWalletModal
        profile={profile}
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        onShowToast={showToast}
        targetSchemeName={docModalTargetScheme}
      />
    </div>
  );
};
