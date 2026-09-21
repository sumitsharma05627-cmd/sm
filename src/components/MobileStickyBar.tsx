import React from 'react';
import { CLINIC_INFO } from '../data/clinicData.ts';
import { Phone, MessageCircle, Calendar } from 'lucide-react';

interface MobileStickyBarProps {
  onOpenAppointment: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ onOpenAppointment }) => {
  return (
    <div
      id="mobile-sticky-action-bar"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-[calc(0.625rem+env(safe-area-inset-bottom))]"
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

        {/* WhatsApp Button */}
        <a
          id="sticky-whatsapp-btn"
          href={`https://wa.me/${CLINIC_INFO.contact.whatsAppNumber}?text=${encodeURIComponent(CLINIC_INFO.contact.defaultWhatsAppMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 bg-emerald-600 active:bg-emerald-700 text-white rounded-xl shadow-sm transition-all"
        >
          <MessageCircle className="w-4 h-4 mb-0.5" />
          <span className="text-[11px] font-bold leading-tight">WhatsApp</span>
        </a>

        {/* Book Appointment Button */}
        <button
          id="sticky-appointment-btn"
          onClick={onOpenAppointment}
          className="flex flex-col items-center justify-center py-2 px-1 bg-teal-700 active:bg-teal-800 text-white rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <Calendar className="w-4 h-4 mb-0.5 text-teal-200" />
          <span className="text-[11px] font-bold leading-tight">Book Appt</span>
        </button>
      </div>
    </div>
  );
};
