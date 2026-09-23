import React, { useState } from 'react';
import { CLINIC_INFO } from '../data/clinicData.ts';
import { 
  MapPin, Phone, MessageSquare, Clock, Navigation, 
  ExternalLink, Mail, Send, CheckCircle2, ShieldCheck 
} from 'lucide-react';

interface ContactAndLocationProps {
  onOpenChatbot?: () => void;
  onOpenAppointment?: () => void;
}

export const ContactAndLocation: React.FC<ContactAndLocationProps> = ({ 
  onOpenChatbot, 
  onOpenAppointment 
}) => {
  const [quickQuery, setQuickQuery] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [querySent, setQuerySent] = useState(false);

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuerySent(true);
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-teal-700" />
            <span>Visit Us or Get in Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Clinic Location & Contact Details
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Conveniently situated in Gole Ka Mandir, Gwalior near Mishra Hospital. Easily reachable by bus, auto, or personal vehicle.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Verified Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Address Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Clinic Address</h3>
                  <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed font-medium">
                    {CLINIC_INFO.location.fullAddress}
                  </p>
                  <p className="text-xs text-teal-800 font-semibold mt-1">
                    Landmark: {CLINIC_INFO.location.landmark}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  id="get-directions-btn"
                  href={CLINIC_INFO.location.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions on Google Maps</span>
                </a>

                <a
                  id="view-on-google-maps-btn"
                  href={CLINIC_INFO.location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-xl transition-colors"
                >
                  <span>Open Map</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Direct Phone Lines Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Verified Phone Numbers</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any number below to call directly:
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-1 text-sm font-semibold">
                <a
                  id="contact-phone-primary"
                  href={`tel:${CLINIC_INFO.contact.primaryPhoneRaw}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 hover:border-teal-400 hover:text-teal-700 transition-all text-slate-800"
                >
                  <span>{CLINIC_INFO.contact.primaryPhone}</span>
                  <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    Primary / Appointments
                  </span>
                </a>

                <a
                  id="contact-phone-secondary"
                  href={`tel:${CLINIC_INFO.contact.secondaryPhoneRaw}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 hover:border-teal-400 hover:text-teal-700 transition-all text-slate-800"
                >
                  <span>{CLINIC_INFO.contact.secondaryPhone}</span>
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Support Line
                  </span>
                </a>

                <a
                  id="contact-phone-third"
                  href={`tel:${CLINIC_INFO.contact.landlineRaw}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 hover:border-teal-400 hover:text-teal-700 transition-all text-slate-800"
                >
                  <span>{CLINIC_INFO.contact.landlineOrAlt}</span>
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Direct Line
                  </span>
                </a>
              </div>
            </div>

            {/* Operating Timings & Direct Helpdesk Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Operating Hours & Support</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    <strong>Days:</strong> {CLINIC_INFO.timings.days} <br />
                    <strong>Timings:</strong> {CLINIC_INFO.timings.hours}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 italic">
                    {CLINIC_INFO.timings.recommendedSlotNote}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                {onOpenChatbot && (
                  <button
                    id="contact-ask-assistant-btn"
                    type="button"
                    onClick={onOpenChatbot}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-teal-700" />
                    <span>Ask Sankat Mochan Assistant</span>
                  </button>
                )}

                <a
                  id="contact-call-direct-btn"
                  href={`tel:${CLINIC_INFO.contact.primaryPhoneRaw}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {CLINIC_INFO.contact.primaryPhone}</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Google Maps Embed + Quick Query Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Google Maps Interactive Card */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-600"></div>
                  <span className="text-xs font-bold text-slate-900">
                    Clinic Physical Location & Directions (Location Only)
                  </span>
                </div>
                <a
                  id="open-maps-link"
                  href={CLINIC_INFO.location.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
                >
                  <span>Get Turn-by-Turn Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Map Embed using Google Maps Search Iframe for Gwalior, Gole Ka Mandir */}
              <div className="h-72 sm:h-80 w-full bg-slate-100 relative">
                <iframe
                  title="Sankat Mochan Physiotherapy & Fitness Center Location Map"
                  src="https://maps.google.com/maps?q=Near%20Mishra%20Hospital,%20Gole%20Ka%20Mandir,%20Gwalior,%20Madhya%20Pradesh%20474005&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>

              <div className="p-4 bg-white text-xs text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Getting Here:</strong> Located on the Ground Floor of Rudra Associates Building, directly adjacent/near Mishra Hospital in Gole Ka Mandir. Ample parking is available for two-wheelers and cars.
                </span>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Have a Quick Question for Dr. Ankit?
                </h3>
                <p className="text-xs text-slate-500">
                  Send a brief message and our clinic will reach out with guidance.
                </p>
              </div>

              {!querySent ? (
                <form onSubmit={handleQuerySubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={quickQuery.name}
                        onChange={(e) => setQuickQuery({ ...quickQuery, name: e.target.value })}
                        placeholder="e.g. Vikas"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={quickQuery.phone}
                        onChange={(e) => setQuickQuery({ ...quickQuery, phone: e.target.value })}
                        placeholder="e.g. 9876543210"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Question / Pain Concern</label>
                    <textarea
                      rows={2}
                      required
                      value={quickQuery.message}
                      onChange={(e) => setQuickQuery({ ...quickQuery, message: e.target.value })}
                      placeholder="Ask about treatment availability, consultation timing, or home visits..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Inquiry</span>
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2.5 text-xs text-emerald-950">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Inquiry Recorded!</span>
                  </div>
                  <p>
                    Thank you {quickQuery.name}. Your inquiry has been received. Our clinic team at Gole Ka Mandir will contact you at {quickQuery.phone}.
                  </p>
                  <div className="pt-1 flex flex-wrap gap-2">
                    <a
                      href={`tel:${CLINIC_INFO.contact.primaryPhoneRaw}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 text-white rounded-lg font-bold text-xs hover:bg-teal-800 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Clinic: {CLINIC_INFO.contact.primaryPhone}</span>
                    </a>
                    {onOpenAppointment && (
                      <button
                        type="button"
                        onClick={onOpenAppointment}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-teal-300 text-teal-800 rounded-lg font-bold text-xs hover:bg-teal-50 transition-colors cursor-pointer"
                      >
                        <span>Book Dedicated Appointment</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
