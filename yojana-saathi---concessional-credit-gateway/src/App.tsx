import React, { useState, useEffect } from 'react';
import { UserRole, Language, UserProfile, ApplicationTrackerItem, ChannelPartner } from './types';
import { TRANSLATIONS } from './i18n/translations';
import { Header } from './components/common/Header';
import { BottomNav, TabId } from './components/common/BottomNav';
import { OfflineBanner } from './components/common/OfflineBanner';
import { ToastContainer, ToastMessage } from './components/common/Toast';
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

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [role, setRole] = useState<UserRole>('citizen');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // start in citizen dashboard so user immediately sees UI
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAppTrackerOpen, setIsAppTrackerOpen] = useState(false);
  const [isVoiceSaathiOpen, setIsVoiceSaathiOpen] = useState(false);
  const [isDocWalletOpen, setIsDocWalletOpen] = useState(false);

  // Preselected scheme for calculator
  const [preselectedSchemeId, setPreselectedSchemeId] = useState<string>('scheme-tls');

  // Citizen Profile
  const [profile, setProfile] = useState<UserProfile>({
    id: 'user-rameshwar-01',
    name: 'Rameshwar Kumar',
    phone: '9876543210',
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

  // Listen to network status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
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
    setProfile(prev => ({ ...prev, phone, role: assignedRole }));
    showToast(`Welcome! Signed in as ${assignedRole.toUpperCase()}.`, 'success');
  };

  const handleContinueAsGuest = () => {
    setRole('guest');
    setIsAuthenticated(true);
    showToast('Browsing as Guest. Recommendations and calculator active.', 'info');
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

  // If user is logged out (e.g. initial launch view), show Login screen
  if (!isAuthenticated && role !== 'guest') {
    return (
      <div className="min-h-screen bg-[#f7f9fb]">
        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
        <LoginScreen
          language={language}
          onLanguageChange={setLanguage}
          onLoginSuccess={handleLoginSuccess}
          onContinueAsGuest={handleContinueAsGuest}
          onOpenAssistance={() => setIsVoiceSaathiOpen(true)}
        />
        {/* Modals available from login */}
        <VoiceAssistantModal
          isOpen={isVoiceSaathiOpen}
          onClose={() => setIsVoiceSaathiOpen(false)}
          language={language}
        />
      </div>
    );
  }

  // Titles for each view dynamically derived from TRANSLATIONS
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

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col antialiased">
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Persistent App Header */}
      <Header
        title={headerTitle}
        role={role}
        language={language}
        onLanguageChange={setLanguage}
        onRoleChange={newRole => {
          setRole(newRole);
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

      {/* Persistent Offline Banner */}
      <OfflineBanner
        isOffline={isOffline}
        onRetry={() => {
          setIsOffline(false);
          showToast('Sync completed. Schemes and partner data up to date.', 'success');
        }}
        language={language}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-xl mx-auto flex flex-col">
        {/* Role: Facilitator Web Dashboard */}
        {role === 'facilitator' && (
          <FacilitatorDashboard language={language} onShowToast={showToast} />
        )}

        {/* Role: Admin Web Dashboard */}
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

            {/* Bottom Nav */}
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} language={language} />
          </>
        )}
      </main>

      {/* Modals */}
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
