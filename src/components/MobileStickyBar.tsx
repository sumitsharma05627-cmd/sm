import React from 'react';
import { CLINIC_INFO } from '../data/clinicData.ts';
import { Phone, MessageSquare, Calendar } from 'lucide-react';

interface MobileStickyBarProps {
  onOpenAppointment: () => void;
  onOpenChatbot: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ 
  onOpenAppointment,
  onOpenChatbot 
}) => {
  return (
    <div
      id="mobile-sticky-action-bar"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-[calc(0.625rem+env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-3 gap-2">
        {/* Call Button */}
        <a
          id="sticky-call-btn"
          href={`tel:${CLINIC_INFO.contact.primaryPhoneRaw}`}
          className="flex flex-col items-center justify-center py-2 px-1 bg-slate-100 active:bg-slate-200 text-slate-800 rounded-xl transition-all"
        >
          <Phone className="w-4 h-4 text-teal-700 mb-0.5" />
          <span className="text-[11px] font-bold leading-tight">Call Now</span>
        </a>

        {/* Ask Us (Sankat Mochan Assistant) Button */}
        <button
          id="sticky-ask-us-btn"
          type="button"
          onClick={onOpenChatbot}
          className="flex flex-col items-center justify-center py-2 px-1 bg-teal-50 active:bg-teal-100 border border-teal-200 text-teal-900 rounded-xl shadow-2xs transition-all cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 mb-0.5 text-teal-700" />
          <span className="text-[11px] font-bold leading-tight">Ask Us</span>
        </button>

        {/* Book Appointment Button */}
        <button
          id="sticky-appointment-btn"
          type="button"
          onClick={onOpenAppointment}
          className="flex flex-col items-center justify-center py-2 px-1 bg-teal-700 active:bg-teal-800 text-white rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Calendar className="w-4 h-4 mb-0.5 text-teal-200" />
          <span className="text-[11px] font-bold leading-tight">Appointment</span>
        </button>
      </div>
    </div>
  );
};
