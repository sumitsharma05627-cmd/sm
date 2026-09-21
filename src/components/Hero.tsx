import React, { useState, useEffect, useRef } from 'react';
import { CLINIC_INFO } from '../data/clinicData.ts';
import { Star, Phone, MessageCircle, Calendar, MapPin, Award, CheckCircle2, ArrowRight, Activity, ShieldCheck, Home, Camera, ChevronRight, ZoomIn, Upload, X } from 'lucide-react';
import { photoStore } from '../utils/photoStore.ts';
import { ClinicLogo } from './ClinicLogo.tsx';

interface HeroProps {
  onOpenAppointment: (service?: string) => void;
}

const HERO_SLIDES = [
  {
    id: 'dr-ankit',
    slotKey: 'hero-dr-ankit',
    label: 'Dr. Ankit Yagik',
    tag: 'Founder & Lead PT',
    src: '/sankatmochan-physiotherapy-and-fitness-centre-gole-ka-mandir-gwalior-physiotherapists-15v5gevngz.jpg',
    caption: 'Dr. Ankit Yagik • Lead Physiotherapist & Musculoskeletal Specialist (MPT, Fellowship) at consultation desk'
  },
  {
    id: 'treatment-bay',
    slotKey: 'hero-treatment-bay',
    label: 'Clinical Bay',
    tag: 'Treatment Room',
    src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1000&auto=format&fit=crop&q=80',
    caption: 'Clean, sanitized physical therapy evaluation table and electrotherapy area at Gole Ka Mandir'
  },
  {
    id: 'exercise-rehab',
    slotKey: 'hero-exercise-rehab',
    label: 'Active Rehab',
    tag: 'Movement Arena',
    src: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1000&auto=format&fit=crop&q=80',
    caption: 'Evidence-based functional movement therapy and progressive resistance conditioning'
  }
];

