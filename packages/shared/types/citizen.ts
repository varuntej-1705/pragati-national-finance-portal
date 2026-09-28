import { UserRole, Gender, SocialCategory } from '../constants/roles';

export interface CitizenProfile {
  id: string;
  phone: string;
  role: UserRole;
  fullName?: string;
  age?: number;
  gender?: Gender;
  category?: SocialCategory;
  annualFamilyIncome: number;
  educationStatus?: string;
  occupation?: string;
  state: string;
  district: string;
  pincode?: string;
  disabilityStatus?: boolean;
  languagePref: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CitizenProfileCreateInput {
  phone: string;
  annualFamilyIncome: number;
  category?: SocialCategory;
  state: string;
  district: string;
  fullName?: string;
  age?: number;
  gender?: Gender;
  educationStatus?: string;
  occupation?: string;
  pincode?: string;
  disabilityStatus?: boolean;
  languagePref?: string;
}
