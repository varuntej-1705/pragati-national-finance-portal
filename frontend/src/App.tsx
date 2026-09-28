import React, { useState, useEffect } from 'react';
import { UserRole, Language, UserProfile, ApplicationTrackerItem, ChannelPartner } from './types';
import { TRANSLATIONS } from './i18n/translations';
import { Header } from './components/common/Header';
import { BottomNav, TabId } from './components/common/BottomNav';
import { Sidebar } from './components/common/Sidebar';
import { OfflineBanner } from './components/common/OfflineBanner';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { LandingPage } from './components/citizen/LandingPage';
import { LoginScreen } from './components/citizen/LoginScreen';
import { CitizenDashboard } from './components/citizen/CitizenDashboard';
import { SchemeRecommender } from './components/citizen/SchemeRecommender';
import { FinancialCalculator } from './components/citizen/FinancialCalculator';
import { PartnerLocator } from './components/citizen/PartnerLocator';
import { ProfileModal } from './components/citizen/ProfileModal';
import { ApplicationTrackerModal } from './components/citizen/ApplicationTrackerModal';
import { VoiceAssistantModal } from './components/citizen/VoiceAssistantModal';
import { DocumentWalletModal } from './components/citizen/DocumentWalletModal';
import { FacilitatorDashboard } from './components/facilitator/FacilitatorDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { IntroSequence } from './components/intro/IntroSequence';
import { TEAM } from './config/team';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [role, setRole] = useState<UserRole>('citizen');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authScreen, setAuthScreen] = useState<'landing' | 'login'>('landing');
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // SIH 2026 Presentation View ('team' | 'ps' | null; opened on-demand from Landing Page)
  const [introModalView, setIntroModalView] = useState<'team' | 'ps' | null>(null);

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAppTrackerOpen, setIsAppTrackerOpen] = useState(false);
  const [isVoiceSaathiOpen, setIsVoiceSaathiOpen] = useState(false);
  const [isDocWalletOpen, setIsDocWalletOpen] = useState(false);

  // Preselected scheme for calculator
  const [preselectedSchemeId, setPreselectedSchemeId] = useState<string>('scheme-tls');

  // Citizen Profile
  const [profile, setProfile] = useState<UserProfile>({
    id: 'user-varun-01',
    name: 'Varun',
    phone: '9959999429',
    role: 'citizen',
    caste: 'SC',
    isCasteVerified: true,
    annualIncome: 240000,
    isIncomeVerified: true,
    location: {
      tehsil: 'Mohanlalganj',
      district: 'Lucknow',
      state: 'Uttar Pradesh',
      pinCode: '226301'
    },
    projectType: 'Dairy & Animal Husbandry',
    estimatedCost: 350000,
    educationStatus: 'Intermediate',
    hasFemaleCoApplicant: false
  });

  // Citizen Active Application
  const [application, setApplication] = useState<ApplicationTrackerItem>({
    id: 'app-ns-8902',
    refNumber: 'Ref #NS-2024-8902',
    schemeTitle: 'Dairy Farm Expansion Scheme (TLS)',
    channelPartnerName: 'Bank of Baroda • Uttar Pradesh Gramin Branch',
    requestedAmount: 850000,
    appliedDate: '12 Oct 2024',
    currentStep: 2,
    stepLabel: 'Bank Verification',
    stepSublabel: 'Pending Field Visit',
    officerVisitDate: '24 Oct 2024 at 11:30 AM',
    status: 'in_progress',
    timeline: [
      {
        title: 'Application Submitted Online',
        date: '12 Oct 2024, 03:45 PM',
        completed: true,
        note: 'Aadhaar e-KYC and DigiLocker Caste certificate authenticated.'
      },
      {
        title: 'Bank Verification & Field Inspection',
        date: 'Scheduled: 24 Oct 2024',
        completed: false,
        active: true,
        note: 'Field Officer Shri R.K. Mishra assigned for on-site livestock assessment.'
      },
      {
        title: 'State SCA / Corp Credit Sanction',
        date: 'Estimated: 29 Oct 2024',
        completed: false,
        note: 'Formal subsidy approval & margin money validation.'
      },
      {
        title: 'Direct DBT Loan Disbursal',
        date: 'Estimated: 04 Nov 2024',
        completed: false,
        note: 'Direct credit to citizen account with 6-month moratorium buffer.'
      }
    ]
  });

  const [scrollProgress, setScrollProgress] = useState(0);

  // Detect PWA standalone mode
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true;
    if (isStandalone) {
      document.body.classList.add('pwa-standalone');
    }
  }, []);

  // Listen to scroll for progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen to network status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOffline(!navigator.onLine);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleLoginSuccess = (assignedRole: UserRole, phone: string) => {
    setRole(assignedRole);
    setIsAuthenticated(true);
    setActiveTab('home');
    setProfile(prev => ({
      ...prev,
      name: 'Varun',
      phone: phone || '9959999429',
      role: assignedRole
    }));
    showToast(`Welcome! Signed in as ${assignedRole.toUpperCase()}.`, 'success');
  };

  const handleContinueAsGuest = () => {
    setRole('guest');
    setIsAuthenticated(true);
    showToast('Browsing as Guest. Recommendations and calculator active.', 'info');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole('citizen');
    setActiveTab('home');
    showToast('Signed out successfully.', 'info');
  };

  const handleSelectSchemeForEmi = (schemeId: string) => {
    setPreselectedSchemeId(schemeId);
    setActiveTab('calculator');
  };

  const handleSelectSchemeForLocator = (schemeId: string) => {
    setPreselectedSchemeId(schemeId);
    setActiveTab('locator');
  };

  const handleSaveAndFindBank = (schemeType: string, amount: number) => {
    setProfile(prev => ({ ...prev, estimatedCost: amount }));
    setActiveTab('locator');
  };

  const handlePartnerRoute = (partner: ChannelPartner) => {
    setApplication(prev => ({
      ...prev,
      channelPartnerName: partner.name,
      timeline: [
        ...prev.timeline,
        {
          title: `Routed to ${partner.name}`,
          date: 'Just now',
          completed: true,
          note: `Selected via Geo-Spatial Partner Locator (TAT: ${partner.turnaroundDays}d).`
        }
      ]
    }));
    showToast(`Application successfully routed to ${partner.name}.`, 'success');
    setIsAppTrackerOpen(true);
  };

  const handleAddCoApplicant = () => {
    setProfile(prev => {
      const next = !prev.hasFemaleCoApplicant;
      showToast(
        next
          ? 'Female Co-Applicant added: 50% Capital Subsidy under MSY Unlocked!'
          : 'Female Co-Applicant nomination removed.',
        'success'
      );
      return {
        ...prev,
        hasFemaleCoApplicant: next,
        femaleCoApplicantName: next ? 'Savitri Devi' : undefined
      };
    });
  };

  // ── SIH 2026 Presentation View (Opened on-demand from Landing Page via "Our Team" or "Our PS") ──
  if (introModalView) {
    return (
      <IntroSequence
        key={introModalView}
        initialTab={introModalView}
        language={language}
        onLanguageChange={setLanguage}
        onComplete={() => setIntroModalView(null)}
        onCloseStandalone={() => setIntroModalView(null)}
      />
    );
  }

  // ── Unauthenticated Flow (Landing Page -> Login Screen) ──
  if (!isAuthenticated && role !== 'guest') {
    if (authScreen === 'landing') {
      return (
        <div className="w-full min-h-screen min-h-[100dvh] flex flex-col bg-[#06183d] overflow-x-hidden">
          <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
          <LandingPage
            language={language}
            onLanguageChange={setLanguage}
            onOpenLogin={() => setAuthScreen('login')}
            onContinueAsGuest={handleContinueAsGuest}
            onOpenAssistance={() => setIsVoiceSaathiOpen(true)}
            onQuickRoleSelect={handleLoginSuccess}
            onOpenTeam={() => setIntroModalView('team')}
            onOpenPS={() => setIntroModalView('ps')}
          />
          <VoiceAssistantModal
            isOpen={isVoiceSaathiOpen}
            onClose={() => setIsVoiceSaathiOpen(false)}
            language={language}
          />
        </div>
      );
    }

    return (
      <div className="w-full min-h-screen min-h-[100dvh] flex flex-col bg-[#f7f9fb] overflow-x-hidden">
        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
        <LoginScreen
          language={language}
          onLanguageChange={setLanguage}
          onLoginSuccess={handleLoginSuccess}
          onContinueAsGuest={handleContinueAsGuest}
          onOpenAssistance={() => setIsVoiceSaathiOpen(true)}
          onBackToLanding={() => setAuthScreen('landing')}
        />
        <VoiceAssistantModal
          isOpen={isVoiceSaathiOpen}
          onClose={() => setIsVoiceSaathiOpen(false)}
          language={language}
        />
      </div>
    );
  }

  // ── Titles ──
  const currentT = TRANSLATIONS[language];
  const tabTitles: Record<TabId, string> = {
    home: currentT.citizenDashboard,
    schemes: currentT.schemesTitle,
    calculator: currentT.calculatorTitle,
    locator: currentT.locatorTitle
  };

  const headerTitle =
    role === 'facilitator'
      ? currentT.facilitatorTitle
      : role === 'admin'
      ? currentT.adminTitle
      : tabTitles[activeTab];

  // ── Determine if citizen/guest view needs bottom nav ──
  const showBottomNav = role === 'citizen' || role === 'guest';

  return (
    <div className="app-shell relative">
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-amber-400 via-[#0037b0] to-emerald-500 z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Desktop Sidebar */}
      <Sidebar
        role={role}
        activeTab={activeTab}
        language={language}
        profile={profile}
        onTabChange={setActiveTab}
        onRoleChange={(newRole) => {
          setRole(newRole);
          setActiveTab('home');
          showToast(`Switched view to ${newRole.toUpperCase()}.`, 'info');
        }}
        onLogout={handleLogout}
        onProfileClick={() => setIsProfileModalOpen(true)}
      />

      {/* Main content */}
      <div className="app-main">
        {/* Header */}
        <Header
          title={headerTitle}
          role={role}
          language={language}
          onLanguageChange={setLanguage}
          onRoleChange={newRole => {
            setRole(newRole);
            setActiveTab('home');
            showToast(`Switched view to ${newRole.toUpperCase()}.`, 'info');
          }}
          onProfileClick={() => setIsProfileModalOpen(true)}
          onNotificationsClick={() => setIsAppTrackerOpen(true)}
          isOffline={isOffline}
          onToggleOffline={() => {
            setIsOffline(!isOffline);
            showToast(!isOffline ? 'Simulated offline mode enabled.' : 'Online connection restored.', 'info');
          }}
        />

        {/* Offline Banner */}
        <OfflineBanner
          isOffline={isOffline}
          onRetry={() => {
            setIsOffline(false);
            showToast('Sync completed. Schemes and partner data up to date.', 'success');
          }}
          language={language}
        />

        {/* Content Area */}
        <main className="content-container">
          {/* Role: Facilitator Dashboard */}
          {role === 'facilitator' && (
            <FacilitatorDashboard language={language} onShowToast={showToast} />
          )}

          {/* Role: Admin Dashboard */}
          {role === 'admin' && (
            <AdminDashboard language={language} onShowToast={showToast} />
          )}

          {/* Role: Citizen or Guest */}
          {(role === 'citizen' || role === 'guest') && (
            <>
              {activeTab === 'home' && (
                <CitizenDashboard
                  language={language}
                  profile={profile}
                  application={application}
                  onNavigateTab={setActiveTab}
                  onOpenVoiceSaathi={() => setIsVoiceSaathiOpen(true)}
                  onOpenAppTracker={() => setIsAppTrackerOpen(true)}
                  onEditProfile={() => setIsProfileModalOpen(true)}
                  onSelectSchemeForEmi={handleSelectSchemeForEmi}
                />
              )}

              {activeTab === 'schemes' && (
                <SchemeRecommender
                  language={language}
                  profile={profile}
                  onOpenProfileFilter={() => setIsProfileModalOpen(true)}
                  onSelectSchemeForEmi={handleSelectSchemeForEmi}
                  onSelectSchemeForLocator={handleSelectSchemeForLocator}
                  onAddCoApplicant={handleAddCoApplicant}
                />
              )}

              {activeTab === 'calculator' && (
                <FinancialCalculator
                  language={language}
                  profile={profile}
                  preselectedSchemeId={preselectedSchemeId}
                  onSaveAndFindBank={handleSaveAndFindBank}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'locator' && (
                <PartnerLocator
                  language={language}
                  onSelectPartner={handlePartnerRoute}
                  onShowToast={showToast}
                />
              )}
            </>
          )}
        </main>

        {/* Mobile Bottom Nav */}
        {showBottomNav && (
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} language={language} />
        )}
      </div>

      {/* ── Modals ── */}
      <ProfileModal
        profile={profile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={updated => {
          setProfile(updated);
          showToast('Profile updated. Eligibility scores recalculated.', 'success');
        }}
      />

      <ApplicationTrackerModal
        application={application}
        isOpen={isAppTrackerOpen}
        onClose={() => setIsAppTrackerOpen(false)}
        onShowToast={showToast}
      />

      <VoiceAssistantModal
        isOpen={isVoiceSaathiOpen}
        onClose={() => setIsVoiceSaathiOpen(false)}
        language={language}
      />

      <DocumentWalletModal
        profile={profile}
        isOpen={isDocWalletOpen}
        onClose={() => setIsDocWalletOpen(false)}
        onShowToast={showToast}
      />
    </div>
  );
}
