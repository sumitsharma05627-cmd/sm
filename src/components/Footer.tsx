import React from 'react';
import { CLINIC_INFO, CLINIC_SERVICES } from '../data/clinicData.ts';
import { 
  MapPin, Phone, MessageCircle, Clock, Award, Star, 
  ExternalLink, ShieldCheck, HeartPulse, ChevronRight 
} from 'lucide-react';
import { ClinicLogo } from './ClinicLogo.tsx';

interface FooterProps {
  onOpenAppointment: (service?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAppointment }) => {
  return (
    <footer id="main-footer" className="bg-slate-950 text-slate-300 pt-16 pb-24 md:pb-16 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-900">
          
          {/* Col 1: Brand & Verified Identity */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <ClinicLogo size="sm" />
              <div>
                <span className="font-extrabold text-white text-lg tracking-tight block leading-tight">
                  {CLINIC_INFO.name}
                </span>
                <span className="text-xs text-teal-400 font-medium">
                  Gole Ka Mandir, Gwalior
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Led by <strong className="text-white font-semibold">Dr. Ankit Yagik</strong> & <strong className="text-white font-semibold">Dr. Shruti Nahar</strong>. Delivering evidence-based rehabilitation, sports medicine recovery, and physical conditioning.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>5.0 Rated (169+ Reviews)</span>
              </div>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-teal-300 font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>IAP Member</span>
              </div>
            </div>

            {/* Verified Social Channels */}
            <div className="pt-2 space-y-1 text-xs">
              <span className="text-slate-400 text-[11px] uppercase tracking-wider block font-semibold">
                Verified Social Channels:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={CLINIC_INFO.doctor.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                >
                  <span>Instagram ({CLINIC_INFO.doctor.instagram})</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
                <a
                  href={CLINIC_INFO.doctor.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                >
                  <span>YouTube ({CLINIC_INFO.doctor.youtube})</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Verified Treatments Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-teal-400">
              Key Treatments
            </h4>
            <ul className="space-y-2 text-xs">
              {CLINIC_SERVICES.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <button
                    onClick={() => onOpenAppointment(service.title)}
                    className="hover:text-teal-300 transition-colors flex items-center gap-1 text-left cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3 text-teal-500" />
                    <span>{service.title}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onOpenAppointment('Home Visit Physiotherapy in Gwalior')}
                  className="text-teal-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <ChevronRight className="w-3 h-3" />
                  <span>Home Visit Physiotherapy (Gwalior)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-teal-400">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#home" className="hover:text-teal-300 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-teal-300 transition-colors">About Our Doctors</a></li>
              <li><a href="#services" className="hover:text-teal-300 transition-colors">Services & Therapies</a></li>
              <li><a href="#fitness" className="hover:text-teal-300 transition-colors">Fitness Center</a></li>
              <li><a href="#why-us" className="hover:text-teal-300 transition-colors">Why Choose Us</a></li>
              <li><a href="#reviews" className="hover:text-teal-300 transition-colors">Patient Reviews</a></li>
              <li><a href="#gallery" className="hover:text-teal-300 transition-colors">Clinic Facility</a></li>
              <li><a href="#faqs" className="hover:text-teal-300 transition-colors">Patient FAQs</a></li>
            </ul>
          </div>

          {/* Col 4: Contact & Hours */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-teal-400">
              Clinic Contact & Hours
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  Ground Floor, Rudra Associates Building, Near Mishra Hospital, Gole Ka Mandir, Gwalior - 474005
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`tel:${CLINIC_INFO.contact.primaryPhoneRaw}`} className="hover:underline font-semibold text-white">
                  {CLINIC_INFO.contact.primaryPhone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${CLINIC_INFO.contact.whatsAppNumber}?text=${encodeURIComponent(CLINIC_INFO.contact.defaultWhatsAppMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-emerald-400 font-semibold"
                >
                  WhatsApp: {CLINIC_INFO.contact.primaryPhone}
                </a>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Hours:</span> Open 24/7
                  <p className="text-[11px] text-slate-400">Prior call advised for dedicated session slot.</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onOpenAppointment()}
                  className="w-full py-2 px-3 bg-teal-700 hover:bg-teal-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Book Assessment
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-slate-400">
          <p className="max-w-3xl leading-relaxed">
            <strong className="text-slate-300">Medical Disclaimer:</strong> Information on this website is for general informational purposes and does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified physiotherapist or physician regarding your specific health condition.
          </p>

          <div className="shrink-0 text-slate-400 text-[11px]">
            © {new Date().getFullYear()} Sankat Mochan Physiotherapy & Fitness Center. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};
