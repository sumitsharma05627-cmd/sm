import React, { useState, useEffect, useRef } from 'react';
import { CLINIC_INFO } from '../data/clinicData.ts';
import { ShieldCheck, Award, Phone, MessageCircle, Calendar, Sparkles, MapPin, ZoomIn, CheckCircle2, Camera, Upload, X } from 'lucide-react';
import { photoStore } from '../utils/photoStore.ts';
import { ClinicLogo } from './ClinicLogo.tsx';

interface OwnersWelcomeSectionProps {
  onOpenAppointment: (service?: string) => void;
}

interface OwnerAssetItem {
  id: string;
  slotKey: string;
  badge: string;
  title: string;
  sub: string;
  defaultSrc: string;
  altText: string;
}

const OWNER_ASSETS: OwnerAssetItem[] = [
  {
    id: 'clinic-official-logo',
    slotKey: 'clinic-custom-logo',
    badge: 'Official Clinic Logo',
    title: 'Sankat Mochan Physiotherapy & Fitness Center • Official Brand Logo',
    sub: 'Therapist & Patient in Wheelchair with Caring Heart and Healing Swirl',
    defaultSrc: '/clinic-logo.svg',
    altText: 'Official Logo of Sankat Mochan Physiotherapy & Fitness Center'
  },
  {
    id: 'dr-ankit-highres',
    slotKey: 'owner-dr-ankit',
    badge: 'Dr. Ankit Yagik (Lead PT)',
    title: 'Dr. Ankit Yagik (MPT, Fellowship, MIAP) • Lead Physiotherapist',
    sub: 'Original Clinical Consultation Desk Photograph',
    defaultSrc: '/dr-ankit.png',
    altText: 'Dr. Ankit Yagik at consultation desk in Sankat Mochan Physiotherapy Clinic'
  },
  {
    id: 'consultation-room',
    slotKey: 'owner-consultation-room',
    badge: 'Consultation & Clinic Chamber',
    title: 'Executive Consultation & Diagnostic Chamber',
    sub: 'One-on-one patient evaluation and orthopedic assessment arena',
    defaultSrc: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&auto=format&fit=crop&q=80',
    altText: 'Consultation and examination room at Sankat Mochan Physiotherapy'
  },
  {
    id: 'outdoor-banner',
    slotKey: 'owner-outdoor-banner',
    badge: 'Center Signboard & Wings',
    title: 'Sankat Mochan Official Center Signboard & Clinical Wings',
    sub: 'Gole Ka Mandir, Near Mishra Hospital, Gwalior',
    defaultSrc: '',
    altText: 'Official signboard of Sankat Mochan Physiotherapy & Fitness Center'
  }
];

