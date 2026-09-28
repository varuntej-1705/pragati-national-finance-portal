import React, { useState } from 'react';
import { Language, ChannelPartner, ChannelType } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { CHANNEL_PARTNERS, OFFLINE_HELPDESK } from '../../data/partners';

interface PartnerLocatorProps {
  language: Language;
  onSelectPartner: (partner: ChannelPartner) => void;
  onShowToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export const PartnerLocator: React.FC<PartnerLocatorProps> = ({
  language,
  onSelectPartner,
  onShowToast
}) => {
  const t = TRANSLATIONS[language];
  const [selectedFilter, setSelectedFilter] = useState<'all' | ChannelType>('all');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('partner-upscfdc');
  const [currentPinCode, setCurrentPinCode] = useState('226301');
  const [locationName, setLocationName] = useState('Mohanlalganj, Lucknow (PIN: 226301)');
  const [isEditingLoc, setIsEditingLoc] = useState(false);
  const [isSpinningGps, setIsSpinningGps] = useState(false);
  const [directionsModalPartner, setDirectionsModalPartner] = useState<ChannelPartner | null>(null);

  const handleRecenterGps = () => {
    setIsSpinningGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setIsSpinningGps(false);
          setLocationName(`Current GPS: ${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}`);
          onShowToast('GPS Location calibrated. Displaying closest channel partners.', 'info');
        },
        () => {
          setIsSpinningGps(false);
          setLocationName('Mohanlalganj, Lucknow (PIN: 226301)');
          onShowToast('GPS permission denied. Using verified Mohanlalganj district center.', 'info');
        },
        { timeout: 5000 }
      );
    } else {
      setTimeout(() => setIsSpinningGps(false), 600);
    }
  };

  const filteredPartners = CHANNEL_PARTNERS.filter(p => {
    if (selectedFilter === 'all') return true;
    return p.type === selectedFilter;
  });

  const handleRouteApplication = (partner: ChannelPartner) => {
    if (partner.status === 'paused') {
      onShowToast(
        'Direct routing paused for this branch to protect your sanction speed. Rerouting to UPSCFDC Nodal Hub.',
        'error'
      );
      return;
    }
    onSelectPartner(partner);
    onShowToast(`Application allocated to ${partner.name}. Tracking ref generated.`, 'success');
  };

  return (
    <div className="flex flex-col w-full px-5 pb-28 pt-2 gap-4">
      {/* Top Location Selector Bar (Image 9) */}
      <div className="w-full bg-white rounded-full p-1.5 pl-4 shadow-sm flex items-center justify-between border border-slate-100">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="material-symbols-outlined text-[#0037b0] text-[22px] shrink-0">
            my_location
          </span>
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-[10px] font-bold text-[#565e74] uppercase tracking-wider">
              Targeted Geography
            </span>
            {isEditingLoc ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={currentPinCode}
                  onChange={e => setCurrentPinCode(e.target.value.slice(0, 6))}
                  className="w-24 text-xs font-bold border-b border-blue-500 focus:outline-none"
                  placeholder="PIN code"
                />
                <button
                  onClick={() => {
                    setLocationName(`District Hub (PIN: ${currentPinCode})`);
                    setIsEditingLoc(false);
                  }}
                  className="text-[10px] text-blue-600 font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <span
                onClick={() => setIsEditingLoc(true)}
                className="text-xs font-bold text-[#191c1e] truncate cursor-pointer hover:underline"
              >
                {locationName}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleRecenterGps}
          aria-label="Recenter GPS"
          title="Calibrate GPS location"
          className="w-10 h-10 rounded-full bg-[#eceef0] flex items-center justify-center text-[#191c1e] hover:bg-[#dae2fd] transition-colors shrink-0 active:scale-95"
        >
          <span
            className={`material-symbols-outlined text-[20px] ${
              isSpinningGps ? 'animate-spin text-[#0037b0]' : ''
            }`}
          >
            explore
          </span>
        </button>
      </div>

      {/* Channel Category Filter Pills (Image 9) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
            selectedFilter === 'all'
              ? 'bg-[#191c1e] text-white shadow-xs'
              : 'bg-[#eceef0] text-[#565e74] hover:bg-[#e0e3e5]'
          }`}
        >
          {t.allChannels} ({CHANNEL_PARTNERS.length})
        </button>
        <button
          onClick={() => setSelectedFilter('sca')}
          className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
            selectedFilter === 'sca'
              ? 'bg-[#191c1e] text-white shadow-xs'
              : 'bg-[#eceef0] text-[#565e74] hover:bg-[#e0e3e5]'
          }`}
        >
          State SCA
        </button>
        <button
          onClick={() => setSelectedFilter('rrb')}
          className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
            selectedFilter === 'rrb'
              ? 'bg-[#191c1e] text-white shadow-xs'
              : 'bg-[#eceef0] text-[#565e74] hover:bg-[#e0e3e5]'
          }`}
        >
          RRB / Gramin Bank
        </button>
        <button
          onClick={() => setSelectedFilter('coop')}
          className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
            selectedFilter === 'coop'
              ? 'bg-[#191c1e] text-white shadow-xs'
              : 'bg-[#eceef0] text-[#565e74] hover:bg-[#e0e3e5]'
          }`}
        >
          Cooperative
        </button>
      </div>

      {/* Daytime GIS Radar / Map View Card (Image 9) */}
      <div className="relative w-full rounded-3xl bg-[#f2f4f6] overflow-hidden shadow-sm aspect-[16/11] border border-slate-200">
        {/* Map Background image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDot_omSergEt7_Zhu7DGkGSBcQHnBnU0j7zXjZRPW1RXobIuIG7EjAfB2HRBQz6lot9BfHfcKw5wBoUepjCHKkZH2GDHzfXUE9M0QQ9BDtKfr1Wz99fMGEj1f_l4rXeC_QPATG9RfyclA_SKfKWHa7ZqhoSfP09lfgAkJ4jjnl77i_avNaAJ9Uof0Z3PhUonAPBl8cJ4Qog1mEc6-BWq910QJhxaOSGCnWIs4tJs7dqlwCRmmDPb8W')"
          }}
        ></div>

        {/* GIS Translucent Layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-white/70 pointer-events-none"></div>

        {/* Concentric Radar Rings */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          <circle cx="50%" cy="54%" r="35" fill="none" stroke="#2151da" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="50%" cy="54%" r="75" fill="none" stroke="#2151da" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="50%" cy="54%" r="120" fill="none" stroke="#2151da" strokeWidth="0.75" strokeDasharray="5 5" />
        </svg>

        {/* Center: You Are Here Dot */}
        <div className="absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-[#0037b0] opacity-60"></span>
            <div className="w-4 h-4 rounded-full bg-[#0037b0] ring-4 ring-white shadow-md"></div>
          </div>
          <div className="mt-1 px-2.5 py-0.5 rounded-full bg-[#191c1e]/90 backdrop-blur-md shadow-xs">
            <span className="text-[10px] font-semibold text-white whitespace-nowrap">You Are Here</span>
          </div>
        </div>

        {/* Pin 1: Baroda UP Bank (Top Left) */}
        <button
          onClick={() => setSelectedPartnerId('partner-baroda-rrb')}
          className={`absolute top-[20%] left-[16%] z-20 flex flex-col items-center transition-transform hover:scale-105 ${
            selectedPartnerId === 'partner-baroda-rrb' ? 'scale-110' : ''
          }`}
        >
          <div className="px-2.5 py-1 rounded-full bg-white shadow-md flex items-center gap-1 border border-slate-100">
            <span className="w-2 h-2 rounded-full bg-[#0037b0] shrink-0"></span>
            <span className="text-[11px] font-semibold text-[#191c1e] whitespace-nowrap">
              Baroda UP Bank (1.8 km)
            </span>
          </div>
          <span className="material-symbols-outlined text-[#0037b0] text-[20px] -mt-1 drop-shadow-sm">
            arrow_drop_down
          </span>
        </button>

        {/* Pin 2: UPSCFDC (Right Center) */}
        <button
          onClick={() => setSelectedPartnerId('partner-upscfdc')}
          className={`absolute top-[32%] right-[10%] z-20 flex flex-col items-center transition-transform hover:scale-105 ${
            selectedPartnerId === 'partner-upscfdc' ? 'scale-110' : ''
          }`}
        >
          <div className="px-2.5 py-1 rounded-full bg-[#0f172a] shadow-md flex items-center gap-1.5 border border-white/20">
            <span className="material-symbols-outlined text-[#c4e7ff] text-[13px]">stars</span>
            <span className="text-[11px] font-bold text-white whitespace-nowrap">UPSCFDC (3.2 km)</span>
          </div>
          <span className="material-symbols-outlined text-[#0f172a] text-[20px] -mt-1 drop-shadow-sm">
            arrow_drop_down
          </span>
        </button>

        {/* Pin 3: Dist Co-op (Bottom Left - Paused) */}
        <button
          onClick={() => setSelectedPartnerId('partner-coop-bank')}
          className={`absolute bottom-[16%] left-[14%] z-20 flex flex-col items-center transition-transform hover:scale-105 ${
            selectedPartnerId === 'partner-coop-bank' ? 'scale-110' : ''
          }`}
        >
          <div className="px-2.5 py-1 rounded-full bg-white shadow-md flex items-center gap-1 border border-red-200">
            <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
            <span className="text-[11px] font-semibold text-[#565e74] whitespace-nowrap">
              Dist Co-op (4.1 km · Paused)
            </span>
          </div>
          <span className="material-symbols-outlined text-red-600 text-[20px] -mt-1 drop-shadow-sm">
            arrow_drop_down
          </span>
        </button>

        {/* Top Map Status Badge */}
        <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-center gap-1.5 border border-slate-100">
          <span className="material-symbols-outlined text-[#0037b0] text-[15px]">radar</span>
          <span className="text-[11px] font-semibold text-[#191c1e]">Radius: 5.0 km</span>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-base font-bold text-[#191c1e]">{t.availableChannelPartners}</h2>
          <p className="text-xs text-[#565e74]">{t.rankedBySpeed}</p>
        </div>
        <span className="text-[11px] font-bold text-[#0037b0] bg-[#dae2fd] px-2.5 py-1 rounded-full">
          Active GIS
        </span>
      </div>

      {/* Detailed Partner Cards List (Image 9) */}
      <div className="flex flex-col gap-4">
        {filteredPartners.map(partner => {
          const isSelected = selectedPartnerId === partner.id;
          const isPaused = partner.status === 'paused';

          return (
            <div
              key={partner.id}
              onClick={() => setSelectedPartnerId(partner.id)}
              className={`bg-white rounded-3xl p-5 shadow-sm flex flex-col gap-3.5 border transition-all cursor-pointer ${
                isSelected ? 'border-[#0037b0] ring-2 ring-[#0037b0]/15' : 'border-slate-100'
              } ${isPaused ? 'opacity-90 bg-slate-50/50' : ''}`}
            >
              {/* Card Top Bar */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                      partner.type === 'sca'
                        ? 'bg-[#dae2fd] text-[#0037b0]'
                        : isPaused
                        ? 'bg-red-50 text-red-600'
                        : 'bg-[#eceef0] text-[#565e74]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {partner.type === 'sca'
                        ? 'account_balance'
                        : partner.type === 'rrb'
                        ? 'storefront'
                        : 'account_balance_wallet'}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-sm font-bold text-[#191c1e] leading-snug">{partner.name}</h3>
                    <p className="text-xs text-[#565e74] mt-0.5">{partner.typeLabel}</p>
                  </div>
                </div>

                {isPaused && (
                  <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[11px] font-bold shrink-0">
                    Paused
                  </span>
                )}
              </div>

              {/* Badges Strip */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#dae2fd] text-[#0037b0] text-[11px] font-bold">
                  <span className="material-symbols-outlined text-[14px] material-symbols-fill">
                    verified
                  </span>
                  <span>{partner.matchScore}% Match</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#f2f4f6] text-[#565e74] text-[11px] font-medium">
                  <span className="material-symbols-outlined text-[14px]">distance</span>
                  <span>{partner.distanceKm} km away</span>
                </span>
                {partner.type === 'sca' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#c4e7ff] text-[#001e2c] text-[11px] font-semibold">
                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                    <span>Instant Pipeline</span>
                  </span>
                )}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#f2f4f6]">
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#565e74]">
                    {partner.type === 'rrb' ? 'Remaining Quota' : 'Quota Available'}
                  </span>
                  <span className="text-xs font-bold text-[#191c1e] mt-0.5">
                    ₹{partner.quotaAvailableCrores >= 1 ? `${partner.quotaAvailableCrores} Cr` : `${partner.quotaAvailableCrores * 100} Lakh`}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#565e74]">NPA Health</span>
                  <span
                    className={`text-xs font-bold mt-0.5 ${
                      partner.npaPercentage > 15 ? 'text-red-600' : 'text-[#0037b0]'
                    }`}
                  >
                    {partner.npaPercentage}%
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#565e74]">Turnaround</span>
                  <span className="text-xs font-bold text-[#191c1e] mt-0.5">
                    ~{partner.turnaroundDays} Days
                  </span>
                </div>
              </div>

              {/* Safeguard Notice for High NPA Branches */}
              {isPaused && (
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-amber-700 text-[20px] shrink-0 mt-0.5">
                    shield
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-amber-900">
                      Routing Paused — Protection Active
                    </span>
                    <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                      Branch NPA &gt; 15% (Current: {partner.npaPercentage}%). Direct routing temporarily
                      paused by NSFDC algorithm to protect applicant approval turnaround and prevent subsidy
                      pipeline lockups.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Area */}
              <div className="flex items-center gap-2 pt-1">
                {!isPaused ? (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleRouteApplication(partner);
                    }}
                    className="flex-1 py-3 px-5 rounded-full bg-[#0f172a] hover:bg-[#1d4ed8] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all"
                  >
                    <span>{t.routeApplicationHere}</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                ) : (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleRouteApplication(partner);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-full bg-[#eceef0] text-[#565e74] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    <span>Automatic Reroute Configured to UPSCFDC</span>
                  </button>
                )}

                <button
                  onClick={e => {
                    e.stopPropagation();
                    setDirectionsModalPartner(partner);
                  }}
                  aria-label={`Directions to ${partner.name}`}
                  className="w-11 h-11 rounded-full bg-[#eceef0] flex items-center justify-center text-[#191c1e] hover:bg-[#dae2fd] transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-[20px]">directions</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Offline Assistance Card (Vikas Mitra Kendra) (Image 9) */}
      <div className="bg-white rounded-3xl p-5 shadow-sm flex items-center justify-between gap-4 border border-slate-100">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#0037b0] shrink-0">
            <span className="material-symbols-outlined text-[24px]">support_agent</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-[#0037b0] uppercase font-bold tracking-wider">
              {t.offlineHelpdesk}
            </span>
            <h4 className="text-sm font-bold text-[#191c1e] truncate">{OFFLINE_HELPDESK.name}</h4>
            <span className="text-xs text-[#565e74]">{OFFLINE_HELPDESK.role}</span>
          </div>
        </div>

        <a
          href={`tel:${OFFLINE_HELPDESK.phone.replace(/-/g, '')}`}
          aria-label="Call Vikas Mitra Helpdesk"
          className="w-11 h-11 rounded-full bg-[#0f172a] text-white flex items-center justify-center hover:bg-[#1d4ed8] shadow-md shrink-0 transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">call</span>
        </a>
      </div>

      {/* Directions Modal */}
      {directionsModalPartner && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 flex flex-col gap-3 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0037b0] text-[22px]">navigation</span>
                <h3 className="text-sm font-bold text-[#191c1e]">Turn-by-Turn Transit</h3>
              </div>
              <button
                onClick={() => setDirectionsModalPartner(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="p-3 bg-[#f2f4f6] rounded-2xl text-xs flex flex-col gap-1">
              <span className="font-bold text-[#191c1e]">{directionsModalPartner.name}</span>
              <span className="text-slate-500">{directionsModalPartner.address}</span>
              <span className="text-[#0037b0] font-semibold mt-1">
                Distance: {directionsModalPartner.distanceKm} km · ETA: ~
                {Math.round(directionsModalPartner.distanceKm * 4)} mins via NH-24B
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600 my-1">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  1
                </span>
                <span>Head north from Mohanlalganj Chowk toward Tehsil Road (800m).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  2
                </span>
                <span>Turn right at Kacheri Gate toward Nodal Office Complex.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  3
                </span>
                <span>Destination on right: Room #3, NSFDC Despatch Cell.</span>
              </div>
            </div>

            <button
              onClick={() => {
                setDirectionsModalPartner(null);
                onShowToast('Transit path mapped on GPS navigator.', 'info');
              }}
              className="w-full py-3 rounded-full bg-[#0f172a] text-white text-xs font-bold"
            >
              Close Navigator
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
