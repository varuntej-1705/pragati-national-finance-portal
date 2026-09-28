import { SchemeType } from '../constants/schemes';

export interface EligibilityRuleItem {
  id: string;
  schemeId: string;
  fieldName: string;
  operator: '<=' | '>=' | '==' | '!=' | 'IN' | 'CONTAINS';
  ruleValue: string | number | boolean | string[];
  isMandatory: boolean;
  description?: string;
}

export interface Scheme {
  id: string;
  code: string;
  name: string;
  ministry: string;
  implementingAgency: string;
  schemeType: SchemeType;
  maxLoanAmount: number;
  maxCoveragePercent: number; // e.g. 90%
  interestRateMin: number;
  interestRateMax: number;
  womenRebatePercent?: number; // e.g. 0.5% or 1% rebate
  moratoriumMonthsMin: number;
  moratoriumMonthsMax: number;
  maxRepaymentYears: number;
  incomeCeiling: number; // ₹5,00,000 for NSFDC
  targetAudience: string;
  briefDescription: string;
  detailedBenefits: string[];
  requiredDocuments: string[];
  applicationProcedure: string[];
  officialPortalUrl: string;
  rules?: EligibilityRuleItem[];
  isActive: boolean;
  lastSyncedAt?: string;
}
