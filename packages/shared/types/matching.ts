import { MatchConfidence, SchemeType } from '../constants/schemes';
import { Scheme } from './scheme';

export interface MatchingCriteriaInput {
  projectType: string;
  estimatedCost: number;
  annualFamilyIncome: number;
  category: string;
  educationStatus?: string;
  gender?: string;
  state?: string;
  district?: string;
  age?: number;
  schemeTypePreference?: SchemeType;
}

export interface RuleEvaluationDetail {
  ruleField: string;
  passed: boolean;
  expectedValue: any;
  actualValue: any;
  message: string;
}

export interface SchemeMatchResult {
  scheme: Scheme;
  confidence: MatchConfidence;
  matchScore: number; // 0 to 100
  passedRules: RuleEvaluationDetail[];
  unverifiedRules: RuleEvaluationDetail[];
  failedRules: RuleEvaluationDetail[];
  plainLanguageExplanation: string;
  maxEligibleLoanAmount: number;
  concessionalInterestRate: number;
  estimatedMoratoriumMonths: number;
}

export interface MatchResponse {
  totalMatches: number;
  topMatches: SchemeMatchResult[];
  profileSummary: {
    incomeCovered: boolean;
    categoryEligible: boolean;
    estimatedCost: number;
  };
}
