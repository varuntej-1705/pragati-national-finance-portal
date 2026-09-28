import { Scheme } from '../types';

export const NSFDC_SCHEMES: Scheme[] = [
  {
    id: 'scheme-tls',
    code: 'NSFDC-TLS-2024',
    name: 'Term Loan Scheme (TLS)',
    category: 'term',
    categoryLabel: 'Industrial & Services Loan',
    description: 'Medium and long term credit assistance for viable commercial, agro, manufacturing, transport, and service projects for Scheduled Caste entrepreneurs.',
    maxFunding: 5000000, // ₹50.0 Lakh
    minFunding: 100000,
    interestRate: 6.50,
    womenInterestRate: 6.00,
    nsfdcSharePercent: 90,
    marginPercent: 10,
    maxTenureYears: 10,
    moratoriumMonths: 6,
    eligibilityConditions: {
      maxFamilyIncome: 300000,
      targetGroup: 'Scheduled Caste (SC) citizen',
      minAge: 18,
      projectTypes: ['Dairy & Animal Husbandry', 'Agro Processing', 'Small Manufacturing', 'Commercial Transport', 'Service Enterprise']
    },
    requiredDocuments: [
      'Aadhaar Card (UIDAI Linked)',
      'DigiLocker SC Caste Certificate',
      'Tehsildar Income Certificate (<₹3.0L)',
      'Detailed Project Report (DPR)',
      'Bank Account Statement (6 Months)'
    ],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlx4pBgrdu-x4blUoqbEZbBzGePfVLi7oWekQxFb2KXMz3XD4FvajazZOaefIc5XyNO-UUdESgEgC8Xcb_P_Z2U57aIe181JdiAiMv8MsUVsOWK0awGRxQVMmqULbGY8wbWKTZR_ELaQLmxD3jtvmJM3_cG_3RROW39LPosbqNGNQMEGqsQHLKS5nvmX90XDeBnpD3igaoN5TbtyQfjnbERYvePcaDGtySLxlp2_lXAp62DJkFm9ov',
    officialPortalUrl: 'https://nsfdc.nic.in/en/term-loan-scheme',
    fastSanctionDays: 21
  },
  {
    id: 'scheme-mcf',
    code: 'NSFDC-MCF-2024',
    name: 'Micro Credit Finance (MCF)',
    category: 'micro',
    categoryLabel: 'Rural Self-Help & Micro-Enterprise',
    description: 'Fast micro-enterprise seed loan disbursed through State Channelising Agencies, Regional Rural Banks, and SHGs with zero borrower margin required.',
    maxFunding: 140000, // ₹1.40 Lakh
    minFunding: 20000,
    interestRate: 5.00,
    womenInterestRate: 4.50,
    nsfdcSharePercent: 100,
    marginPercent: 0,
    maxTenureYears: 3,
    moratoriumMonths: 3,
    eligibilityConditions: {
      maxFamilyIncome: 300000,
      targetGroup: 'Scheduled Caste micro-entrepreneurs / artisans',
      minAge: 18,
      projectTypes: ['Handloom & Weaving', 'Grocery / Kirana', 'Tailoring & Garments', 'Street Vending', 'Carpentry & Artisan Work']
    },
    requiredDocuments: [
      'Aadhaar Card',
      'SC Caste Certificate',
      'Income Declaration / Ration Card',
      'Bank Passbook copy'
    ],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOtYM-HSOVd5q2ySo25GCOulhbtc_knj6UB6ox4p8uOHuN-2WcNEbA8QoXaRqeMYYd7AKCKjbZiyiNL0CtZ9NnkWinvdxSbB7p9IFhK5nnxAGNhku2K9BgRxfUsdx180v0IvuFeCk2tO2otD437pf4AT9UPQ9qBiVIn29KMUB0SxIGnaGt-hms2O-hJ0F-gCB-LHikvFGeKr6H1r9O_0BQaMYracGm5ZDZ9zizJzpleChzzWF_qq6K',
    officialPortalUrl: 'https://nsfdc.nic.in/en/micro-credit-finance',
    fastSanctionDays: 7
  },
  {
    id: 'scheme-msy',
    code: 'NSFDC-MSY-2024',
    name: 'Mahila Samriddhi Yojana (MSY)',
    category: 'women',
    categoryLabel: 'Special Concessional Credit with Capital Subsidy',
    description: 'Tailored micro-credit empowerment for SC women entrepreneurs, providing up to 50% capital subsidy (max ₹60,000) and ultra-low 4.0% interest rate.',
    maxFunding: 140000, // ₹1.40 Lakh
    minFunding: 25000,
    interestRate: 4.00,
    womenInterestRate: 4.00,
    nsfdcSharePercent: 100,
    marginPercent: 0,
    maxTenureYears: 3,
    moratoriumMonths: 6,
    subsidyPercentage: 50,
    maxSubsidyAmount: 60000,
    eligibilityConditions: {
      maxFamilyIncome: 300000,
      targetGroup: 'Scheduled Caste Women Beneficiaries or Female Co-Applicants',
      minAge: 18,
      requiresFemaleCoApplicant: true,
      projectTypes: ['Food Processing', 'Beauty & Wellness', 'Dairy Stall', 'Garment Boutique', 'Retail Trade']
    },
    requiredDocuments: [
      'Aadhaar of Female Applicant / Co-Applicant',
      'SC Caste Certificate',
      'Income Proof (<₹3.0L)',
      'Self-Declaration form'
    ],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKU2zH2JysQqjlzSwNm22BJ8V6ymg3GC4ls-uWsaYlw0z7C899KyvKLEip76bs4vnCLcjjYtoaghisewa9RUzLTMH5EKeM2Fj1ZWSdDWFb5R0JrshV-edFr7wRoLjBG2y3EsQCYsEO4-bgfFXmwoBCX0GUzxP-HhEOU4IlbkckdAj-SjYKpUaLYHCibG44n-Cqg5LLytCoNTKWdhGUvuEKnacsbaEELU0ZeyqOGa9fBO4dAzEE3sYP',
    officialPortalUrl: 'https://nsfdc.nic.in/en/mahila-samriddhi-yojana',
    fastSanctionDays: 10
  },
  {
    id: 'scheme-elps',
    code: 'NSFDC-ELPS-2024',
    name: 'Educational Loan Scheme (ELPS)',
    category: 'education',
    categoryLabel: 'Higher & Technical Education Credit',
    description: 'Concessional credit for professional and higher technical degrees (Engineering, Medical, MBA, Polytechnic) in India and recognized overseas universities.',
    maxFunding: 2000000, // ₹20.0 Lakh (India)
    minFunding: 100000,
    interestRate: 4.00,
    womenInterestRate: 3.50,
    nsfdcSharePercent: 90,
    marginPercent: 10,
    maxTenureYears: 10,
    moratoriumMonths: 12, // Course duration + 1 year
    eligibilityConditions: {
      maxFamilyIncome: 500000,
      targetGroup: 'SC Students secured admission in higher/technical courses',
      minAge: 17,
      projectTypes: ['Higher Education', 'Medical / Engineering', 'Skill Certification', 'Abroad Studies']
    },
    requiredDocuments: [
      'Admission Confirmation Letter / Merit Scorecard',
      'Fee Structure of Institution',
      'SC Caste Certificate',
      'Family Income Certificate (<₹5.0L)',
      '10th / 12th / Degree Marksheets'
    ],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7ITRlefOjkq052pJ6a1OSMwXSfpOXVZCqdAfKta-UwvH9B-ZQc874Hw6uWqrFT2kXqifKNCz1k5fUt7tUQvZecnHHzoEreubqmUwa2An-LIm2jr53JhWr8onlAK_P_HMHD_GW7z3RhTi4yJqqVlSeBng6uTcIq6Hz-fP5stm7ANGbRmbaXGTGibnXdnOzdlxqvYzNfAaKKyAObOEB9o9O5pdAphZxFAWPx40GX915pBYOVgmS6y0v',
    officialPortalUrl: 'https://nsfdc.nic.in/en/education-loan-scheme',
    fastSanctionDays: 14
  },
  {
    id: 'scheme-green',
    code: 'NSFDC-GBS-2024',
    name: 'Green Business Scheme (GBS)',
    category: 'green',
    categoryLabel: 'Clean Energy & Sustainable Livelihood',
    description: 'Promoting green entrepreneurship among SC youth through financing for e-rickshaws, solar irrigation pumps, polyhouse farming, and bio-waste processing.',
    maxFunding: 3000000, // ₹30.0 Lakh
    minFunding: 150000,
    interestRate: 6.00,
    womenInterestRate: 5.50,
    nsfdcSharePercent: 90,
    marginPercent: 10,
    maxTenureYears: 7,
    moratoriumMonths: 6,
    eligibilityConditions: {
      maxFamilyIncome: 300000,
      targetGroup: 'Scheduled Caste green innovators & eco-entrepreneurs',
      minAge: 18,
      projectTypes: ['E-Rickshaw / EV Fleet', 'Solar Rooftop / Pumps', 'Organic Greenhouse', 'Bio-fertilizer Unit']
    },
    requiredDocuments: [
      'Aadhaar & SC Certificate',
      'Income Certificate (<₹3.0L)',
      'Green Quotation / EV Dealer Proforma',
      'Driving License (for EV transport)'
    ],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlx4pBgrdu-x4blUoqbEZbBzGePfVLi7oWekQxFb2KXMz3XD4FvajazZOaefIc5XyNO-UUdESgEgC8Xcb_P_Z2U57aIe181JdiAiMv8MsUVsOWK0awGRxQVMmqULbGY8wbWKTZR_ELaQLmxD3jtvmJM3_cG_3RROW39LPosbqNGNQMEGqsQHLKS5nvmX90XDeBnpD3igaoN5TbtyQfjnbERYvePcaDGtySLxlp2_lXAp62DJkFm9ov',
    officialPortalUrl: 'https://nsfdc.nic.in/en/green-business-scheme',
    fastSanctionDays: 15
  }
];
