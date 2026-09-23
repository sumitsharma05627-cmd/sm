import React from 'react';
import { CLINIC_INFO } from '../data/clinicData.ts';
import { Phone, MessageSquare, Clock, MapPin, AlertCircle } from 'lucide-react';

interface EmergencyBannerProps {
  onOpenChatbot?: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ onOpenChatbot }) => {
  return (
    <section id="fast-contact-strip" className="bg-teal-900 text-white py-4 px-4 border-y border-teal-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-800/80 border border-teal-700/80 flex items-center justify-center text-teal-300 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Immediate Assistance & Prior Appointments
              </span>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="hidden sm:inline text-xs text-teal-100">Open 24/7 (Prior Call Advised)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
              Experiencing acute neck spasm, sudden back stiffness, or recent sports injury? Reach out directly.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
          <a
            id="emergency-strip-call-btn"
            href={`tel:${CLINIC_INFO.contact.primaryPhoneRaw}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-teal-700" />
            <span>Call: {CLINIC_INFO.contact.primaryPhone}</span>
          </a>

          {onOpenChatbot && (
            <button
              id="emergency-strip-ask-btn"
              type="button"
              onClick={onOpenChatbot}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer border border-teal-600"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Assistant</span>
            </button>
          )}

          <a
            id="emergency-strip-directions-btn"
            href={CLINIC_INFO.location.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-800 hover:bg-teal-700 text-teal-100 rounded-lg text-xs font-medium border border-teal-700 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Near Mishra Hospital, Gole Ka Mandir</span>
            <span className="lg:hidden">Directions</span>
          </a>
        </div>
      </div>
    </section>
  );
};

