import { NSFDC_SCHEMES } from '../data/schemes';
import { SchemeMatchResult, UserProfile } from '../types';

export function calculateEMI(principal: number, annualRatePct: number, tenureMonths: number): number {
  if (tenureMonths <= 0 || principal <= 0) return 0;
  const monthlyRate = annualRatePct / 100 / 12;
  if (monthlyRate === 0) return principal / tenureMonths;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}

export function recommendSchemes(profile: UserProfile): SchemeMatchResult[] {
  return NSFDC_SCHEMES.map(scheme => {
    let score = 0;
    const qualifyingReasons: string[] = [];
    const missingOrCautionCriteria: string[] = [];

    // 1. Caste verification rule
    if (profile.caste === 'SC') {
      score += 30;
      if (profile.isCasteVerified) {
        qualifyingReasons.push('SC community credential verified via DigiLocker.');
      } else {
        qualifyingReasons.push('SC beneficiary category declared (Physical verification needed).');
      }
    } else {
      missingOrCautionCriteria.push('NSFDC schemes prioritize Scheduled Caste (SC) applicants.');
    }

    // 2. Income eligibility rule
    const maxIncomeLimit = scheme.eligibilityConditions.maxFamilyIncome;
    const isIncomeSatisfied = scheme.eligibilityConditions.noIncomeLimit || profile.annualIncome <= maxIncomeLimit;
    if (isIncomeSatisfied) {
      score += 30;
      if (scheme.eligibilityConditions.noIncomeLimit) {
        qualifyingReasons.push('Free Govt Sponsoring: No family income ceiling requirement.');
      } else {
        const formattedIncome = (profile.annualIncome / 100000).toFixed(2);
        const formattedLimit = (maxIncomeLimit / 100000).toFixed(2);
        qualifyingReasons.push(
          `Income verified under ₹${formattedLimit} Lakh threshold (Current: ₹${formattedIncome} Lakh).`
        );
      }
    } else {
      missingOrCautionCriteria.push(
        `Annual income exceeds the ₹${(maxIncomeLimit / 100000).toFixed(2)} Lakh threshold for this scheme.`
      );
    }

    // 3. Project type & domain alignment rule
    const projectLower = (profile.projectType || '').toLowerCase();
    const matchesDomain = scheme.eligibilityConditions.projectTypes.some(pt =>
      projectLower.includes(pt.toLowerCase()) || pt.toLowerCase().includes(projectLower)
    );

    if (matchesDomain || !profile.projectType) {
      score += 25;
      qualifyingReasons.push(`Project viability matches ${profile.projectType || 'selected sector'} preference.`);
    } else {
      score += 10;
      missingOrCautionCriteria.push(`Project category differs from typical ${scheme.name} portfolio.`);
    }

    // 4. Funding range alignment rule
    const estCost = profile.estimatedCost || 350000;
    if (scheme.maxFunding === 0) {
      // Free scheme like PM-DAKSH
      score += 15;
      qualifyingReasons.push('100% Free Government Sponsored Program with ₹1,500/month stipend.');
    } else if (estCost <= scheme.maxFunding && estCost >= scheme.minFunding) {
      score += 15;
      qualifyingReasons.push(
        `Required capital (₹${(estCost / 100000).toFixed(2)}L) is within scheme ceiling (₹${(scheme.maxFunding / 100000).toFixed(2)}L).`
      );
    } else if (estCost > scheme.maxFunding) {
      missingOrCautionCriteria.push(
        `Requested loan exceeds scheme ceiling of ₹${(scheme.maxFunding / 100000).toFixed(2)} Lakh.`
      );
    } else {
      score += 5;
    }

    // 5. Special Women Empowerment Rule
    let rateApplied: number | null = scheme.interestRate;
    if (scheme.id === 'msynsfdc' || scheme.category === 'women') {
      if (profile.hasFemaleCoApplicant) {
        score += 20;
        qualifyingReasons.push('Women entrepreneur / female co-applicant verified: Priority quota unlocked.');
        if (scheme.womenInterestRate !== null && scheme.womenInterestRate !== undefined) {
          rateApplied = scheme.womenInterestRate;
        }
      } else {
        missingOrCautionCriteria.push('Priority quota reserved for female applicants or Self-Help Groups (SHGs).');
      }
    } else if (profile.hasFemaleCoApplicant && scheme.womenInterestRate !== null && scheme.womenInterestRate !== undefined) {
      rateApplied = scheme.womenInterestRate;
      qualifyingReasons.push(`Concessional interest concession for female participation (${rateApplied}% p.a.).`);
    }

    // 6. Operational & Verification Status
    const isVerifiedActive = scheme.operationalStatus === 'ACTIVE' && !scheme.verifyBeforeUse;
    if (scheme.verifyBeforeUse || scheme.operationalStatus === 'VERIFICATION_REQUIRED') {
      missingOrCautionCriteria.push(
        'Terms subject to verification with nearest State Channelizing Agency or Channel Partner.'
      );
    }

    // Cap score at 99% for realism
    const normalizedScore = isVerifiedActive
      ? Math.min(Math.max(score, 25), 99)
      : Math.min(Math.max(score - 10, 20), 75);

    const isEligible = profile.caste === 'SC' && isIncomeSatisfied;
    const confidence: 'likely' | 'maybe' | 'ineligible' =
      !isEligible
        ? 'ineligible'
        : isVerifiedActive && normalizedScore >= 75
        ? 'likely'
        : 'maybe';

    // Calculate estimated EMI if rate and tenure are verified
    const effectiveLoan = scheme.maxFunding > 0 ? Math.min(estCost, scheme.maxFunding) * (scheme.nsfdcSharePercent / 100) : 0;
    const tenureMonths = (scheme.maxTenureYears || 0) * 12;
    const emi = (effectiveLoan > 0 && tenureMonths > 0 && rateApplied !== null)
      ? calculateEMI(effectiveLoan, rateApplied, tenureMonths)
      : 0;

    return {
      scheme,
      matchScore: normalizedScore,
      isEligible,
      confidence,
      qualifyingReasons,
      missingOrCautionCriteria,
      estimatedEmi: Math.round(emi),
      interestRateApplied: rateApplied
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}
