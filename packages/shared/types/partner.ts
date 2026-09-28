import { PartnerType, NpaEligibilityStatus } from '../constants/partners';
import { SchemeType } from '../constants/schemes';

export interface ChannelPartner {
  id: string;
  name: string;
  partnerType: PartnerType;
  branchName?: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  phone: string;
  email?: string;
  eligibleSchemeTypes: SchemeType[];
  npaStatus: NpaEligibilityStatus;
  npaRatioPercent: number;
  fundUtilisationScore: number; // 0 to 100
  isActive: boolean;
  distanceKm?: number;
}
