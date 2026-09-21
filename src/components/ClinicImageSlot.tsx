import React, { useState, useEffect, useRef } from 'react';
import { Camera, ZoomIn, Upload, X, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { photoStore } from '../utils/photoStore.ts';

interface ClinicImageSlotProps {
  slotKey: string;
  defaultSrc?: string;
  altText?: string;
  alt?: string;
  title?: string;
  label?: string;
  subtitle?: string;
  className?: string;
  aspectRatio?: string; // e.g. 'aspect-video', 'aspect-4/3', 'aspect-square'
  onImageClick?: () => void;
  showLightboxOnClick?: boolean;
}

export const ClinicImageSlot: React.FC<ClinicImageSlotProps> = ({
  slotKey,
  defaultSrc,
  altText,
  alt,
  title,
  label,
  subtitle,
  className = '',
  aspectRatio = 'aspect-video',
  onImageClick,
  showLightboxOnClick = true
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayTitle = title || label || 'Clinic Facility Photograph';
  const displayAlt = altText || alt || displayTitle;

  // Sync with photoStore and defaultSrc
  useEffect(() => {
    const updateSrc = () => {
      const stored = photoStore.getSlot(slotKey);
      if (stored) {
        setCurrentSrc(stored);
        setHasError(false);
      } else if (defaultSrc) {
        setCurrentSrc(defaultSrc);
        setHasError(false);
      } else {
        setCurrentSrc(null);
      }
    };

    updateSrc();
    return photoStore.subscribe(updateSrc);
  }, [slotKey, defaultSrc]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Must be a real image
    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        photoStore.setSlot(slotKey, reader.result);
        setCurrentSrc(reader.result);
        setHasError(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    photoStore.removeSlot(slotKey);
    if (defaultSrc) {
      setCurrentSrc(defaultSrc);
      setHasError(false);
    } else {
      setCurrentSrc(null);
    }
  };

  const handleCardClick = () => {
    if (currentSrc && !hasError) {
      if (onImageClick) {
        onImageClick();
      } else if (showLightboxOnClick) {
        setIsLightboxOpen(true);
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        className={`relative overflow-hidden rounded-2xl bg-slate-100 border border-slate-200/80 group ${aspectRatio} ${className}`}
      >
        {currentSrc && !hasError ? (
          <div className="w-full h-full relative cursor-pointer" onClick={handleCardClick}>
            <img
              src={currentSrc}
              alt={displayAlt}
              onError={() => setHasError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              loading="lazy"
            />

            {/* Subtle hover overlay with actions */}
            <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-4 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-xs text-white text-xs font-semibold shadow-md pointer-events-auto">
                <ZoomIn className="w-3.5 h-3.5" />
                Click to Enlarge
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-600/90 hover:bg-teal-600 text-white text-xs font-medium shadow-md transition-colors pointer-events-auto cursor-pointer"
                title="Replace with your original photo"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upload Original</span>
              </button>
            </div>
          </div>
        ) : (
          /* Clean Professional Placeholder - No AI cartoons, pure clinical design */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-100 via-slate-50 to-teal-50/40 cursor-pointer hover:bg-slate-100/80 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-teal-700 shadow-xs mb-3 group-hover:scale-105 transition-transform">
              <Camera className="w-6 h-6" />
            </div>

            <h4 className="text-sm font-bold text-slate-800 tracking-tight">
              {displayTitle}
            </h4>

            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              {subtitle || 'Click to select and display the original clinic photograph file.'}
            </p>

            <button
              type="button"
              className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Select Original Photo</span>
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && currentSrc && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 text-white">
              <div className="space-y-0.5">
                <p className="text-xs uppercase tracking-wider text-teal-400 font-bold">
                  Sankat Mochan Physiotherapy & Fitness Center
                </p>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {displayTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close image preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10 flex items-center justify-center max-h-[75vh]">
              <img
                src={currentSrc}
                alt={displayAlt}
                className="w-full h-auto max-h-[75vh] object-contain"
              />
            </div>

            <div className="w-full pt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
              <span>{displayAlt}</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 text-teal-400 hover:text-teal-300 font-semibold cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New Version of this Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