export const Hero: React.FC<HeroProps> = ({ onOpenAppointment }) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isHeroZoomOpen, setIsHeroZoomOpen] = useState(false);
  const [slideImages, setSlideImages] = useState<Record<string, string>>({});
  const [hasError, setHasError] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with photoStore
  useEffect(() => {
    const updateImages = () => {
      const map: Record<string, string> = {};
      HERO_SLIDES.forEach((s) => {
        const stored = photoStore.getSlot(s.slotKey);
        map[s.id] = stored || s.src;
      });
      setSlideImages(map);
    };

    updateImages();
    return photoStore.subscribe(updateImages);
  }, []);

  const currentSlide = HERO_SLIDES[activeSlideIndex];
  const activeImageSrc = slideImages[currentSlide.id] || currentSlide.src;
  const isCurrentError = hasError[currentSlide.id];

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        photoStore.setSlot(currentSlide.slotKey, reader.result);
        setSlideImages((prev) => ({ ...prev, [currentSlide.id]: reader.result as string }));
        setHasError((prev) => ({ ...prev, [currentSlide.id]: false }));
      }
    };
    reader.readAsDataURL(file);
  };
  return (
    <section id="home" className="relative bg-gradient-to-b from-slate-100/70 via-white to-slate-50 pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden border-b border-slate-200/70">
      {/* Subtle decorative background shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-teal-100/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-slate-200/50 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Core Benefit & Direct Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Trust Pill: Official Logo, Verified Rating & Accreditation */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border border-emerald-200/80 shadow-xs">
                <ClinicLogo size="xs" />
                <span className="text-xs font-bold text-slate-800">Official Clinic</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold shadow-xs">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span>5.0 Rated</span>
                <span className="text-amber-700 font-normal">({CLINIC_INFO.stats.totalReviews}+ Verified Reviews)</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
                <Award className="w-3.5 h-3.5 text-teal-700" />
                <span>IAP Registered Center</span>
              </div>
            </div>

            {/* Clinic Name & Main Headline */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
                <span>Gole Ka Mandir • Gwalior • Physiotherapy & Medical Fitness</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Move Without Pain. <br className="hidden sm:inline" />
                <span className="text-teal-700">Recover Better.</span> <br />
                Reclaim Your Strength.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                Welcome to <strong className="text-slate-900 font-semibold">{CLINIC_INFO.name}</strong>, led by <strong className="text-slate-900 font-semibold">Dr. Ankit Yagik</strong> & <strong className="text-slate-900 font-semibold">Dr. Shruti Nahar</strong>. We specialize in targeted sports injury rehabilitation, cervical neck stiffness, severe sciatica, and joint restoration with active exercise therapy.
              </p>
            </div>

            {/* Key Verified Feature Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Comprehensive Assessment</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>1-on-1 Personalized Care</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-200/80 shadow-2xs col-span-2 sm:col-span-1">
                <Home className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Home Visits in Gwalior</span>
              </div>
            </div>

            {/* Action Buttons Group */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                id="hero-book-appointment-cta"
                onClick={() => onOpenAppointment()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-700 hover:bg-teal-800 active:scale-98 text-white font-bold rounded-xl shadow-md shadow-teal-800/20 text-sm sm:text-base transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <a
                id="hero-call-now-cta"
                href={`tel:${CLINIC_INFO.contact.primaryPhoneRaw}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold rounded-xl shadow-xs text-sm sm:text-base transition-colors"
              >
                <Phone className="w-4 h-4 text-teal-700" />
                <span>Call {CLINIC_INFO.contact.primaryPhone}</span>
              </a>

              <a
                id="hero-whatsapp-cta"
                href={`https://wa.me/${CLINIC_INFO.contact.whatsAppNumber}?text=${encodeURIComponent(CLINIC_INFO.contact.defaultWhatsAppMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>

            {/* Location & Visiting Note */}
            <div className="pt-2 flex items-start gap-2 text-xs text-slate-500">
              <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>
                <strong>Clinic Location:</strong> Ground Floor, Rudra Associates Building, Near Mishra Hospital, Gole Ka Mandir, Gwalior (Open 24 Hours • Prior Call Advised).
              </span>
            </div>

          </div>

          {/* Right Column: Visual Showcase & Verified Doctor Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden">
              
              {/* Doctor Header Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-900 text-white p-5">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-teal-500/20 text-teal-300 border border-teal-400/30">
                    Lead Clinician
                  </span>
                  <span className="text-xs text-slate-300 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    IAP Certified
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {CLINIC_INFO.doctor.name}
                </h2>
                <p className="text-xs text-teal-200 mt-0.5 font-medium">
                  {CLINIC_INFO.doctor.qualifications}
                </p>
                <p className="text-[11px] text-slate-300 mt-1">
                  Fellowship in Musculoskeletal Physiotherapy
                </p>
              </div>

              {/* Clinic Authentic Facility Showcase with Tabs */}
              <div className="relative bg-slate-900 overflow-hidden">
                {/* Image switcher tabs */}
                <div className="flex items-center justify-between p-2 bg-slate-900/90 border-b border-slate-800 text-[11px]">
                  <span className="text-teal-400 font-bold uppercase tracking-wider flex items-center gap-1 pl-1">
                    <Camera className="w-3 h-3" />
                    <span>Real Clinic Photos</span>
                  </span>
                  <div className="flex items-center gap-1">
                    {HERO_SLIDES.map((slide, idx) => (
                      <button
                        key={slide.id}
                        onClick={() => setActiveSlideIndex(idx)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                          activeSlideIndex === idx
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {slide.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hidden file input for uploading genuine original photo */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadPhoto}
                />

                {/* Main Photo View */}
                <div 
                  className="relative h-64 sm:h-72 bg-slate-950 overflow-hidden cursor-pointer group"
                  onClick={() => {
                    if (!isCurrentError) {
                      setIsHeroZoomOpen(true);
                    } else {
                      fileInputRef.current?.click();
                    }
                  }}
                  title={isCurrentError ? "Click to upload original photo" : "Click to view full resolution photograph"}
                >
                  {!isCurrentError ? (
                    <>
                      <img
                        key={currentSlide.id + activeImageSrc}
                        src={activeImageSrc}
                        onError={() => setHasError((prev) => ({ ...prev, [currentSlide.id]: true }))}
                        alt={currentSlide.caption}
                        className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-[1.03]"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-4 pointer-events-none">
                        <span className="px-3.5 py-1.5 rounded-full bg-teal-600/90 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-xs pointer-events-auto">
                          <ZoomIn className="w-3.5 h-3.5" />
                          View Full Resolution
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-900 text-teal-300 text-xs font-semibold flex items-center gap-1.5 shadow-lg pointer-events-auto transition-colors cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Upload Photo
                        </button>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent flex items-end p-4 pointer-events-none">
                        <div className="space-y-0.5">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-teal-500/90 text-slate-950">
                            {currentSlide.tag}
                          </span>
                          <p className="text-white text-xs font-medium drop-shadow-sm line-clamp-1">
                            {currentSlide.caption}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Clean Professional Placeholder - Pure Clinical Design, No AI Cartoons */
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-white">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 mb-3">
                        <Camera className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-teal-300">{currentSlide.label} Photograph Slot</p>
                      <p className="text-xs text-slate-400 max-w-xs mt-1 mb-3">
                        Click below to upload the authentic photograph for Sankat Mochan Physiotherapy Center.
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Select Original Photo
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Key Consultation Highlights Box */}
              <div className="p-5 space-y-3.5 bg-white">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
                      Consultation Care
                    </span>
                    <span className="text-base sm:text-lg font-extrabold text-teal-800">
                      1-on-1 Dedicated <span className="text-xs font-normal text-slate-500">/ In-Clinic & Home Visit</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
                      Verified Rating
                    </span>
                    <div className="flex items-center gap-1 text-sm font-bold text-slate-900">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>5.0 / 5.0</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>Evidence-based diagnosis: biomechanical, spine, and movement tests.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>Sanitized & clean private cubicles with sterilized equipment.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>Integrated fitness equipment for active post-pain conditioning.</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    id="hero-card-consult-btn"
                    onClick={() => onOpenAppointment()}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Schedule Initial Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Hero Lightbox Modal for Full Resolution Photo */}
      {isHeroZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
          onClick={() => setIsHeroZoomOpen(false)}
        >
          <div
            className="max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white bg-slate-950">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-teal-500 text-slate-950 inline-block mb-1">
                  {currentSlide.tag}
                </span>
                <h4 className="font-bold text-base text-teal-300">
                  {currentSlide.caption}
                </h4>
                <p className="text-xs text-slate-400">
                  Sankat Mochan Physiotherapy &amp; Fitness Center • Gola Ka Mandir, Gwalior
                </p>
              </div>
              <button
                onClick={() => setIsHeroZoomOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-2 sm:p-4 bg-black flex-1 flex items-center justify-center overflow-auto min-h-[300px]">
              <img
                src={activeImageSrc}
                alt={currentSlide.caption}
                className="max-h-[72vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-300">
                High-Resolution Asset: <strong>{currentSlide.src.replace('/', '')}</strong>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsHeroZoomOpen(false);
                    onOpenAppointment();
                  }}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" /> Book Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
