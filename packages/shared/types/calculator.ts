import { SchemeType } from '../constants/schemes';

export interface CalculatorInput {
  schemeType: SchemeType;
  loanAmount: number;
  tenureYears: number;
  moratoriumMonths: number;
  isWomanBeneficiary?: boolean;
  customInterestRate?: number;
}

export interface RepaymentYearBreakdown {
  year: number;
  principalPaid: number;
  interestPaid: number;
  endingBalance: number;
}

export interface CalculatorResult {
  loanAmount: number;
  appliedInterestRate: number;
  tenureYears: number;
  moratoriumMonths: number;
  monthlyEmiDuringRepayment: number;
  interestDuringMoratorium: number;
  totalInterestPaid: number;
  totalRepaymentAmount: number;
  yearlySchedule: RepaymentYearBreakdown[];
  maxLimitAllowed: number;
  interestSavedComparedToCommercial: number; // Comparison with standard commercial 12-14% loans
}
