export enum SchemeType {
  MICRO_FINANCE = 'MICRO_FINANCE',
  TERM_LOAN = 'TERM_LOAN',
  EDUCATIONAL_LOAN = 'EDUCATIONAL_LOAN',
  SPECIAL_WOMEN_SHG = 'SPECIAL_WOMEN_SHG'
}

export enum MatchConfidence {
  HIGH = 'HIGH',       // "Likely eligible" - All required rules met
  MEDIUM = 'MEDIUM',   // "Maybe eligible - verify criteria X" - Some borderline or missing unverified fields
  LOW = 'LOW'          // Ineligible or major criteria mismatch
}

export enum ApplicationStatusEnum {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  SANCTIONED = 'SANCTIONED',
  DISBURSED = 'DISBURSED',
  REJECTED = 'REJECTED'
}

export const INCOME_CEILING_INR = 500000; // 5 Lakhs annual family income
