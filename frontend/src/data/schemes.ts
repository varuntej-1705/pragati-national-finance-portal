import { Scheme } from '../types';

/**
 * Official NSFDC Scheme Catalog (12 Schemes)
 * Ingested directly from SIH 2026 PS 26092 Official Specification & Compendium
 * Verified Source: Ministry of Social Justice & Empowerment / NSFDC (nsfdc.nic.in & myscheme.gov.in)
 */
export const NSFDC_SCHEMES: Scheme[] = [
  // ── 1. Mahila Samriddhi Yojana (MSY) [PRIMARY/VERIFIED] ──
  {
    id: 'msynsfdc',
    code: 'NSFDC-MSY',
    name: 'Mahila Samriddhi Yojana (MSY)',
    category: 'women',
    categoryLabel: 'Women-Led Business (SHG)',
    description: 'Exclusive micro-credit support for Scheduled Caste women members of Self-Help Groups (SHGs) to undertake small income-generating activities with swift sanction and 3-month moratorium.',
    operationalStatus: 'ACTIVE',
    verificationDate: '2026-01-07',
    officialSource: 'Ministry of Social Justice & Empowerment / myScheme',
    officialPortalUrl: 'https://myscheme.gov.in/schemes/msynsfdc',
    maxFunding: 125000, // Max loan ₹1.25 Lakh
    minFunding: 15000,
    projectCostCeilingInr: 140000, // Ceiling ₹1.40 Lakh
    interestRate: 6.0,
    womenInterestRate: 6.0,
    verifyBeforeUse: false,
    targetGroupDescription: 'Women SHG members, SC, family income <= 5,00,000/yr',
    nsfdcSharePercent: 90,
    marginPercent: 10,
    maxTenureYears: 3,
    moratoriumMonths: 3,
    eligibilityConditions: {
      maxFamilyIncome: 500000,
      targetGroup: 'Women SHG members, Scheduled Caste (SC)',
      minAge: 18,
      requiresFemaleCoApplicant: true,
      projectTypes: ['Tailoring & Embroidery', 'Dairy & Animal Husbandry', 'Food Processing', 'Handicrafts', 'Kirana Store']
    },
    requiredDocuments: [
      'Passport-size photograph',
      'Aadhaar card',
      'Caste certificate (Scheduled Caste)',
      'Income certificate (annual family income ≤ ₹5 lakh)',
      'Residence proof',
      'Bank passbook / account details',
      'SHG registration certificate'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1609137144822-2636a0d2f099?auto=format&fit=crop&w=800&q=80',
    imageSourceUrl: 'https://images.unsplash.com/photo-1609137144822-2636a0d2f099',
    fastSanctionDays: 7
  },

  // ── 2. Micro-Credit Finance (MCF) [PRIMARY/VERIFIED] ──
  {
    id: 'mcfnsfdc',
    code: 'NSFDC-MCF',
    name: 'Micro-Credit Finance (MCF)',
    category: 'micro',
    categoryLabel: 'Small Business / Micro Credit',
    description: 'Direct concessional micro-credit assistance to individual Scheduled Caste beneficiaries for income-generating micro activities and self-employment.',
    operationalStatus: 'ACTIVE',
    verificationDate: '2026-01-07',
    officialSource: 'myScheme.gov.in / NSFDC',
    officialPortalUrl: 'https://myscheme.gov.in/schemes/mcfnsfdc',
    maxFunding: 125000, // Max loan ₹1.25 Lakh
    minFunding: 15000,
    projectCostCeilingInr: 140000,
    interestRate: 6.5,
    womenInterestRate: 6.0,
    verifyBeforeUse: false,
    targetGroupDescription: 'Individual SC beneficiary, income-generating micro activity',
    nsfdcSharePercent: 90,
    marginPercent: 10,
    maxTenureYears: 3,
    moratoriumMonths: 3,
    eligibilityConditions: {
      maxFamilyIncome: 500000,
      targetGroup: 'Individual SC micro-entrepreneurs & artisans',
      minAge: 18,
      projectTypes: ['Vegetable / Fruit Vending', 'Carpentry', 'Barber Shop', 'Leather Goods', 'Tea & Snack Stall']
    },
    requiredDocuments: [
      'Passport-size photograph',
      'Aadhaar card',
      'Caste certificate (Scheduled Caste)',
      'Income certificate (annual family income ≤ ₹5 lakh)',
      'Residence proof',
      'Bank passbook / account details'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
    imageSourceUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1',
    fastSanctionDays: 5
  },

  // ── 3. Suvidha Loan [PRIMARY/VERIFIED] ──
  {
    id: 'suvidhansfdc',
    code: 'NSFDC-SUVIDHA',
    name: 'Suvidha Loan',
    category: 'term',
    categoryLabel: 'Larger Business / Term Loan',
    description: 'Term loan assistance for small-to-mid commercial, agro-based, service, and manufacturing enterprises up to ₹10 Lakh project cost with competitive 8% rate.',
    operationalStatus: 'ACTIVE',
    verificationDate: '2026-01-07',
    officialSource: 'Official NSFDC Rate Table',
    officialPortalUrl: 'https://nsfdc.nic.in/',
    maxFunding: 900000, // Max loan ₹9.00 Lakh
    minFunding: 140000,
    projectCostCeilingInr: 1000000, // Ceiling ₹10.00 Lakh
    interestRate: 8.0,
    womenInterestRate: 7.5,
    verifyBeforeUse: false,
    targetGroupDescription: 'SC entrepreneur, small-to-mid project',
    nsfdcSharePercent: 90,
    marginPercent: 10,
    maxTenureYears: 5,
    moratoriumMonths: 6, // 12 mo for agri/construction
    eligibilityConditions: {
      maxFamilyIncome: 500000,
      targetGroup: 'Scheduled Caste (SC) entrepreneurs and partnerships',
      minAge: 18,
      projectTypes: ['Agro Processing', 'Dairy Farming Unit', 'Small Retail Outlet', 'Auto Repair Workshop', 'Printing Press']
    },
    requiredDocuments: [
      'Passport-size photograph',
      'Aadhaar card',
      'Caste certificate (Scheduled Caste)',
      'Income certificate (annual family income ≤ ₹5 lakh)',
      'Residence proof',
      'Bank passbook / account details',
      'Project/Business plan'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
    imageSourceUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e',
    fastSanctionDays: 14
  },

  // ── 4. Utkarsh Loan [PRIMARY/VERIFIED] ──
  {
    id: 'utkarshnsfdc',
    code: 'NSFDC-UTKARSH',
    name: 'Utkarsh Loan',
    category: 'term',
    categoryLabel: 'Larger Business / Term Loan',
    description: 'High-capital term loan for major commercial projects, manufacturing units, and service industries up to ₹50 Lakh project cost for established SC entrepreneurs.',
    operationalStatus: 'ACTIVE',
    verificationDate: '2026-01-07',
    officialSource: 'Official NSFDC Rate Table',
    officialPortalUrl: 'https://nsfdc.nic.in/',
    maxFunding: 4500000, // Max loan ₹45.00 Lakh
    minFunding: 1000000,
    projectCostCeilingInr: 5000000, // Ceiling ₹50.00 Lakh
    interestRate: 9.0,
    womenInterestRate: 8.5,
    verifyBeforeUse: false,
    targetGroupDescription: 'SC entrepreneur, larger project',
    nsfdcSharePercent: 90,
    marginPercent: 10,
    maxTenureYears: 7,
    moratoriumMonths: 6,
    eligibilityConditions: {
      maxFamilyIncome: 500000,
      targetGroup: 'Scheduled Caste (SC) industrialists and large project promoters',
      minAge: 21,
      projectTypes: ['Manufacturing Plant', 'Commercial Transport Fleet', 'Cold Storage & Warehousing', 'Hospital & Diagnostic Lab', 'Textile Factory']
    },
    requiredDocuments: [
      'Passport-size photograph',
      'Aadhaar card',
      'Caste certificate (Scheduled Caste)',
      'Income certificate (annual family income ≤ ₹5 lakh)',
      'Residence proof',
      'Bank passbook / account details',
      'Detailed Project Report (DPR) / Business plan'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    imageSourceUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758',
    fastSanctionDays: 21
  },

  // ── 5. Educational Loan Scheme (ELS) [PRIMARY/VERIFIED] ──
  {
    id: 'els-nsfdc',
    code: 'NSFDC-ELS',
    name: 'Educational Loan Scheme (ELS)',
    category: 'education',
    categoryLabel: 'Education Loan',
    description: 'Financial assistance to SC students pursuing regular full-time professional/technical courses in India or abroad, covering tuition, books, hostel, and exam fees.',
    operationalStatus: 'ACTIVE',
    verificationDate: '2026-01-07',
    officialSource: 'Official myScheme & NSFDC Rate Table',
    officialPortalUrl: 'https://myscheme.gov.in/schemes/els-nsfdc',
    maxFunding: 3000000, // Up to ₹30.00 Lakh or 90% of fee
    minFunding: 50000,
    projectCostCeilingInr: 3000000,
    interestRate: 6.0, // 6% Men
    womenInterestRate: 5.5, // 5.5% Women
    interestRateMen: 6.0,
    verifyBeforeUse: false,
    targetGroupDescription: 'SC students, accredited professional/technical course, min 50% marks',
    nsfdcSharePercent: 90,
    marginPercent: 10,
    maxTenureYears: 12,
    moratoriumMonths: 6, // 6 mo after completion of course
    eligibilityConditions: {
      maxFamilyIncome: 500000,
      targetGroup: 'SC students admitted to accredited professional/technical courses',
      minAge: 17,
      projectTypes: ['Engineering / B.Tech', 'Medical / MBBS', 'Management / MBA', 'Doctoral Studies', 'Overseas Master Degree']
    },
    requiredDocuments: [
      'Passport-size photograph',
      'Aadhaar card',
      'Caste certificate (Scheduled Caste)',
      'Income certificate (annual family income ≤ ₹5 lakh)',
      'Residence proof',
      'Bank passbook / account details',
      'Admission letter & Fee structure',
      'Marksheet & academic records'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    imageSourceUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
    fastSanctionDays: 14
  },

  // ── 6. New Swarnima Scheme [ADDITIONAL DEMO / VERIFY_BEFORE_USE] ──
  {
    id: 'swarnimansfdc',
    code: 'NSFDC-SWARNIMA',
    name: 'New Swarnima Scheme',
    category: 'women',
    categoryLabel: 'Women-Led Business (SHG)',
    description: 'Term loan support specifically enabling SC women entrepreneurs to attain self-reliance through viable micro-enterprises at a subsidized 5% rate.',
    operationalStatus: 'VERIFICATION_REQUIRED',
    verificationDate: '2026-01-07',
    officialSource: 'NSFDC Scheme Compendium',
    officialPortalUrl: 'https://nsfdc.nic.in/',
    maxFunding: 200000, // Max loan ₹2.00 Lakh
    minFunding: 25000,
    projectCostCeilingInr: 200000,
    interestRate: 5.0,
    womenInterestRate: 5.0,
    verifyBeforeUse: true,
    targetGroupDescription: 'Women, SC, self-reliance/small enterprise',
    nsfdcSharePercent: 100,
    marginPercent: 0,
    maxTenureYears: 8,
    moratoriumMonths: 6,
    eligibilityConditions: {
      maxFamilyIncome: 500000,
      targetGroup: 'SC Women micro-entrepreneurs',
      minAge: 18,
      requiresFemaleCoApplicant: true,
      projectTypes: ['Beauty Salon', 'Boutique & Tailoring', 'Catering & Tiffin', 'Retail Shop', 'Poultry Farm']
    },
    requiredDocuments: [
      'Passport-size photograph',
      'Aadhaar card',
      'Caste certificate (Scheduled Caste)',
      'Income certificate (annual family income ≤ ₹5 lakh)',
      'Residence proof',
      'Bank passbook / account details'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    imageSourceUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    fastSanctionDays: 10
  },

  // ── 7. Mahila Adhikarita Yojana (MAY) [ADDITIONAL DEMO / VERIFY_BEFORE_USE] ──
  {
    id: 'maynsfdc',
    code: 'NSFDC-MAY',
    name: 'Mahila Adhikarita Yojana (MAY)',
    category: 'women',
    categoryLabel: 'Women-Led Business (SHG)',
    description: 'Micro-finance window for empowerment-linked micro enterprises for SC women groups. Current operational terms subject to channel partner verification.',
    operationalStatus: 'VERIFICATION_REQUIRED',
    verificationDate: '2026-01-07',
    officialSource: 'NSFDC Scheme Compendium',
    officialPortalUrl: 'https://nsfdc.nic.in/',
    maxFunding: 500000, // Max loan ₹5.00 Lakh
    minFunding: 25000,
    projectCostCeilingInr: 500000,
    interestRate: null, // Nullable per prompt requirement
    womenInterestRate: null,
    verifyBeforeUse: true,
    targetGroupDescription: 'Women, SC, empowerment-linked micro enterprise',
    nsfdcSharePercent: 100,
    marginPercent: 0,
    maxTenureYears: null,
    moratoriumMonths: null,
    eligibilityConditions: {
      maxFamilyIncome: 500000,
      targetGroup: 'SC Women collectives and enterprises',
      minAge: 18,
      requiresFemaleCoApplicant: true,
      projectTypes: ['Handicrafts Collective', 'Dairy Cooperative', 'Apparel Unit', 'Micro Bakery']
    },
    requiredDocuments: [
      'Passport-size photograph',
      'Aadhaar card',
      'Caste certificate (Scheduled Caste)',
      'Income certificate (annual family income ≤ ₹5 lakh)',
      'Residence proof',
      'Bank passbook / account details'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    imageSourceUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f',
    fastSanctionDays: 14
  },

  // ── 8. Laghu Vyavasaya Yojana (LVY) [ADDITIONAL DEMO / VERIFY_BEFORE_USE] ──
  {
    id: 'lvynsfdc',
    code: 'NSFDC-LVY',
    name: 'Laghu Vyavasaya Yojana',
    category: 'term',
    categoryLabel: 'Small Business / Term Loan',
    description: 'Concessional term credit for SC micro and small commercial activities, shops, and trades with repayment up to 6 years.',
    operationalStatus: 'VERIFICATION_REQUIRED',
    verificationDate: '2026-01-07',
    officialSource: 'NSFDC Scheme Compendium',
    officialPortalUrl: 'https://nsfdc.nic.in/',
    maxFunding: 200000, // Max loan ₹2.00 Lakh
    minFunding: 20000,
    projectCostCeilingInr: 200000,
    interestRate: 6.0,
    womenInterestRate: 5.5,
    verifyBeforeUse: true,
    targetGroupDescription: 'SC entrepreneur, small business',
    nsfdcSharePercent: 90,
    marginPercent: 10,
    maxTenureYears: 6,
    moratoriumMonths: null,
    eligibilityConditions: {
      maxFamilyIncome: 500000,
      targetGroup: 'SC individual small business owners',
      minAge: 18,
      projectTypes: ['Small Grocery', 'Electronics Repair', 'Hardware Store', 'Footwear Shop']
    },
    requiredDocuments: [
      'Passport-size photograph',
      'Aadhaar card',
      'Caste certificate (Scheduled Caste)',
      'Income certificate (annual family income ≤ ₹5 lakh)',
      'Residence proof',
      'Bank passbook / account details',
      'Business plan'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=800&q=80',
    imageSourceUrl: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d',
    fastSanctionDays: 14
  },

  // ── 9. Swachhta Udyami Yojana (SUY) [ADDITIONAL DEMO / VERIFY_BEFORE_USE] ──
  {
    id: 'suynsfdc',
    code: 'NSFDC-SUY',
    name: 'Swachhta Udyami Yojana',
    category: 'term',
    categoryLabel: 'Larger Business / Term Loan',
    description: 'Mechanized sanitation and green hygiene business loan for SC entrepreneurs to procure sanitation equipment and bio-digester vehicles.',
    operationalStatus: 'VERIFICATION_REQUIRED',
    verificationDate: '2026-01-07',
    officialSource: 'NSFDC Sanitation Initiatives',
    officialPortalUrl: 'https://nsfdc.nic.in/',
    maxFunding: 1500000, // Max loan ₹15.00 Lakh
    minFunding: 100000,
    projectCostCeilingInr: 1500000,
    interestRate: null, // Nullable per prompt requirement (wholesale 2% M / 1% W)
    womenInterestRate: null,
    verifyBeforeUse: true,
    targetGroupDescription: 'SC entrepreneur, sanitation-linked business',
    nsfdcSharePercent: 90,
    marginPercent: 10,
    maxTenureYears: null,
    moratoriumMonths: null,
    eligibilityConditions: {
      maxFamilyIncome: 500000,
      targetGroup: 'SC sanitation workers & mechanized cleaning operators',
      minAge: 18,
      projectTypes: ['Mechanized Suction Machine', 'Garbage Tipper Vehicle', 'Sanitation Services', 'Septic Tank Vacuum Unit']
    },
    requiredDocuments: [
      'Passport-size photograph',
      'Aadhaar card',
      'Caste certificate (Scheduled Caste)',
      'Income certificate (annual family income ≤ ₹5 lakh)',
      'Residence proof',
      'Bank passbook / account details',
      'Business plan'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80',
    imageSourceUrl: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b',
    fastSanctionDays: 21
  },

  // ── 10. Vocational Education & Training Loan Scheme (VETLS) [ADDITIONAL DEMO / VERIFY_BEFORE_USE] ──
  {
    id: 'vetlnsfdc',
    code: 'NSFDC-VETL',
    name: 'Vocational Education & Training Loan',
    category: 'education',
    categoryLabel: 'Education Loan',
    description: 'Financing for SC students/youth pursuing vocational skilling, polytechnic diplomas, and certified technical training courses up to ₹4 Lakh.',
    operationalStatus: 'VERIFICATION_REQUIRED',
    verificationDate: '2026-01-07',
    officialSource: 'NSFDC Training Division',
    officialPortalUrl: 'https://nsfdc.nic.in/',
    maxFunding: 400000, // Max loan ₹4.00 Lakh
    minFunding: 20000,
    projectCostCeilingInr: 400000,
    interestRate: null, // Nullable per prompt (wholesale 1.5% M / 1% W)
    womenInterestRate: null,
    verifyBeforeUse: true,
    targetGroupDescription: 'SC students/youth, vocational/skill course',
    nsfdcSharePercent: 100,
    marginPercent: 0,
    maxTenureYears: null,
    moratoriumMonths: null,
    eligibilityConditions: {
      maxFamilyIncome: 500000,
      targetGroup: 'SC youth enrolled in recognized vocational ITI / Polytechnic institutions',
      minAge: 17,
      projectTypes: ['Vocational ITI', 'Polytechnic Diploma', 'Computer Networking', 'CNC Machinist Course']
    },
    requiredDocuments: [
      'Passport-size photograph',
      'Aadhaar card',
      'Caste certificate (Scheduled Caste)',
      'Income certificate (annual family income ≤ ₹5 lakh)',
      'Residence proof',
      'Bank passbook / account details',
      'Admission letter'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80',
    imageSourceUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789',
    fastSanctionDays: 10
  },

  // ── 11. Green Business Scheme (GBS) [ADDITIONAL DEMO / VERIFY_BEFORE_USE] ──
  {
    id: 'gbsnsfdc',
    code: 'NSFDC-GBS',
    name: 'Green Business Scheme',
    category: 'green',
    categoryLabel: 'Larger Business / Eco-Friendly',
    description: 'Promoting clean and green entrepreneurship among SC youth through loans for solar pumps, e-rickshaws, polyhouse farming, and bio-waste equipment.',
    operationalStatus: 'VERIFICATION_REQUIRED',
    verificationDate: '2026-01-07',
    officialSource: 'NSFDC Green Initiatives',
    officialPortalUrl: 'https://nsfdc.nic.in/',
    maxFunding: 3000000, // Max loan ₹30.00 Lakh
    minFunding: 50000,
    projectCostCeilingInr: 3000000,
    interestRate: null, // Nullable per prompt (wholesale 2-4% tiered)
    womenInterestRate: null,
    verifyBeforeUse: true,
    targetGroupDescription: 'SC entrepreneur, eco-friendly/green business',
    nsfdcSharePercent: 90,
    marginPercent: 10,
    maxTenureYears: null,
    moratoriumMonths: null,
    eligibilityConditions: {
      maxFamilyIncome: 500000,
      targetGroup: 'SC green technology entrepreneurs',
      minAge: 18,
      projectTypes: ['E-Rickshaw Fleet', 'Solar Rooftop & Agripumps', 'Polyhouse Greenhouse', 'Bio-Gas & Vermicompost']
    },
    requiredDocuments: [
      'Passport-size photograph',
      'Aadhaar card',
      'Caste certificate (Scheduled Caste)',
      'Income certificate (annual family income ≤ ₹5 lakh)',
      'Residence proof',
      'Bank passbook / account details',
      'Business plan'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80',
    imageSourceUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9',
    fastSanctionDays: 21
  },

  // ── 12. Aajeevika Micro-Finance Yojana (AMY) [ADDITIONAL DEMO / VERIFY_BEFORE_USE] ──
  {
    id: 'amynsfdc',
    code: 'NSFDC-AMY',
    name: 'Aajeevika Micro-Finance Yojana (AMY)',
    category: 'micro',
    categoryLabel: 'Small Business / Micro Credit',
    description: 'Need-based micro-finance through selected NBFC-MFIs reaching grassroot rural and semi-urban Scheduled Caste beneficiaries without collateral hassle.',
    operationalStatus: 'VERIFICATION_REQUIRED',
    verificationDate: '2026-01-07',
    officialSource: 'NSFDC Micro-Credit Division',
    officialPortalUrl: 'https://nsfdc.nic.in/',
    maxFunding: 140000, // Max loan ₹1.40 Lakh
    minFunding: 20000,
    projectCostCeilingInr: 140000,
    interestRate: null, // Nullable per prompt (wholesale 3% M / 2% W)
    womenInterestRate: null,
    verifyBeforeUse: true,
    targetGroupDescription: 'SC individual, livelihood micro-enterprise',
    nsfdcSharePercent: 90,
    marginPercent: 10,
    maxTenureYears: null,
    moratoriumMonths: null,
    eligibilityConditions: {
      maxFamilyIncome: 500000,
      targetGroup: 'Scheduled Caste individuals seeking micro-livelihoods',
      minAge: 18,
      projectTypes: ['Kirana Shop', 'Poultry & Goat Rearing', 'Tailoring Workshop', 'Local Transport']
    },
    requiredDocuments: [
      'Passport-size photograph',
      'Aadhaar card',
      'Caste certificate (Scheduled Caste)',
      'Income certificate (annual family income ≤ ₹5 lakh)',
      'Residence proof',
      'Bank passbook / account details'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    imageSourceUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f',
    fastSanctionDays: 5
  }
];
