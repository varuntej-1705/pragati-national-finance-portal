import React, { useState, useRef } from 'react';
import { UserProfile } from '../../types';
import { NSFDC_SCHEMES } from '../../data/schemes';

interface ProfileModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: UserProfile) => void;
}

type WizardStep = 'personal' | 'documents' | 'recommendations';

interface UploadedDoc {
  id: string;
  name: string;
  label: string;
  category: string;
  icon: string;
  required: boolean;
  file: File | null;
  status: 'empty' | 'uploading' | 'scanning' | 'extracted' | 'verified';
  extractedFields?: Record<string, string>;
}

const REQUIRED_DOCUMENTS: Omit<UploadedDoc, 'file' | 'status' | 'extractedFields'>[] = [
  {
    id: 'aadhaar',
    name: 'Aadhaar Card',
    label: 'UIDAI Aadhaar (Front & Back)',
    category: 'Identity & Address Proof',
    icon: 'fingerprint',
    required: true
  },
  {
    id: 'caste-cert',
    name: 'Caste Certificate',
    label: 'SC/ST/OBC Certificate from SDM / Tehsildar',
    category: 'Category Eligibility',
    icon: 'badge',
    required: true
  },
  {
    id: 'income-cert',
    name: 'Income Certificate',
    label: 'Family Income Certificate from Revenue Dept',
    category: 'Means Verification',
    icon: 'currency_rupee',
    required: true
  },
  {
    id: 'bank-passbook',
    name: 'Bank Passbook',
    label: 'Savings Account Passbook (First Page)',
    category: 'DBT Disbursal Account',
    icon: 'account_balance',
    required: true
  },
  {
    id: 'photo',
    name: 'Citizen Photo',
    label: 'Profile Default Option (Auto-linked via UIDAI / Citizen Record)',
    category: 'Profile Default Photo',
    icon: 'account_circle',
    required: true
  },
  {
    id: 'project-report',
    name: 'Project Report / DPR',
    label: 'Detailed Project Report or Admission Letter',
    category: 'Scheme-Specific Prerequisite',
    icon: 'description',
    required: false
  }
];

