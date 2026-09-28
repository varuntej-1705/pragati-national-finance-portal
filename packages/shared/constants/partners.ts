export enum PartnerType {
  SCA = 'SCA',           // State Channelizing Agency
  PSB = 'PSB',           // Public Sector Bank
  RRB = 'RRB',           // Regional Rural Bank
  NBFC_MFI = 'NBFC_MFI'  // Non-Banking Financial Company - Micro Finance Institution
}

export enum NpaEligibilityStatus {
  ELIGIBLE = 'ELIGIBLE',                         // Good standing, actively accepting applications
  OVERDUE_RESTRICTED = 'OVERDUE_RESTRICTED',     // Moderate overdues, restricted routing
  HIGH_NPA_BLOCKED = 'HIGH_NPA_BLOCKED'          // High NPAs, blocked from receiving new applications
}
