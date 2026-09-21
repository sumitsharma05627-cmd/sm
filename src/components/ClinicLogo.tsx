import React, { useState, useEffect } from 'react';
import { photoStore } from '../utils/photoStore.ts';

interface ClinicLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: 'dark' | 'light';
  subtext?: string;
}

export const ClinicLogo: React.FC<ClinicLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  textColor = 'dark',
  subtext = 'Physiotherapy & Fitness Center'
}) => {
  const [customLogo, setCustomLogo] = useState<string | null>(photoStore.getSlot('clinic-custom-logo'));

  useEffect(() => {
    const handleUpdate = () => {
      setCustomLogo(photoStore.getSlot('clinic-custom-logo'));
    };
    return photoStore.subscribe(handleUpdate);
  }, []);

  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24 sm:w-28 sm:h-28'
  };

  const imageSrc = customLogo || '/clinic-logo.svg';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Authentic Circular Wreath Physiotherapist & Patient Logo */}
      <div 
        className={`relative ${sizeClasses[size]} shrink-0 rounded-full bg-white p-0.5 shadow-sm border border-emerald-100 flex items-center justify-center overflow-hidden group/logo transition-all hover:scale-105 hover:shadow-md`}
        title="Sankat Mochan Physiotherapy & Fitness Center Official Logo"
      >
        <img
          src={imageSrc}
          alt="Sankat Mochan Physiotherapy & Fitness Center Official Logo"
          className="w-full h-full object-contain p-0.5"
          onError={(e) => {
            // Fallback to embedded vector if external fails
            const target = e.currentTarget;
            if (target.src !== '/clinic-logo.svg') {
              target.src = '/clinic-logo.svg';
            }
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-extrabold text-base sm:text-lg leading-tight tracking-tight ${textColor === 'light' ? 'text-white' : 'text-slate-900'}`}>
              Sankat Mochan
            </span>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200/60">
              Gwalior
            </span>
          </div>
          <p className={`text-[11px] sm:text-xs font-medium ${textColor === 'light' ? 'text-teal-400' : 'text-slate-500'}`}>
            {subtext}
          </p>
        </div>
      )}
    </div>
  );
};