export const OwnersWelcomeSection: React.FC<OwnersWelcomeSectionProps> = ({ onOpenAppointment }) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('dr-ankit-highres');
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [assetImages, setAssetImages] = useState<Record<string, string>>({});
  const [assetErrors, setAssetErrors] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with photoStore
  useEffect(() => {
    const updateImages = () => {
      const map: Record<string, string> = {};
      OWNER_ASSETS.forEach((a) => {
        const stored = photoStore.getSlot(a.slotKey);
        map[a.id] = stored || a.defaultSrc;
      });
      setAssetImages(map);
    };

    updateImages();
    return photoStore.subscribe(updateImages);
  }, []);

  const currentAsset = OWNER_ASSETS.find((a) => a.id === selectedAssetId) || OWNER_ASSETS[0];
  const activeImageSrc = assetImages[currentAsset.id] || currentAsset.defaultSrc;
  const isCurrentError = !activeImageSrc || assetErrors[currentAsset.id];
  const drAnkitPhoto = photoStore.getDrAnkitPhoto();

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        photoStore.setSlot(currentAsset.slotKey, reader.result);
        setAssetImages((prev) => ({ ...prev, [currentAsset.id]: reader.result as string }));
        setAssetErrors((prev) => ({ ...prev, [currentAsset.id]: false }));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section id="clinic-owners" className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white py-8 sm:py-12 border-b border-teal-900/60 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hidden file input for uploading owner/clinic photos */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUploadPhoto}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Top Header Tag */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <ClinicLogo size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400">Clinic Leadership &amp; Founders</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-semibold border border-amber-500/30">Official Clinic Owners</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Meet Dr. Ankit Yagik &amp; Dr. Shruti Nahar
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-4 h-4 text-teal-400" />
              Gola Ka Mandir, Gwalior
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:flex items-center gap-1 text-amber-400 font-medium">
              <Award className="w-4 h-4" />
              Dedicated 1-on-1 Consultation
            </span>
          </div>
        </div>

        {/* Main Grid: Dedicated Owner Image Showcase & Executive Doctor Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: The Large Official Owner Photograph */}
          <div className="lg:col-span-7">
            {/* Quick Dr. Ankit Photo Status & Upload Bar */}
            <div className="mb-3.5 p-3 rounded-xl bg-slate-800/80 border border-teal-500/40 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white">Dr. Ankit Yagik Photo Slot</span>
                    {drAnkitPhoto ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-[10px] border border-emerald-500/30">
                        ✓ Original Photo Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold text-[10px] border border-teal-500/30">
                        Ready for Image File
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {drAnkitPhoto
                      ? 'Displaying Dr. Ankit’s real consultation desk photograph in uncompressed clarity.'
                      : 'Select Dr. Ankit’s uploaded consultation photograph to display it on the website.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedAssetId('dr-ankit-highres');
                  fileInputRef.current?.click();
                }}
                className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{drAnkitPhoto ? 'Change Photo' : 'Select Dr. Ankit Photo'}</span>
              </button>
            </div>

            {/* Asset Selection Buttons */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {OWNER_ASSETS.map((item) => {
                const isActive = selectedAssetId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedAssetId(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/30'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                    }`}
                  >
                    <span>{item.badge}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative group rounded-2xl overflow-hidden bg-slate-800/80 border-2 border-teal-500/40 shadow-2xl shadow-teal-950/60">
              
              {/* Image Container */}
              <div 
                className="aspect-[16/10] sm:aspect-[16/9] w-full relative bg-slate-900 overflow-hidden cursor-pointer"
                onClick={() => {
                  if (!isCurrentError) {
                    setIsZoomOpen(true);
                  } else {
                    fileInputRef.current?.click();
                  }
                }}
              >
                {!isCurrentError ? (
                  <>
                    <img
                      key={currentAsset.id + activeImageSrc}
                      src={activeImageSrc}
                      alt={currentAsset.altText}
                      className="w-full h-full object-cover sm:object-contain bg-slate-950 transition-transform duration-500 group-hover:scale-[1.02]"
                      onError={() => setAssetErrors((prev) => ({ ...prev, [currentAsset.id]: true }))}
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-4 pointer-events-none">
                      <div className="px-4 py-2 rounded-full bg-teal-600/90 text-white font-medium text-xs flex items-center gap-2 shadow-lg backdrop-blur-sm pointer-events-auto">
                        <ZoomIn className="w-4 h-4" />
                        Click to Enlarge Original Photo
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-900 text-teal-300 text-xs font-semibold flex items-center gap-1.5 shadow-lg pointer-events-auto transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Upload Real Photo
                      </button>
                    </div>
                  </>
                ) : (
                  /* Clean Professional Placeholder - Pure Clinical Design, No AI Cartoons */
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-white">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-teal-400 mb-3">
                      <Camera className="w-7 h-7" />
                    </div>
                    <p className="text-sm font-bold text-teal-300">{currentAsset.title}</p>
                    <p className="text-xs text-slate-400 max-w-xs mt-1 mb-4">
                      {currentAsset.sub}. Click below to upload and display the original clinic photograph.
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Original Photo
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Caption Bar */}
              <div className="p-3.5 bg-slate-900/95 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <strong className="text-white font-semibold">{currentAsset.title}</strong>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-4">{currentAsset.sub}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    Change Photo
                  </button>
                  <button
                    onClick={() => {
                      if (!isCurrentError) setIsZoomOpen(true);
                    }}
                    className="text-teal-400 hover:text-teal-300 flex items-center gap-1 text-xs font-semibold cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" /> Enlarge
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Two Executive Doctor Badges */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Dr. Ankit Yagik Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/80 hover:border-teal-500/50 transition-colors shadow-lg">
              <div className="flex items-start gap-3.5">
                <div 
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-700 text-slate-950 font-black text-lg flex items-center justify-center border-2 border-teal-300 shadow-md flex-shrink-0 overflow-hidden cursor-pointer group/avatar"
                  onClick={() => {
                    setSelectedAssetId('dr-ankit-highres');
                    if (drAnkitPhoto) {
                      setIsZoomOpen(true);
                    } else {
                      fileInputRef.current?.click();
                    }
                  }}
                  title={drAnkitPhoto ? "Click to enlarge Dr. Ankit's photo" : "Click to select Dr. Ankit's photo"}
                >
                  {drAnkitPhoto ? (
                    <img 
                      src={drAnkitPhoto} 
                      alt="Dr. Ankit Yagik Lead Physiotherapist" 
                      className="w-full h-full object-cover object-top transition-transform group-hover/avatar:scale-110" 
                    />
                  ) : (
                    <span>AY</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-white truncate">Dr. Ankit Yagik</h3>
                    <span className="px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-700/50 text-[10px] font-bold">MPT • IAP</span>
                  </div>
                  <p className="text-xs text-teal-400 font-semibold">Lead Physiotherapist &amp; Founder</p>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                    Specialist in Sports Injury Rehab, Spine Biomechanics, Stroke, Paralysis &amp; Joint Restoration.
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Direct Line: <strong className="text-white">+91 75099 77899</strong></span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAssetId('dr-ankit-highres');
                      fileInputRef.current?.click();
                    }}
                    className="text-teal-300 hover:text-white font-medium text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-2.5 h-2.5" /> Photo
                  </button>
                  <a
                    href={`tel:${CLINIC_INFO.contact.primaryPhoneRaw}`}
                    className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" /> Call Dr. Ankit
                  </a>
                </div>
              </div>
            </div>

            {/* Dr. Shruti Nahar Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/80 hover:border-amber-500/50 transition-colors shadow-lg">
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-600 to-rose-700 text-white font-bold text-lg flex items-center justify-center border-2 border-amber-400 shadow-md flex-shrink-0">
                  SN
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-white truncate">Dr. Shruti Nahar</h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700/50 text-[10px] font-bold">PT</span>
                  </div>
                  <p className="text-xs text-amber-400 font-semibold">Consultant Physiotherapist &amp; Director</p>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                    Specialist in Women’s Health (PCOD, Pregnancy Care), Pediatric Rehab (C.P. Child, Autism, ADHD) &amp; Occupational Therapy.
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Direct Line: <strong className="text-white">+91 72230 91723</strong></span>
                <a
                  href={`tel:${CLINIC_INFO.contact.secondaryPhoneRaw}`}
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" /> Call Dr. Shruti
                </a>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                id="btn-book-with-owners"
                onClick={() => onOpenAppointment()}
                className="flex-1 px-4 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                Book Consultation with Owners
              </button>

              <a
                id="btn-whatsapp-owners"
                href={`https://wa.me/${CLINIC_INFO.contact.whatsAppNumber}?text=${encodeURIComponent('Hello Dr. Ankit and Dr. Shruti, I would like to consult with the clinic directors at Sankat Mochan Physiotherapy.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* Lightbox / Full Resolution Zoom Modal */}
      {isZoomOpen && activeImageSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
              <div>
                <h4 className="font-bold text-base text-teal-400">{currentAsset.title}</h4>
                <p className="text-xs text-slate-400">{currentAsset.sub} • Sankat Mochan Physiotherapy, Gwalior</p>
              </div>
              <button
                onClick={() => setIsZoomOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-2 sm:p-4 bg-black flex items-center justify-center max-h-[75vh] overflow-auto">
              <img
                src={activeImageSrc}
                alt={currentAsset.altText}
                className="max-h-[70vh] w-auto object-contain rounded-lg"
              />
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
              <span>{currentAsset.altText}</span>
              <div className="flex gap-2">
                <a
                  href={`tel:${CLINIC_INFO.contact.primaryPhoneRaw}`}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" /> Call +91 75099 77899
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
