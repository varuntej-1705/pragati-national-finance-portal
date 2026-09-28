export type Language = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'kn';

export type UserRole = 'citizen' | 'facilitator' | 'admin' | 'guest';

export type SchemeCategory = 'all' | 'term' | 'micro' | 'women' | 'education' | 'green' | 'skill';

export interface Scheme {
  id: string;
  code: string;
  name: string;
  category: 'term' | 'micro' | 'women' | 'education' | 'green' | 'skill';
  categoryLabel: string;
  description: string;
  operationalStatus: 'ACTIVE' | 'VERIFICATION_REQUIRED' | 'HISTORICAL' | 'STATE_SPECIFIC';
  verificationDate: string;
  officialSource: string;
  officialPortalUrl: string;
  maxFunding: number; // in INR
  minFunding: number;
  projectCostCeilingInr?: number; // Maximum admissible project cost ceiling
  interestRate: number | null; // e.g., 6.5 or null if negotiable/wholesale
  womenInterestRate?: number | null; // e.g., 4.0 or null
  interestRateMen?: number | null;
  verifyBeforeUse?: boolean;
  targetGroupDescription?: string;
  nsfdcSharePercent: number; // e.g. 90
  marginPercent: number; // e.g. 10
  maxTenureYears: number | null;
  moratoriumMonths: number | null;
  subsidyPercentage?: number;
  maxSubsidyAmount?: number;
  stipendMonthly?: number;
  eligibilityConditions: {
    maxFamilyIncome: number; // 500000 per Jan 7 2026 NSFDC FAQ
    targetGroup: string;
    minAge: number;
    maxAge?: number;
    projectTypes: string[];
    requiresFemaleCoApplicant?: boolean;
    noIncomeLimit?: boolean;
  };
  requiredDocuments: string[];
  imageUrl: string;
  imageSourceUrl: string;
  fastSanctionDays?: number;
}

export type ChannelType = 'sca' | 'rrb' | 'psb' | 'coop' | 'mfi';

export interface ChannelPartner {
  id: string;
  name: string;
  type: ChannelType;
  typeLabel: string;
  branchName: string;
  address: string;
  district: string;
  pinCode: string;
  distanceKm: number;
  quotaAvailableCrores: number;
  npaPercentage: number;
  turnaroundDays: number;
  status: 'active' | 'paused' | 'safeguard_reroute';
  reroutePartnerName?: string;
  phone: string;
  matchScore: number;
  lat: number;
  lng: number;
  isNpaSafeguardActive: boolean;
  safeguardReason?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  caste: 'SC' | 'ST' | 'OBC' | 'General';
  isCasteVerified: boolean;
  annualIncome: number;
  isIncomeVerified: boolean;
  location: {
    tehsil: string;
    district: string;
    state: string;
    pinCode: string;
  };
  projectType: string;
  estimatedCost: number;
  educationStatus: string;
  hasFemaleCoApplicant: boolean;
  femaleCoApplicantName?: string;
}

export interface SchemeMatchResult {
  scheme: Scheme;
  matchScore: number;
  isEligible: boolean;
  confidence: 'likely' | 'maybe' | 'ineligible';
  qualifyingReasons: string[];
  missingOrCautionCriteria: string[];
  estimatedEmi: number;
  interestRateApplied: number | null;
}

export interface ApplicationTrackerItem {
  id: string;
  refNumber: string;
  schemeTitle: string;
  channelPartnerName: string;
  requestedAmount: number;
  appliedDate: string;
  currentStep: 1 | 2 | 3 | 4; // 1: Applied, 2: Bank Verification, 3: Corp Approval, 4: Disbursal
  stepLabel: string;
  stepSublabel: string;
  officerVisitDate?: string;
  status: 'in_progress' | 'approved' | 'disbursed';
  timeline: {
    title: string;
    date: string;
    completed: boolean;
    active?: boolean;
    note?: string;
  }[];
}

export interface FacilitatorCase {
  id: string;
  citizenName: string;
  phone: string;
  village: string;
  projectType: string;
  estimatedAmount: number;
  annualIncome: number;
  casteStatus: 'SC Verified' | 'Pending Doc';
  recommendedScheme: string;
  matchedScore: number;
  status: 'Draft' | 'Submitted' | 'Verification' | 'Sanctioned';
  lastUpdated: string;
}

export interface AdminKpiData {
  totalApplications: number;
  totalDisbursedCr: number;
  activeChannelPartners: number;
  pausedNpaBranches: number;
  averageTatDays: number;
  satisfactionRate: number;
  districtDistribution: {
    district: string;
    cases: number;
    amountCr: number;
    health: 'Good' | 'Fair' | 'NPA Warning';
  }[];
}