// Simulated OCR extraction per document type
const OCR_SIMULATION: Record<string, (profile: UserProfile) => Record<string, string>> = {
  'aadhaar': (p) => ({
    'Full Name': p.name || 'Rameshwar Kumar',
    'UID Number': 'XXXX-XXXX-' + Math.floor(1000 + Math.random() * 9000),
    'Date of Birth': '15/08/1986',
    'Address': `${p.location?.district || 'Jaipur'}, ${p.location?.state || 'Rajasthan'} - ${p.location?.pinCode || '302001'}`
  }),
  'caste-cert': (p) => ({
    'Applicant Name': p.name || 'Rameshwar Kumar',
    'Caste Category': p.caste === 'SC' ? 'Scheduled Caste (SC)' : p.caste === 'ST' ? 'Scheduled Tribe (ST)' : p.caste,
    'Issuing Authority': 'Sub-Divisional Magistrate',
    'Certificate No.': 'SDM/CC/' + Math.floor(100000 + Math.random() * 900000)
  }),
  'income-cert': (p) => ({
    'Applicant Name': p.name || 'Rameshwar Kumar',
    'Annual Family Income': `₹${(p.annualIncome || 240000).toLocaleString('en-IN')}`,
    'Below Poverty Line': (p.annualIncome || 240000) <= 300000 ? 'Yes (BPL)' : 'No',
    'Issuing Authority': 'Revenue Department'
  }),
  'bank-passbook': (p) => ({
    'Account Holder': p.name || 'Rameshwar Kumar',
    'Account No.': 'XXXXX' + Math.floor(10000 + Math.random() * 90000),
    'IFSC Code': 'BARB0JAIPUR',
    'Bank Name': 'Bank of Baroda'
  }),
  'photo': (p) => ({
    'Selected Option': 'Profile Default Active',
    'Beneficiary': p.name || 'Rameshwar Kumar',
    'Source': 'Citizen Profile (UIDAI Linked)',
    'Status': 'Verified ✓'
  }),
  'project-report': () => ({
    'Document Type': 'Detailed Project Report',
    'Pages Detected': String(Math.floor(8 + Math.random() * 20)),
    'Status': 'Under Review'
  })
};

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<WizardStep>('personal');
  const [animDir, setAnimDir] = useState<'forward' | 'back'>('forward');

  // Personal details state
  const [name, setName] = useState(profile.name);
  const [caste, setCaste] = useState(profile.caste);
  const [annualIncome, setAnnualIncome] = useState(profile.annualIncome);
  const [projectType, setProjectType] = useState(profile.projectType);
  const [estimatedCost, setEstimatedCost] = useState(profile.estimatedCost);
  const [hasFemaleCoApplicant, setHasFemaleCoApplicant] = useState(profile.hasFemaleCoApplicant);
  const [femaleCoApplicantName, setFemaleCoApplicantName] = useState(profile.femaleCoApplicantName || '');

  // Document state (Profile Default Photo is active by default)
  const [documents, setDocuments] = useState<UploadedDoc[]>(
    REQUIRED_DOCUMENTS.map(d => {
      if (d.id === 'photo') {
        return {
          ...d,
          file: null,
          status: 'verified',
          extractedFields: {
            'Selected Option': 'Profile Default Active',
            'Beneficiary': profile.name || 'Rameshwar Kumar',
            'Source': 'Citizen Profile (UIDAI Linked)',
            'Status': 'Verified ✓'
          }
        };
      }
      return { ...d, file: null, status: 'empty' };
    })
  );
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const projectOptions = [
    'Dairy & Animal Husbandry', 'Agro Processing', 'Handloom & Weaving',
    'Small Manufacturing', 'Commercial Transport', 'Service Enterprise',
    'Food Processing', 'Higher Education', 'E-Rickshaw / EV Fleet'
  ];

  const steps: { id: WizardStep; label: string; icon: string }[] = [
    { id: 'personal', label: 'Personal Details', icon: 'person' },
    { id: 'documents', label: 'Upload Documents', icon: 'upload_file' },
    { id: 'recommendations', label: 'Matched Schemes', icon: 'auto_awesome' }
  ];

  const stepIndex = steps.findIndex(s => s.id === step);

  const goTo = (target: WizardStep) => {
    const targetIdx = steps.findIndex(s => s.id === target);
    setAnimDir(targetIdx > stepIndex ? 'forward' : 'back');
    setStep(target);
  };

  // Simulate file upload + OCR
  const handleFileSelect = (docId: string, file: File) => {
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, file, status: 'uploading' } : d));
    // Simulate upload
    setTimeout(() => {
      setDocuments(prev => prev.map(d => d.id === docId ? { ...d, status: 'scanning' } : d));
      // Simulate OCR scan
      setTimeout(() => {
        const extractor = OCR_SIMULATION[docId];
        const extracted = extractor ? extractor(profile) : { 'Status': 'Scanned' };
        setDocuments(prev => prev.map(d =>
          d.id === docId ? { ...d, status: 'extracted', extractedFields: extracted } : d
        ));
      }, 1200);
    }, 800);
  };

  const verifiedCount = documents.filter(d => d.status === 'extracted' || d.status === 'verified').length;
  const requiredCount = documents.filter(d => d.required).length;
  const requiredVerified = documents.filter(d => d.required && (d.status === 'extracted' || d.status === 'verified')).length;

  // Compute matched schemes
  const matchedSchemes = NSFDC_SCHEMES.filter(s => {
    if (caste === 'SC' || caste === 'ST') return true;
    if (s.eligibilityConditions.targetGroup === 'SC') return false;
    return true;
  }).slice(0, 5);

  const handleFinalSave = () => {
    onSave({
      ...profile,
      name,
      caste,
      annualIncome,
      projectType,
      estimatedCost,
      hasFemaleCoApplicant,
      femaleCoApplicantName: hasFemaleCoApplicant ? femaleCoApplicantName : undefined
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="profile-wizard-modal"
        onClick={e => e.stopPropagation()}
      >
        {/* ═══ Official Government Header Strip ═══ */}
        <div className="wizard-govt-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <span className="material-symbols-outlined text-amber-300 text-[24px]">account_balance</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-300/90 tracking-widest uppercase">
                  भारत सरकार • GOVT OF INDIA
                </span>
              </div>
              <h3 className="text-[15px] font-bold text-white font-heading tracking-tight leading-tight mt-0.5">
                Citizen Verification Portal
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all border border-white/15"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
          {/* Tricolor Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
        </div>

        {/* ═══ Step Progress Indicator ═══ */}
        <div className="wizard-progress-bar">
          {steps.map((s, i) => {
            const isActive = i === stepIndex;
            const isCompleted = i < stepIndex;
            return (
              <React.Fragment key={s.id}>
                <button
                  onClick={() => i <= stepIndex && goTo(s.id)}
                  className={`wizard-step-indicator ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                >
                  <div className={`wizard-step-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                    {isCompleted ? (
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    ) : (
                      <span className="material-symbols-outlined text-[16px]">{s.icon}</span>
                    )}
                  </div>
                  <span className="wizard-step-label">{s.label}</span>
                </button>
                {i < steps.length - 1 && (
                  <div className={`wizard-step-connector ${isCompleted ? 'completed' : ''}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ═══ Step Content Area ═══ */}
        <div className="wizard-content-area">
          {/* ── STEP 1: Personal Details ── */}
          {step === 'personal' && (
            <div className={`wizard-step-content ${animDir === 'forward' ? 'slide-in-right' : 'slide-in-left'}`}>
              <div className="wizard-section-header">
                <span className="material-symbols-outlined text-[20px] text-[#0037b0]">person</span>
                <div>
                  <h4 className="text-sm font-bold text-[#191c1e] font-heading">Applicant Personal Information</h4>
                  <p className="text-[11px] text-[#565e74]">As per Aadhaar / Government Records</p>
                </div>
              </div>

              <div className="wizard-form-grid">
                {/* Name */}
                <div className="wizard-field full-width">
                  <label className="wizard-label">
                    <span className="material-symbols-outlined text-[14px]">badge</span>
                    Full Name (as per Aadhaar)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="wizard-input"
                    required
                  />
                </div>

                {/* Caste Category */}
                <div className="wizard-field">
                  <label className="wizard-label">
                    <span className="material-symbols-outlined text-[14px]">groups</span>
                    Social Category
                  </label>
                  <select
                    value={caste}
                    onChange={e => setCaste(e.target.value as any)}
                    className="wizard-input"
                  >
                    <option value="SC">Scheduled Caste (SC)</option>
                    <option value="ST">Scheduled Tribe (ST)</option>
                    <option value="OBC">Other Backward Class (OBC)</option>
                    <option value="General">General Category</option>
                  </select>
                </div>

                {/* Annual Income */}
                <div className="wizard-field">
                  <label className="wizard-label">
                    <span className="material-symbols-outlined text-[14px]">currency_rupee</span>
                    Annual Family Income
                    <span className="ml-auto text-[10px] text-[#0037b0] font-bold">
                      ₹{(annualIncome / 100000).toFixed(2)}L
                    </span>
                  </label>
                  <input
                    type="range"
                    min={50000}
                    max={600000}
                    step={20000}
                    value={annualIncome}
                    onChange={e => setAnnualIncome(Number(e.target.value))}
                    className="wizard-range"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    *NSFDC eligibility: ≤ ₹3.00 Lakh (₹5.00 Lakh for education schemes)
                  </span>
                </div>

                {/* Project Type */}
                <div className="wizard-field">
                  <label className="wizard-label">
                    <span className="material-symbols-outlined text-[14px]">business_center</span>
                    Project / Enterprise Goal
                  </label>
                  <select
                    value={projectType}
                    onChange={e => setProjectType(e.target.value)}
                    className="wizard-input"
                  >
                    {projectOptions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                {/* Estimated Cost */}
                <div className="wizard-field">
                  <label className="wizard-label">
                    <span className="material-symbols-outlined text-[14px]">payments</span>
                    Estimated Project Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={e => setEstimatedCost(Number(e.target.value))}
                    step={25000}
                    className="wizard-input"
                    required
                  />
                </div>

                {/* Female Co-Applicant */}
                <div className="wizard-field full-width">
                  <div className="wizard-highlight-box">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#0037b0]">female</span>
                        <span className="text-xs font-bold text-[#0037b0]">Nominate Female Co-Applicant</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={hasFemaleCoApplicant}
                        onChange={e => setHasFemaleCoApplicant(e.target.checked)}
                        className="w-4 h-4 accent-[#0037b0] rounded"
                      />
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Unlocks 50% Capital Subsidy (up to ₹60,000) under Mahila Samriddhi Yojana
                    </p>
                    {hasFemaleCoApplicant && (
                      <input
                        type="text"
                        placeholder="Female Co-applicant Full Name"
                        value={femaleCoApplicantName}
                        onChange={e => setFemaleCoApplicantName(e.target.value)}
                        className="wizard-input mt-2"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Next Button */}
              <div className="wizard-actions">
                <button onClick={onClose} className="wizard-btn-secondary">Cancel</button>
                <button onClick={() => goTo('documents')} className="wizard-btn-primary">
                  <span>Continue to Documents</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Document Upload & OCR ── */}
          {step === 'documents' && (
            <div className={`wizard-step-content ${animDir === 'forward' ? 'slide-in-right' : 'slide-in-left'}`}>
              <div className="wizard-section-header">
                <span className="material-symbols-outlined text-[20px] text-[#0037b0]">upload_file</span>
                <div>
                  <h4 className="text-sm font-bold text-[#191c1e] font-heading">
                    Mandatory Document Verification
                  </h4>
                  <p className="text-[11px] text-[#565e74]">
                    Upload certificates as per NSFDC Official Checklist • AI-powered OCR auto-extraction
                  </p>
                </div>
              </div>

              {/* Upload Progress Summary */}
              <div className="wizard-upload-summary">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#191c1e]">
                    Verification Progress
                  </span>
                  <span className="text-xs font-bold text-[#0037b0]">
                    {verifiedCount}/{documents.length} Uploaded
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0037b0] to-[#1d4ed8] transition-all duration-500"
                    style={{ width: `${(verifiedCount / documents.length) * 100}%` }}
                  />
                </div>
                {requiredVerified < requiredCount && (
                  <p className="text-[10px] text-amber-700 mt-1.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">info</span>
                    {requiredCount - requiredVerified} mandatory document(s) remaining
                  </p>
                )}
              </div>

              {/* Document Cards List */}
              <div className="wizard-doc-list">
                {documents.map(doc => (
                  <div key={doc.id} className={`wizard-doc-card ${doc.status !== 'empty' ? 'uploaded' : ''}`}>
                    <input
                      ref={el => { fileInputRefs.current[doc.id] = el; }}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={e => {
                        const f = e.target.files?.[0];
                        if (f) handleFileSelect(doc.id, f);
                      }}
                    />

                    <div className="flex items-start gap-3 w-full">
                      {/* Icon */}
                      <div className={`wizard-doc-icon ${
                        doc.status === 'extracted' || doc.status === 'verified' ? 'success' :
                        doc.status === 'uploading' || doc.status === 'scanning' ? 'processing' : ''
                      }`}>
                        {doc.status === 'uploading' || doc.status === 'scanning' ? (
                          <div className="w-5 h-5 rounded-full border-2 border-[#0037b0] border-t-transparent animate-spin" />
                        ) : doc.status === 'extracted' || doc.status === 'verified' ? (
                          <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        ) : (
                          <span className="material-symbols-outlined text-[18px]">{doc.icon}</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-[#191c1e] truncate">{doc.name}</p>
                          {doc.required && (
                            <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full border border-red-200 shrink-0">
                              MANDATORY
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#565e74] truncate">{doc.label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{doc.category}</p>

                        {/* Scanning Status */}
                        {doc.status === 'scanning' && (
                          <div className="mt-2 p-2 rounded-lg bg-blue-50 border border-blue-100">
                            <p className="text-[10px] font-bold text-[#0037b0] flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px] animate-pulse">document_scanner</span>
                              AI OCR Scanning... Extracting Data
                            </p>
                          </div>
                        )}

                        {/* Extracted OCR Data / Profile Default Details */}
                        {(doc.status === 'extracted' || doc.status === 'verified') && doc.extractedFields && (
                          <div className={`mt-2 p-2.5 rounded-xl border ${
                            doc.id === 'photo' 
                              ? 'bg-blue-50/80 border-blue-200/70' 
                              : 'bg-emerald-50/80 border-emerald-200/60'
                          }`}>
                            <p className={`text-[9px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1 ${
                              doc.id === 'photo' ? 'text-[#0037b0]' : 'text-emerald-800'
                            }`}>
                              <span className="material-symbols-outlined text-[11px]">
                                {doc.id === 'photo' ? 'account_circle' : 'check_circle'}
                              </span>
                              {doc.id === 'photo' ? 'Profile Default Option Linked' : 'OCR Data Extracted'}
                            </p>
                            <div className="grid grid-cols-2 gap-1.5">
                              {Object.entries(doc.extractedFields).map(([k, v]) => (
                                <div key={k} className="p-1.5 rounded-lg bg-white border border-slate-200/60">
                                  <span className="text-[9px] text-slate-400 block">{k}</span>
                                  <span className="text-[11px] font-bold text-slate-800 truncate block">{v}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Upload Button or Status */}
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        {doc.id === 'photo' ? (
                          <div className="flex flex-col items-end gap-1">
                            <span className="wizard-status-badge success">
                              <span className="material-symbols-outlined text-[12px] text-emerald-600">verified</span>
                              Profile Default
                            </span>
                            <button
                              onClick={() => fileInputRefs.current[doc.id]?.click()}
                              className="text-[10px] text-[#0037b0] hover:underline font-bold"
                            >
                              Change Photo
                            </button>
                          </div>
                        ) : doc.status === 'empty' ? (
                          <button
                            onClick={() => fileInputRefs.current[doc.id]?.click()}
                            className="wizard-upload-btn"
                          >
                            <span className="material-symbols-outlined text-[14px]">cloud_upload</span>
                            Upload
                          </button>
                        ) : doc.status === 'extracted' || doc.status === 'verified' ? (
                          <span className="wizard-status-badge success">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            Verified
                          </span>
                        ) : (
                          <span className="wizard-status-badge processing">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0037b0] animate-pulse" />
                            Processing
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick DigiLocker Sync */}
              <button
                onClick={() => {
                  setDocuments(prev => prev.map(d => ({
                    ...d,
                    status: 'extracted',
                    extractedFields: OCR_SIMULATION[d.id] ? OCR_SIMULATION[d.id](profile) : { 'Status': 'Synced' }
                  })));
                }}
                className="wizard-digilocker-btn"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <div className="text-left">
                  <span className="text-xs font-bold block">Sync via DigiLocker</span>
                  <span className="text-[10px] opacity-80">Auto-fetch all certified documents instantly</span>
                </div>
                <span className="material-symbols-outlined text-[16px] ml-auto">arrow_forward</span>
              </button>

              {/* Actions */}
              <div className="wizard-actions">
                <button onClick={() => goTo('personal')} className="wizard-btn-secondary">
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  Back
                </button>
                <button
                  onClick={() => goTo('recommendations')}
                  disabled={requiredVerified < requiredCount}
                  className="wizard-btn-primary"
                >
                  <span>View Matched Schemes</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Scheme Recommendations ── */}
          {step === 'recommendations' && (
            <div className={`wizard-step-content ${animDir === 'forward' ? 'slide-in-right' : 'slide-in-left'}`}>
              <div className="wizard-section-header">
                <span className="material-symbols-outlined text-[20px] text-emerald-600">auto_awesome</span>
                <div>
                  <h4 className="text-sm font-bold text-[#191c1e] font-heading">
                    AI-Matched Scheme Recommendations
                  </h4>
                  <p className="text-[11px] text-[#565e74]">
                    Based on your verified documents & profile • {verifiedCount} documents processed
                  </p>
                </div>
              </div>

              {/* Verification Summary Card */}
              <div className="wizard-verified-summary">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <span className="material-symbols-outlined text-[26px]">verified_user</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#191c1e] font-heading">Profile Verified</p>
                    <p className="text-[11px] text-[#565e74]">
                      {name} • {caste} Category • ₹{(annualIncome / 100000).toFixed(2)}L Income
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-center border border-emerald-100">
                    <span className="text-lg font-bold text-emerald-700 font-heading">{verifiedCount}</span>
                    <p className="text-[9px] text-emerald-600 font-medium">Docs Verified</p>
                  </div>
                  <div className="p-2 rounded-xl bg-blue-50 text-center border border-blue-100">
                    <span className="text-lg font-bold text-[#0037b0] font-heading">{matchedSchemes.length}</span>
                    <p className="text-[9px] text-[#0037b0] font-medium">Schemes Matched</p>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50 text-center border border-amber-100">
                    <span className="text-lg font-bold text-amber-700 font-heading">
                      ₹{(matchedSchemes.reduce((s, x) => s + x.maxFunding, 0) / 100000).toFixed(0)}L
                    </span>
                    <p className="text-[9px] text-amber-600 font-medium">Max Benefit</p>
                  </div>
                </div>
              </div>

              {/* Matched Schemes List */}
              <div className="wizard-scheme-list">
                {matchedSchemes.map((s, i) => {
                  const score = Math.max(78, 98 - i * 4);
                  return (
                    <div key={s.id} className="wizard-scheme-card">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0037b0] to-[#1d4ed8] flex items-center justify-center text-white shrink-0 shadow-sm">
                          <span className="text-sm font-bold font-heading">#{i + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              score >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-[#0037b0]'
                            }`}>
                              {score}% Match
                            </span>
                            <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">
                              {s.categoryLabel}
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-[#191c1e] leading-snug">{s.name}</h5>
                          <p className="text-[10px] text-[#565e74] mt-0.5 line-clamp-2">{s.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-[10px]">
                            <span className="flex items-center gap-0.5 font-bold text-[#0037b0]">
                              <span className="material-symbols-outlined text-[12px]">payments</span>
                              Max ₹{(s.maxFunding / 100000).toFixed(1)}L
                            </span>
                            {s.interestRate !== null && (
                              <span className="flex items-center gap-0.5 font-bold text-emerald-700">
                                <span className="material-symbols-outlined text-[12px]">percent</span>
                                {s.interestRate}% p.a.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Final Actions */}
              <div className="wizard-actions">
                <button onClick={() => goTo('documents')} className="wizard-btn-secondary">
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  Back
                </button>
                <button onClick={handleFinalSave} className="wizard-btn-primary success">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Save & Apply</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
