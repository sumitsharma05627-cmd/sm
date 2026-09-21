import React, { useState, useEffect, useRef } from 'react';
import { CLINIC_INFO } from '../data/clinicData.ts';
import { Phone, MessageCircle, MapPin, ZoomIn, Award, Camera, Upload, X } from 'lucide-react';
import { photoStore } from '../utils/photoStore.ts';

interface AdBannerSectionProps {
  onOpenAppointment?: (service?: string) => void;
}

export const AdBannerSection: React.FC<AdBannerSectionProps> = ({ onOpenAppointment }) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [bannerSrc, setBannerSrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const update = () => {
      const stored = photoStore.getSlot('official-ad-banner');
      setBannerSrc(stored || '');
    };
    update();
    return photoStore.subscribe(update);
  }, []);

  const handleUploadBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        photoStore.setSlot('official-ad-banner', reader.result);
        setBannerSrc(reader.result);
        setHasError(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section id="official-ad-banner" className="py-10 sm:py-14 bg-slate-100 border-y border-slate-200/80">
      {/* Hidden file input for uploading genuine banner photograph */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUploadBanner}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            Official Center Advertisement &amp; Clinical Wings
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            All Specialized Wings Under One Roof
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Orthopaedic, Neurological, Gynecology &amp; Women’s Health, Pediatric, and Occupational Physical Therapy at Gola Ka Mandir, Gwalior.
          </p>
        </div>

        {/* Ad Banner Card Container */}
        <div className="relative rounded-2xl overflow-hidden bg-white shadow-xl border-2 border-emerald-600/30">
          
          {/* Ad Banner Image Preview or Clean Professional Showcase Card */}
          {bannerSrc && !hasError ? (
            <div
              className="relative cursor-pointer group bg-slate-950 overflow-hidden min-h-[260px] flex items-center justify-center"
              onClick={() => setIsZoomOpen(true)}
            >
              <img
                src={bannerSrc}
                alt="Sankat Mochan Physiotherapy & Fitness Center Official Billboard Banner"
                className="w-full h-auto max-h-[500px] object-contain transition-transform duration-500 group-hover:scale-[1.01]"
                onError={() => setHasError(true)}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-6">
                <div className="px-5 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center gap-2 shadow-2xl backdrop-blur-sm pointer-events-auto">
                  <ZoomIn className="w-4 h-4" />
                  Click to Enlarge Official Ad Banner
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900/90 text-emerald-300 hover:bg-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-lg pointer-events-auto transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  Replace Banner Photo
                </button>
              </div>
            </div>
          ) : (
            /* Clean Professional Banner Showcase - Pure Graphic Layout, No AI Cartoons */
            <div className="p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white text-center flex flex-col items-center justify-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 shadow-lg">
                <Camera className="w-8 h-8" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 uppercase tracking-widest mb-3">
                Official Center Banner Slot
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white max-w-xl">
                Sankat Mochan Physiotherapy &amp; Fitness Center
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mt-2 mb-6 leading-relaxed">
                Displaying official clinic signboard and billboard photograph. If you have the real photograph of the clinic billboard, upload it below to display it in full resolution.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  Upload Real Banner Photo
                </button>
              </div>
            </div>
          )}

          {/* Bottom Fast Contact Strip matching the Banner */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 p-4 sm:p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="space-y-1 text-center md:text-left">
              <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-300">
                Direct Emergency &amp; Routine Appointment Lines
              </div>
              <div className="text-xl sm:text-2xl font-black text-white tracking-wider flex items-center justify-center md:justify-start gap-3">
                <span>7509977899</span>
                <span className="text-emerald-400">•</span>
                <span>7223091723</span>
              </div>
              <div className="text-xs text-slate-300 flex items-center justify-center md:justify-start gap-1.5 pt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Ground Floor, Rudra Associates Building, Near Mishra Hospital, Gola Ka Mandir, Gwalior</span>
              </div>
            </div>

            {/* Fast Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center">
              <a
                id="btn-ad-call-primary"
                href="tel:+917509977899"
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call 7509977899
              </a>

              <a
                id="btn-ad-call-secondary"
                href="tel:+917223091723"
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call 7223091723
              </a>

              {bannerSrc && !hasError && (
                <button
                  onClick={() => setIsZoomOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/20 transition-colors cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                  View Full Banner
                </button>
              )}
            </div>

          </div>

        </div>

        {/* 5 Clinical Pillars Quick Grid derived from the Ad Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
            <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold mb-1">WING 1</span>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">ORTHOPAEDIC</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Joints, Spine &amp; Arthritis</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
            <span className="inline-block px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 text-[10px] font-extrabold mb-1">WING 2</span>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">NEUROLOGICAL</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Stroke, Paralysis &amp; Sciatica</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
            <span className="inline-block px-2 py-0.5 rounded-md bg-pink-100 text-pink-800 text-[10px] font-extrabold mb-1">WING 3</span>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">GYNECOLOGY</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">PCOD, Periods &amp; Pregnancy</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
            <span className="inline-block px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-extrabold mb-1">WING 4</span>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">PEDIATRIC</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">C.P. Child, Autism &amp; Milestones</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm text-center col-span-2 sm:col-span-1">
            <span className="inline-block px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-extrabold mb-1">WING 5</span>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">OCCUPATIONAL</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">ADHD &amp; Cognitive Skills</p>
          </div>
        </div>

      </div>

      {/* Lightbox / Zoom Modal */}
      {isZoomOpen && bannerSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="max-w-6xl w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white bg-slate-900">
              <div>
                <h3 className="font-bold text-base text-emerald-400">
                  Sankat Mochan Physiotherapy &amp; Fitness Center — Official Ad Banner
                </h3>
                <p className="text-xs text-slate-400">
                  Gola Ka Mandir, Gwalior • Ph: 7509977899, 7223091723
                </p>
              </div>
              <button
                onClick={() => setIsZoomOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-3 bg-black flex-1 flex items-center justify-center overflow-auto">
              <img
                src={bannerSrc}
                alt="Sankat Mochan Physiotherapy Official Banner"
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
              <span>Ground Floor, Rudra Associates Building, Near Mishra Hospital, Gola Ka Mandir, Gwalior</span>
              <div className="flex gap-2">
                <a
                  href="tel:+917509977899"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" /> Call 7509977899
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
