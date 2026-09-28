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
    if (profile.annualIncome <= maxIncomeLimit) {
      score += 30;
      const formattedIncome = (profile.annualIncome / 100000).toFixed(2);
      const formattedLimit = (maxIncomeLimit / 100000).toFixed(2);
      qualifyingReasons.push(
        `Income verified under ₹${formattedLimit} Lakh threshold (Current: ₹${formattedIncome} Lakh).`
      );
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
    if (estCost <= scheme.maxFunding && estCost >= scheme.minFunding) {
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

    // 5. Special Women Empowerment Rule (Mahila Samriddhi Yojana)
    let rateApplied = scheme.interestRate;
    if (scheme.id === 'scheme-msy') {
      if (profile.hasFemaleCoApplicant) {
        score += 20;
        qualifyingReasons.push('Female applicant/co-applicant nominated: Unlocks 50% Capital Subsidy up to ₹60,000!');
        rateApplied = scheme.womenInterestRate || 4.0;
      } else {
        missingOrCautionCriteria.push('Requires female primary applicant or co-applicant to unlock capital subsidy.');
      }
    } else if (profile.hasFemaleCoApplicant && scheme.womenInterestRate) {
      rateApplied = scheme.womenInterestRate;
      qualifyingReasons.push(`Concessional interest concession for female participation (${rateApplied}% p.a.).`);
    }

    // Cap score at 99% for realism
    const normalizedScore = Math.min(Math.max(score, 20), 99);
    const isEligible = profile.caste === 'SC' && profile.annualIncome <= maxIncomeLimit;
    const confidence: 'likely' | 'maybe' | 'ineligible' =
      normalizedScore >= 80 ? 'likely' : normalizedScore >= 50 ? 'maybe' : 'ineligible';

    // Calculate estimated EMI for default tenure
    const effectiveLoan = estCost * (scheme.nsfdcSharePercent / 100);
    const tenureMonths = scheme.maxTenureYears * 12;
    const emi = calculateEMI(effectiveLoan, rateApplied, tenureMonths);

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
