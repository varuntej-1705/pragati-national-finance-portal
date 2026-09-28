import { Language } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  subTagline: string;
  chooseLang: string;
  quickAccess: string;
  signInSub: string;
  sendOtp: string;
  otpVerified: string;
  continueGuest: string;
  assistance: string;
  navHome: string;
  navSchemes: string;
  navCalculator: string;
  navLocator: string;
  portalHeader: string;
  citizenDashboard: string;
  greeting: string;
  greetingSub: string;
  searchPlaceholder: string;
  filterMostMatched: string;
  filterTermLoans: string;
  filterMicroCredit: string;
  filterWomenQuota: string;
  filterSkillLoans: string;
  recommendedForYou: string;
  recommendedSub: string;
  viewAll: string;
  govtSubsidized: string;
  maxFunding: string;
  apply: string;
  inReviewApp: string;
  sanctionRequested: string;
  applied: string;
  bankVerification: string;
  corpApproval: string;
  disbursal: string;
  officerVisit: string;
  trackDetails: string;
  citizenServices: string;
  utilitiesSub: string;
  findSchemes: string;
  findSchemesSub: string;
  emiCalc: string;
  emiCalcSub: string;
  channelPartners: string;
  channelPartnersSub: string;
  voiceSaathi: string;
  voiceSaathiSub: string;
  tollFree: string;
  callNow: string;
  whyYouQualify: string;
  applyNearestBank: string;
  calculateEmi: string;
  offlineBanner: string;
  offlineBannerSub: string;
  retry: string;
  switchRole: string;

  // Additional comprehensive keys for dynamic language switching
  schemesTitle: string;
  calculatorTitle: string;
  locatorTitle: string;
  facilitatorTitle: string;
  adminTitle: string;
  allSchemesLabel: string;
  termLoansTab: string;
  microFinanceTab: string;
  womenSpecialTab: string;
  eligibilityMatch: string;
  interestAnnual: string;
  nsfdcShare: string;
  femaleCoApplicantBenefit: string;
  femaleCoApplicantTitle: string;
  femaleCoApplicantDesc: string;
  addCoApplicantBtn: string;
  coApplicantActiveBtn: string;
  needHelpChoosing: string;
  viewDetailsAndDocs: string;
  hideRequiredDocs: string;
  limitLabel: string;
  marginMoneyLabel: string;
  nilMargin: string;
  financialPlanner: string;
  financialPlannerSub: string;
  estimatedMonthlyRepayment: string;
  perMonth: string;
  subsidizedRateSaves: string;
  vsCommercialBanks: string;
  projectInvestmentCost: string;
  repaymentTenure: string;
  yearsLabel: string;
  monthsLabel: string;
  moratoriumBuffer: string;
  noneLabel: string;
  moratoriumDesc: string;
  repaymentTrajectory: string;
  principalLabel: string;
  interestLabel: string;
  saveAndFindBank: string;
  downloadSchedulePdf: string;
  targetedGeography: string;
  allChannels: string;
  stateSca: string;
  rrbGraminBank: string;
  cooperative: string;
  radiusLabel: string;
  youAreHere: string;
  availableChannelPartners: string;
  rankedBySpeed: string;
  activeGis: string;
  routeApplicationHere: string;
  selectChannel: string;
  pausedBadge: string;
  routingPausedTitle: string;
  routingPausedDesc: string;
  autoRerouteConfigured: string;
  offlineHelpdesk: string;
  freeAssistance: string;
  englishLabel: string;
  hindiLabel: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'Yojana Saathi',
    tagline: 'Empowering Dreams with Concessional Credit',
    subTagline: 'योजना साथी • आपकी प्रगति का साथी',
    chooseLang: 'Choose Language / भाषा चुनें',
    quickAccess: 'Quick Access',
    signInSub: 'Sign in via Aadhaar-linked mobile',
    sendOtp: 'Send OTP • ओटीपी भेजें',
    otpVerified: 'Verify & Enter Gateway',
    continueGuest: 'Explore Schemes as Guest',
    assistance: 'Assistance',
    navHome: 'Home',
    navSchemes: 'Schemes',
    navCalculator: 'Calculator',
    navLocator: 'Locator',
    portalHeader: 'NSFDC PORTAL',
    citizenDashboard: 'Citizen Home Dashboard',
    greeting: 'Hi, Rameshwar',
    greetingSub: 'Explore your personalized welfare schemes',
    searchPlaceholder: 'Search schemes, subsidies, loans...',
    filterMostMatched: 'Most Matched',
    filterTermLoans: 'Term Loans',
    filterMicroCredit: 'Micro Credit',
    filterWomenQuota: 'Women Quota',
    filterSkillLoans: 'Skill Loans',
    recommendedForYou: 'Recommended For You',
    recommendedSub: 'Based on caste verification & agro profile',
    viewAll: 'View all',
    govtSubsidized: 'Govt. Subsidized',
    maxFunding: 'Max Funding',
    apply: 'Apply',
    inReviewApp: 'IN-REVIEW APPLICATION',
    sanctionRequested: 'Sanction Requested',
    applied: 'Applied',
    bankVerification: 'Bank Verification',
    corpApproval: 'Corp Approval',
    disbursal: 'Disbursal',
    officerVisit: 'Officer Visit scheduled for 24 Oct',
    trackDetails: 'Track Details',
    citizenServices: 'Citizen Services',
    utilitiesSub: 'Self-service utilities',
    findSchemes: 'Find Schemes',
    findSchemesSub: 'Eligibility AI matcher',
    emiCalc: 'EMI Calculator',
    emiCalcSub: 'Subsidized repayments',
    channelPartners: 'Channel Partners',
    channelPartnersSub: 'Banks & SCA centers',
    voiceSaathi: 'Voice Saathi',
    voiceSaathiSub: 'Ask in Hindi • आवाज़ सहायता',
    tollFree: 'Toll Free Helpline',
    callNow: 'Call Now',
    whyYouQualify: 'Why You Qualify (3 Direct Matches)',
    applyNearestBank: 'Apply via Nearest Bank',
    calculateEmi: 'Calculate EMI',
    offlineBanner: 'Offline Mode Active',
    offlineBannerSub: 'Displaying cached schemes and partner data safely.',
    retry: 'Retry Sync',
    switchRole: 'Role Gateway',

    schemesTitle: 'Smart Scheme Recommender',
    calculatorTitle: 'Financial EMI Calculator',
    locatorTitle: 'Geo Spatial Partner Locator',
    facilitatorTitle: 'Facilitator Nodal Workstation',
    adminTitle: 'NSFDC Admin Control Center',
    allSchemesLabel: 'All Schemes',
    termLoansTab: 'Term Loans',
    microFinanceTab: 'Micro Finance',
    womenSpecialTab: 'Women Special',
    eligibilityMatch: 'Eligibility Match',
    interestAnnual: 'Interest p.a.',
    nsfdcShare: 'NSFDC Share',
    femaleCoApplicantBenefit: 'Female Co-Applicant Benefit',
    femaleCoApplicantTitle: 'Mahila Samriddhi Yojana (MSY)',
    femaleCoApplicantDesc: 'Unlock 50% Capital Subsidy (Up to ₹60,000) with interest relief at just 4.00% p.a. by nominating a female family member.',
    addCoApplicantBtn: 'Add Co-Applicant & Unlock',
    coApplicantActiveBtn: 'Co-Applicant Active: 50% Subsidy Unlocked!',
    needHelpChoosing: 'Need help choosing? Call toll-free 1800-11-0396',
    viewDetailsAndDocs: 'View Details & Required Documents',
    hideRequiredDocs: 'Hide Required Documents',
    limitLabel: 'Limit',
    marginMoneyLabel: 'Margin Money',
    nilMargin: 'Nil (0%)',
    financialPlanner: 'Financial Planner',
    financialPlannerSub: 'Calculate subsidized loans & repayment schedules',
    estimatedMonthlyRepayment: 'Estimated Monthly Repayment',
    perMonth: '/ month',
    subsidizedRateSaves: 'Subsidized rate saves',
    vsCommercialBanks: 'vs commercial banks (11.5%)',
    projectInvestmentCost: 'Project Investment Cost',
    repaymentTenure: 'Repayment Tenure',
    yearsLabel: 'Years',
    monthsLabel: 'Months',
    moratoriumBuffer: 'Moratorium Buffer',
    noneLabel: 'None',
    moratoriumDesc: 'Principal repayment is deferred during setup period. Only nominal subsidized interest applies.',
    repaymentTrajectory: 'Repayment Trajectory',
    principalLabel: 'Principal',
    interestLabel: 'Interest',
    saveAndFindBank: 'Save & Find Partner Bank',
    downloadSchedulePdf: 'Download Repayment Schedule PDF',
    targetedGeography: 'Targeted Geography',
    allChannels: 'All Channels',
    stateSca: 'State SCA',
    rrbGraminBank: 'RRB / Gramin Bank',
    cooperative: 'Cooperative',
    radiusLabel: 'Radius',
    youAreHere: 'You Are Here',
    availableChannelPartners: 'Available Channel Partners',
    rankedBySpeed: 'Ranked by scheme speed, capacity & proximity',
    activeGis: 'Active GIS',
    routeApplicationHere: 'Route Application Here',
    selectChannel: 'Select Channel',
    pausedBadge: 'Paused',
    routingPausedTitle: 'Routing Paused — Protection Active',
    routingPausedDesc: 'Branch NPA > 15%. Direct routing temporarily paused by NSFDC algorithm to protect applicant approval turnaround and prevent subsidy pipeline lockups.',
    autoRerouteConfigured: 'Automatic Reroute Configured to UPSCFDC',
    offlineHelpdesk: 'Offline Helpdesk',
    freeAssistance: 'Free in-person biometric & form assistance',
    englishLabel: 'English',
    hindiLabel: 'हिंदी'
  },
  hi: {
    appName: 'योजना साथी',
    tagline: 'रियायती ऋण के साथ सपनों को नई उड़ान',
    subTagline: 'योजना साथी • आपकी प्रगति का साथी',
    chooseLang: 'भाषा चुनें / Choose Language',
    quickAccess: 'त्वरित प्रवेश',
    signInSub: 'आधार से जुड़े मोबाइल नंबर से प्रवेश करें',
    sendOtp: 'ओटीपी भेजें • Send OTP',
    otpVerified: 'सत्यापित करें और आगे बढ़ें',
    continueGuest: 'अतिथि के रूप में योजनाएं देखें',
    assistance: 'सहायता',
    navHome: 'होम',
    navSchemes: 'योजनाएं',
    navCalculator: 'कैलकुलेटर',
    navLocator: 'लोकेटर',
    portalHeader: 'एनएसएफडीसी पोर्टल',
    citizenDashboard: 'नागरिक मुख्य डैशबोर्ड',
    greeting: 'नमस्ते, रामेश्वर जी',
    greetingSub: 'आपके लिए व्यक्तिगत कल्याणकारी योजनाएं',
    searchPlaceholder: 'योजनाएं, सब्सिडी या ऋण खोजें...',
    filterMostMatched: 'सर्वाधिक उपयुक्त',
    filterTermLoans: 'सावधि ऋण',
    filterMicroCredit: 'माइक्रो क्रेडिट',
    filterWomenQuota: 'महिला कोटा',
    filterSkillLoans: 'कौशल ऋण',
    recommendedForYou: 'आपके लिए अनुशंसित',
    recommendedSub: 'जाति सत्यापन एवं कृषि विवरण पर आधारित',
    viewAll: 'सभी देखें',
    govtSubsidized: 'सरकारी अनुदान प्राप्त',
    maxFunding: 'अधिकतम ऋण राशि',
    apply: 'आवेदन करें',
    inReviewApp: 'प्रक्रियाधीन आवेदन',
    sanctionRequested: 'स्वीकृति अनुरोध',
    applied: 'आवेदन किया',
    bankVerification: 'बैंक सत्यापन',
    corpApproval: 'निगम स्वीकृति',
    disbursal: 'वितरण',
    officerVisit: 'अधिकारी दौरा 24 अक्टूबर को निर्धारित',
    trackDetails: 'विवरण ट्रैक करें',
    citizenServices: 'नागरिक सेवाएं',
    utilitiesSub: 'स्वयं-सेवा सुविधाएं',
    findSchemes: 'योजनाएं खोजें',
    findSchemesSub: 'पात्रता मिलान इंजन',
    emiCalc: 'ईएमआई कैलकुलेटर',
    emiCalcSub: 'रियायती किस्त गणना',
    channelPartners: 'चैनल पार्टनर',
    channelPartnersSub: 'बैंक और राज्य केंद्र',
    voiceSaathi: 'आवाज़ साथी',
    voiceSaathiSub: 'हिंदी में बोलकर पूछें',
    tollFree: 'टोल फ्री हेल्पलाइन',
    callNow: 'कॉल करें',
    whyYouQualify: 'आप क्यों पात्र हैं (3 सीधे मिलान)',
    applyNearestBank: 'निकटतम बैंक से आवेदन करें',
    calculateEmi: 'ईएमआई निकालें',
    offlineBanner: 'ऑफ़लाइन मोड सक्रिय',
    offlineBannerSub: 'कैश की गई योजनाएं और बैंक डेटा सुरक्षित प्रदर्शित हैं।',
    retry: 'पुनः प्रयास करें',
    switchRole: 'भूमिका बदलें',

    schemesTitle: 'स्मार्ट योजना अनुशंसा प्रणाली',
    calculatorTitle: 'वित्तीय ईएमआई कैलकुलेटर',
    locatorTitle: 'भू-स्थानिक भागीदार लोकेटर',
    facilitatorTitle: 'मित्र नोडल कार्यकेंद्र',
    adminTitle: 'एनएसएफडीसी प्रशासन नियंत्रण कक्ष',
    allSchemesLabel: 'सभी योजनाएं',
    termLoansTab: 'सावधि ऋण (TLS)',
    microFinanceTab: 'माइक्रो फाइनेंस (MCF)',
    womenSpecialTab: 'महिला विशेष (MSY)',
    eligibilityMatch: 'पात्रता मिलान',
    interestAnnual: 'ब्याज दर वार्षिक',
    nsfdcShare: 'एनएसएफडीसी अंशदान',
    femaleCoApplicantBenefit: 'महिला सह-आवेदक लाभ',
    femaleCoApplicantTitle: 'महिला समृद्धि योजना (MSY)',
    femaleCoApplicantDesc: 'परिवार की किसी महिला सदस्य को सह-आवेदक बनाकर 50% पूंजीगत सब्सिडी (अधिकतम ₹60,000) तथा मात्र 4.00% वार्षिक रियायती ब्याज दर प्राप्त करें।',
    addCoApplicantBtn: 'महिला सह-आवेदक जोड़ें एवं लाभ पाएं',
    coApplicantActiveBtn: 'सह-आवेदक सक्रिय: 50% सब्सिडी अनलॉक!',
    needHelpChoosing: 'चयन में सहायता चाहिए? टोल-फ्री 1800-11-0396 पर संपर्क करें',
    viewDetailsAndDocs: 'विवरण एवं आवश्यक दस्तावेज़ देखें',
    hideRequiredDocs: 'दस्तावेज़ सूची छिपाएं',
    limitLabel: 'सीमा',
    marginMoneyLabel: 'मार्जिन मनी',
    nilMargin: 'शून्य (0%)',
    financialPlanner: 'वित्तीय योजनाकार',
    financialPlannerSub: 'रियायती ऋण एवं मासिक पुनर्भुगतान अनुसूची की गणना करें',
    estimatedMonthlyRepayment: 'अनुमानित मासिक किस्त (ईएमआई)',
    perMonth: '/ महीना',
    subsidizedRateSaves: 'रियायती दर से कुल बचत',
    vsCommercialBanks: 'व्यावसायिक बैंकों (11.5%) की तुलना में',
    projectInvestmentCost: 'परियोजना निवेश लागत',
    repaymentTenure: 'पुनर्भुगतान अवधि',
    yearsLabel: 'वर्ष',
    monthsLabel: 'माह',
    moratoriumBuffer: 'मोराटोरियम (अधिस्थगन) छूट',
    noneLabel: 'कोई नहीं',
    moratoriumDesc: 'परियोजना स्थापना अवधि के दौरान मूलधन भुगतान स्थगित रहता है। केवल नाममात्र रियायती ब्याज देय होता है।',
    repaymentTrajectory: 'पुनर्भुगतान प्रक्षेपवक्र',
    principalLabel: 'मूलधन',
    interestLabel: 'ब्याज',
    saveAndFindBank: 'सहेजें और निकटतम बैंक खोजें',
    downloadSchedulePdf: 'किस्त अनुसूची पीडीएफ डाउनलोड करें',
    targetedGeography: 'लक्षित भौगोलिक क्षेत्र',
    allChannels: 'सभी चैनल',
    stateSca: 'राज्य एससी निगम (SCA)',
    rrbGraminBank: 'ग्रामीण बैंक (RRB)',
    cooperative: 'सहकारी बैंक',
    radiusLabel: 'दायरा',
    youAreHere: 'आप यहाँ हैं',
    availableChannelPartners: 'उपलब्ध चैनल पार्टनर्स',
    rankedBySpeed: 'स्वीकृति गति, क्षमता एवं निकटता के आधार पर क्रमबद्ध',
    activeGis: 'सक्रिय जीआईएस',
    routeApplicationHere: 'आवेदन यहाँ प्रेषित करें',
    selectChannel: 'चैनल चुनें',
    pausedBadge: 'स्थगित',
    routingPausedTitle: 'रूटिंग स्थगित — नागरिक सुरक्षा सक्रिय',
    routingPausedDesc: 'शाखा एनपीए > 15% होने के कारण आवेदक की स्वीकृति में देरी से बचाव हेतु एनएसएफडीसी एल्गोरिदम द्वारा प्रत्यक्ष रूटिंग अस्थायी रूप से स्थगित की गई है।',
    autoRerouteConfigured: 'यूपीएससीएफडीसी में स्वतः पुनर्निर्देशन कॉन्फ़िगर है',
    offlineHelpdesk: 'ऑफ़लाइन सहायता केंद्र',
    freeAssistance: 'निःशुल्क व्यक्तिगत बायोमेट्रिक एवं आवेदन सहायता',
    englishLabel: 'English',
    hindiLabel: 'हिंदी'
  },
  mr: {
    appName: 'योजना साथी',
    tagline: 'सवलतीच्या कर्जासह स्वप्नांची पूर्तता',
    subTagline: 'योजना साथी • आपल्या प्रगतीचा साथी',
    chooseLang: 'भाषा निवडा / Choose Language',
    quickAccess: 'त्वरित प्रवेश',
    signInSub: 'आधार जोडलेल्या मोबाईलद्वारे लॉगिन करा',
    sendOtp: 'ओटीपी पाठवा',
    otpVerified: 'पडताळणी करा आणि प्रवेश करा',
    continueGuest: 'अतिथी म्हणून योजना पहा',
    assistance: 'मदत व सहाय्य',
    navHome: 'मुख्यपृष्ठ',
    navSchemes: 'योजना',
    navCalculator: 'कॅल्क्युलेटर',
    navLocator: 'लोकेटर',
    portalHeader: 'एनएसएफडीसी पोर्टल',
    citizenDashboard: 'नागरिक मुख्य डॅशबोर्ड',
    greeting: 'नमस्कार, रामेश्वर जी',
    greetingSub: 'आपल्यासाठी निवडक कल्याणकारी योजना',
    searchPlaceholder: 'योजना, सबसिडी किंवा कर्ज शोधा...',
    filterMostMatched: 'सर्वाधिक जुळणाऱ्या',
    filterTermLoans: 'मुदत कर्ज',
    filterMicroCredit: 'मायक्रो क्रेडिट',
    filterWomenQuota: 'महिला कोटा',
    filterSkillLoans: 'कौशल्य कर्ज',
    recommendedForYou: 'आपल्यासाठी शिफारस केलेले',
    recommendedSub: 'जात पडताळणी आणि व्यवसाय प्रोफाइलवर आधारित',
    viewAll: 'सर्व पहा',
    govtSubsidized: 'शासकीय अनुदानित',
    maxFunding: 'कमाल मर्यादा',
    apply: 'अर्ज करा',
    inReviewApp: 'प्रगतीपथावरील अर्ज',
    sanctionRequested: 'मंजुरी विनंती',
    applied: 'अर्ज केला',
    bankVerification: 'बँक पडताळणी',
    corpApproval: 'महामंडळ मंजुरी',
    disbursal: 'वितरण',
    officerVisit: 'अधिकारी भेट २४ ऑक्टोबर रोजी नियोजित',
    trackDetails: 'तपशील ट्रॅक करा',
    citizenServices: 'नागरिक सेवा',
    utilitiesSub: 'स्वयं-सेवा सुविधा',
    findSchemes: 'योजना शोधा',
    findSchemesSub: 'पात्रता मॅचिंग इंजिन',
    emiCalc: 'ईएमआई कॅल्क्युलेटर',
    emiCalcSub: 'सवलतीच्या हप्त्याची गणना',
    channelPartners: 'भागीदार बँका',
    channelPartnersSub: 'बँक आणि केंद्र',
    voiceSaathi: 'आवाज साथी',
    voiceSaathiSub: 'मराठी / हिंदीत विचारा',
    tollFree: 'टोल फ्री हेल्पलाइन',
    callNow: 'कॉल करा',
    whyYouQualify: 'तुम्ही का पात्र आहात (३ थेट निकष)',
    applyNearestBank: 'जवळच्या बँकेत अर्ज करा',
    calculateEmi: 'हप्ता मोजा',
    offlineBanner: 'ऑफलाइन मोड सुरू',
    offlineBannerSub: 'जतन केलेला डेटा दाखवला जात आहे.',
    retry: 'पुन्हा प्रयत्न करा',
    switchRole: 'भूमिका बदला',

    schemesTitle: 'स्मार्ट योजना शिफारस',
    calculatorTitle: 'आर्थिक ईएमआय कॅल्क्युलेटर',
    locatorTitle: 'भौगोलिक भागीदार लोकेटर',
    facilitatorTitle: 'मित्र नोडल कार्यकेंद्र',
    adminTitle: 'एनएसएफडीसी प्रशासन नियंत्रण',
    allSchemesLabel: 'सर्व योजना',
    termLoansTab: 'मुदत कर्ज',
    microFinanceTab: 'मायक्रो फायनान्स',
    womenSpecialTab: 'महिला विशेष',
    eligibilityMatch: 'पात्रता जुळणी',
    interestAnnual: 'वार्षिक व्याज',
    nsfdcShare: 'महामंडळ वाटा',
    femaleCoApplicantBenefit: 'महिला सह-अर्जदार लाभ',
    femaleCoApplicantTitle: 'महिला समृद्धी योजना (MSY)',
    femaleCoApplicantDesc: 'कुटुंबातील महिला सदस्याला सह-अर्जदार करून ५०% भांडवली अनुदान (कमाल ₹६०,०००) आणि फक्त ४% व्याजदर मिळवा.',
    addCoApplicantBtn: 'महिला सह-अर्जदार जोडा',
    coApplicantActiveBtn: 'सह-अर्जदार सक्रिय: ५०% अनुदान अनलॉक!',
    needHelpChoosing: 'मदत हवी आहे? टोल-फ्री १८००-११-०३९६ वर कॉल करा',
    viewDetailsAndDocs: 'तपशील व कागदपत्रे पहा',
    hideRequiredDocs: 'कागदपत्रे लपवा',
    limitLabel: 'मर्यादा',
    marginMoneyLabel: 'मार्जिन रक्कम',
    nilMargin: 'शून्य (०%)',
    financialPlanner: 'आर्थिक नियोजक',
    financialPlannerSub: 'सवलतीचे कर्ज आणि हप्ते मोजा',
    estimatedMonthlyRepayment: 'अंदाजे मासिक हप्ता (EMI)',
    perMonth: '/ महिना',
    subsidizedRateSaves: 'सवलतीच्या दरामुळे होणारी बचत',
    vsCommercialBanks: 'व्यावसायिक बँकांच्या (११.५%) तुलनेत',
    projectInvestmentCost: 'प्रकल्प गुंतवणूक खर्च',
    repaymentTenure: 'परतफेड कालावधी',
    yearsLabel: 'वर्षे',
    monthsLabel: 'महिने',
    moratoriumBuffer: 'सवलत कालावधी (मोराटोरियम)',
    noneLabel: 'काही नाही',
    moratoriumDesc: 'सुरुवातीच्या काळात मुद्दल परतफेड स्थगित राहते. केवळ नाममात्र व्याज आकारले जाते.',
    repaymentTrajectory: 'परतफेड आलेख',
    principalLabel: 'मुद्दल',
    interestLabel: 'व्याज',
    saveAndFindBank: 'जतन करा आणि बँक शोधा',
    downloadSchedulePdf: 'हप्ता पत्रक पीडीएफ डाउनलोड करा',
    targetedGeography: 'लक्षित भौगोलिक क्षेत्र',
    allChannels: 'सर्व माध्यम',
    stateSca: 'राज्य एससी महामंडळ',
    rrbGraminBank: 'ग्रामीण बँक',
    cooperative: 'सहकारी बँक',
    radiusLabel: 'त्रिज्या',
    youAreHere: 'तुम्ही येथे आहात',
    availableChannelPartners: 'उपलब्ध भागीदार बँका',
    rankedBySpeed: 'मंजुरी गती व अंतरावर आधारित',
    activeGis: 'सक्रिय जीआयएस',
    routeApplicationHere: 'अर्ज येथे पाठवा',
    selectChannel: 'चॅनेल निवडा',
    pausedBadge: 'स्थगित',
    routingPausedTitle: 'रूटिंग स्थगित — नागरिक संरक्षण',
    routingPausedDesc: 'शाखा एनपीए > १५% असल्यामुळे अर्जदारांच्या सुरक्षेसाठी थेट पाठवणी तात्पुरती स्थगित केली आहे.',
    autoRerouteConfigured: 'यूपीएससीएफडीसीकडे स्वयंचलित पुनर्निर्देशन',
    offlineHelpdesk: 'ऑफलाइन मदत केंद्र',
    freeAssistance: 'मोफत बायोमेट्रिक व अर्ज मदत',
    englishLabel: 'English',
    hindiLabel: 'हिंदी'
  },
  ta: {
    appName: 'யோஜனா சாதி',
    tagline: 'மானியக் கடன் மூலம் கனவுகளுக்கு விடியல்',
    subTagline: 'யோஜனா சாதி • உங்கள் முன்னேற்றத்தின் தோழன்',
    chooseLang: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    quickAccess: 'விரைவு அணுகல்',
    signInSub: 'ஆதார் இணைக்கப்பட்ட மொபைல் மூலம் உள்நுழைக',
    sendOtp: 'OTP அனுப்பவும்',
    otpVerified: 'சரிபார்த்து தொடரவும்',
    continueGuest: 'விருந்தினராக திட்டங்களை ஆராய்க',
    assistance: 'உதவி மையம்',
    navHome: 'முகப்பு',
    navSchemes: 'திட்டங்கள்',
    navCalculator: 'கணக்கீடு',
    navLocator: 'இருப்பிடம்',
    portalHeader: 'NSFDC போர்டல்',
    citizenDashboard: 'குடிமக்கள் முதன்மை பக்கம்',
    greeting: 'வணக்கம், ராமேஷ்வர்',
    greetingSub: 'உங்களுக்கான சிறப்பு நலத்திட்டங்கள்',
    searchPlaceholder: 'திட்டங்கள், மானியங்கள், கடன்களைத் தேடுங்கள்...',
    filterMostMatched: 'மிகவும் பொருத்தமானவை',
    filterTermLoans: 'நீண்டகால கடன்',
    filterMicroCredit: 'குறுங்கடன்',
    filterWomenQuota: 'மகளிர் திட்டம்',
    filterSkillLoans: 'திறன் கடன்',
    recommendedForYou: 'உங்களுக்கான பரிந்துரைகள்',
    recommendedSub: 'சாதி சரிபார்ப்பு & தொழில் அடிப்படையில்',
    viewAll: 'அனைத்தும்',
    govtSubsidized: 'அரசு மானியம்',
    maxFunding: 'அதிகபட்ச நிதி',
    apply: 'விண்ணப்பிக்க',
    inReviewApp: 'செயல்முறையில் உள்ள விண்ணப்பம்',
    sanctionRequested: 'கோரப்பட்ட ஒப்புதல் தொகை',
    applied: 'விண்ணப்பிக்கப்பட்டது',
    bankVerification: 'வங்கி சரிபார்ப்பு',
    corpApproval: 'வாரிய ஒப்புதல்',
    disbursal: 'நிதி விடுவிப்பு',
    officerVisit: 'அதிகாரி வருகை அக் 24 அன்று',
    trackDetails: 'நிலையை அறிய',
    citizenServices: 'சேவைகள்',
    utilitiesSub: 'சுய சேவை வசதிகள்',
    findSchemes: 'திட்டங்களைக் கண்டறிய',
    findSchemesSub: 'தகுதி பொருத்தம்',
    emiCalc: 'EMI கணக்கீடு',
    emiCalcSub: 'மானியத் தவணைக் கணக்கு',
    channelPartners: 'சேவை வங்கிகள்',
    channelPartnersSub: 'வங்கி & அரசு மையங்கள்',
    voiceSaathi: 'குரல் சாதி',
    voiceSaathiSub: 'குரல் மூலம் உதவி',
    tollFree: 'இலவச உதவி எண்',
    callNow: 'அழைக்க',
    whyYouQualify: 'நீங்கள் ஏன் தகுதியானவர் (3 காரணங்கள்)',
    applyNearestBank: 'அருகிலுள்ள வங்கியில் விண்ணப்பிக்க',
    calculateEmi: 'EMI கணக்கிடுக',
    offlineBanner: 'ஆஃப்லைன் பயன்முறை',
    offlineBannerSub: 'சேமிக்கப்பட்ட திட்டங்கள் காட்டப்படுகின்றன.',
    retry: 'மீண்டும் முயற்சிக்க',
    switchRole: 'பங்கை மாற்றவும்',

    schemesTitle: 'திட்ட பரிந்துரை அமைப்பு',
    calculatorTitle: 'நிதி தவணை கணக்கீடு',
    locatorTitle: 'வங்கி கிளை கண்டறிதல்',
    facilitatorTitle: 'உதவியாளர் பணித்தளம்',
    adminTitle: 'நிர்வாக கட்டுப்பாட்டு மையம்',
    allSchemesLabel: 'அனைத்து திட்டங்கள்',
    termLoansTab: 'நீண்டகால கடன்',
    microFinanceTab: 'குறுங்கடன்',
    womenSpecialTab: 'மகளிர் சிறப்பு',
    eligibilityMatch: 'தகுதி பொருத்தம்',
    interestAnnual: 'ஆண்டு வட்டி',
    nsfdcShare: 'அரசு பங்கு',
    femaleCoApplicantBenefit: 'பெண் இணை விண்ணப்பதாரர் நன்மை',
    femaleCoApplicantTitle: 'மகிளா சம்ரிதி யோஜனா (MSY)',
    femaleCoApplicantDesc: 'பெண் உறுப்பினரை இணைத்து 50% மானியம் (₹60,000 வரை) மற்றும் வெறும் 4% வட்டியில் கடன் பெறவும்.',
    addCoApplicantBtn: 'பெண் இணை விண்ணப்பதாரரை சேர்க்க',
    coApplicantActiveBtn: 'இணை விண்ணப்பதாரர் இணைக்கப்பட்டது!',
    needHelpChoosing: 'உதவி தேவையா? 1800-11-0396 ஐ அழைக்கவும்',
    viewDetailsAndDocs: 'விவரங்கள் மற்றும் ஆவணங்கள்',
    hideRequiredDocs: 'ஆவணங்களை மறைக்க',
    limitLabel: 'வரம்பு',
    marginMoneyLabel: 'விண்ணப்பதாரர் பங்கு',
    nilMargin: 'இல்லை (0%)',
    financialPlanner: 'நிதி திட்டமிடுபவர்',
    financialPlannerSub: 'மானியக் கடன் மற்றும் திருப்பிச் செலுத்தும் கணக்கீடு',
    estimatedMonthlyRepayment: 'மதிப்பிடப்பட்ட மாதத் தவணை',
    perMonth: '/ மாதம்',
    subsidizedRateSaves: 'சேமிக்கப்படும் தொகை',
    vsCommercialBanks: 'வணிக வங்கிகளை விட (11.5%)',
    projectInvestmentCost: 'திட்ட முதலீட்டு செலவு',
    repaymentTenure: 'திருப்பிச் செலுத்தும் காலம்',
    yearsLabel: 'ஆண்டுகள்',
    monthsLabel: 'மாதங்கள்',
    moratoriumBuffer: 'தவணை சலுகை காலம்',
    noneLabel: 'இல்லை',
    moratoriumDesc: 'தொடக்க காலத்தில் அசல் தொகை திருப்பிச் செலுத்த தேவையில்லை. மானிய வட்டி மட்டுமே பொருந்தும்.',
    repaymentTrajectory: 'தவணை பகுப்பாய்வு',
    principalLabel: 'அசல்',
    interestLabel: 'வட்டி',
    saveAndFindBank: 'சேமித்து வங்கியைத் தேடுக',
    downloadSchedulePdf: 'தவணை அட்டவணை PDF பதிவிறக்குக',
    targetedGeography: 'இலக்கு பகுதி',
    allChannels: 'அனைத்து வங்கிகள்',
    stateSca: 'மாநில கழகம்',
    rrbGraminBank: 'கிராம வங்கி',
    cooperative: 'கூட்டுறவு வங்கி',
    radiusLabel: 'சுற்றளவு',
    youAreHere: 'நீங்கள் இங்கு உள்ளீர்கள்',
    availableChannelPartners: 'கிடைக்கும் வங்கிகள்',
    rankedBySpeed: 'வேகம் மற்றும் தூரத்தின் அடிப்படையில்',
    activeGis: 'செயலில் உள்ள வரைபடம்',
    routeApplicationHere: 'விண்ணப்பத்தை இங்கு அனுப்பவும்',
    selectChannel: 'வங்கியைத் தேர்வுசெய்க',
    pausedBadge: 'நிறுத்தப்பட்டது',
    routingPausedTitle: 'வழங்குதல் தற்காலிகமாக நிறுத்தம்',
    routingPausedDesc: 'வாராக்கடன் 15% ஐ தாண்டியுள்ளதால் பயனாளிகளின் நலன் கருதி வழிமாற்றப்பட்டுள்ளது.',
    autoRerouteConfigured: 'UPSCFDC க்கு தானியங்கி வழிமாற்றம்',
    offlineHelpdesk: 'நேரடி உதவி மையம்',
    freeAssistance: 'இலவச பயோமெட்ரிக் மற்றும் விண்ணப்ப உதவி',
    englishLabel: 'English',
    hindiLabel: 'हिंदी'
  }
};

