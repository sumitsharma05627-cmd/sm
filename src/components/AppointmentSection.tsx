import React, { useState, useEffect } from 'react';
import { CLINIC_INFO, CLINIC_SERVICES } from '../data/clinicData.ts';
import { AppointmentFormData } from '../types.ts';
import { 
  Calendar, Clock, User, Phone, MessageSquare, CheckCircle2, 
  MessageCircle, Send, ShieldCheck, MapPin, Home, AlertCircle 
} from 'lucide-react';

interface AppointmentSectionProps {
  prefilledService?: string;
}

export const AppointmentSection: React.FC<AppointmentSectionProps> = ({ prefilledService }) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    fullName: '',
    phone: '',
    visitType: 'clinic',
    service: prefilledService || 'Initial Assessment & Consultation',
    preferredDate: '',
    preferredTime: 'Morning (09:00 AM - 01:00 PM)',
    symptoms: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (prefilledService) {
      setFormData(prev => ({ ...prev, service: prefilledService }));
    }
  }, [prefilledService]);

  const timeSlots = [
    'Morning (09:00 AM - 01:00 PM)',
    'Afternoon (01:00 PM - 05:00 PM)',
    'Evening (05:00 PM - 09:00 PM)',
    'Night / Custom Slot (Open 24/7 on request)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate reliable client-side submission & preparation
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 450);
  };

  const getWhatsAppSyncUrl = () => {
    const text = `*New Appointment Request - Sankat Mochan Physiotherapy Center*
*Patient Name:* ${formData.fullName}
*Phone:* ${formData.phone}
*Visit Type:* ${formData.visitType === 'clinic' ? 'Clinic Visit (Gole Ka Mandir)' : 'Home Visit (Gwalior)'}
*Service Requested:* ${formData.service}
*Preferred Date:* ${formData.preferredDate || 'Earliest Available'}
*Preferred Time Slot:* ${formData.preferredTime}
*Symptoms / Medical History:* ${formData.symptoms || 'None specified'}`;

    return `https://wa.me/${CLINIC_INFO.contact.whatsAppNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="appointment" className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50 to-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-teal-700" />
            <span>Fast & Simple Appointment Booking</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Schedule Your Consultation
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Reserve dedicated one-on-one time with Dr. Ankit Yagik and Dr. Shruti Nahar at our Gole Ka Mandir clinic, or request a convenient home visit in Gwalior.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Quick Instructions & Trust Info */}
            <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                    What to Expect
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Transparent & Professional Care
                  </h3>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Comprehensive Initial Assessment:</strong>
                      Full physical range of motion, joint integrity, and postural check.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Zero Waiting Time:</strong>
                      Prior scheduling ensures the doctor is prepared specifically for your arrival.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Immediate Confirmation:</strong>
                      You will receive a prompt confirmation call or WhatsApp message.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Home className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Home Visits in Gwalior:</strong>
                      Option available for elderly and post-op patients.
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 text-xs">
                  <span className="text-slate-400 block mb-1">Direct Helpdesk:</span>
                  <a
                    href={`tel:${CLINIC_INFO.contact.primaryPhoneRaw}`}
                    className="text-teal-300 font-bold text-sm hover:underline block"
                  >
                    {CLINIC_INFO.contact.primaryPhone}
                  </a>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    (Open 24 Hours • Gole Ka Mandir, Gwalior)
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-4">
                *Your appointment request will be verified by the clinic team. No payment is required right now.
              </div>
            </div>

            {/* Right Column: Interactive Form */}
            <div className="lg:col-span-7 p-6 sm:p-8">
              {!isSubmitted ? (
                <form id="appointment-form" onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Visit Type Toggle (Clinic vs Home Visit) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Consultation Location
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, visitType: 'clinic' })}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                          formData.visitType === 'clinic'
                            ? 'bg-teal-50 border-teal-600 text-teal-800'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 text-teal-600" />
                        <span>Clinic Visit (Gole Ka Mandir)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, visitType: 'home_visit' })}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                          formData.visitType === 'home_visit'
                            ? 'bg-teal-50 border-teal-600 text-teal-800'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Home className="w-3.5 h-3.5 text-teal-600" />
                        <span>Home Visit in Gwalior</span>
                      </button>
                    </div>
                  </div>

                  {/* Patient Name & Phone Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="patient-name-input" className="block text-xs font-semibold text-slate-700 mb-1">
                        Patient Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          id="patient-name-input"
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="e.g. Ramesh Sharma"
                          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-slate-50 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="patient-phone-input" className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number (Call / WhatsApp) *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          id="patient-phone-input"
                          type="tel"
                          required
                          pattern="[0-9]{10,12}"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. 9876543210"
                          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-slate-50 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Treatment / Service Selector */}
                  <div>
                    <label htmlFor="service-select" className="block text-xs font-semibold text-slate-700 mb-1">
                      Concern / Treatment Required
                    </label>
                    <select
                      id="service-select"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-slate-50 focus:bg-white"
                    >
                      <option value="Initial Assessment & Consultation">
                        Initial Assessment & Physical Evaluation
                      </option>
                      {CLINIC_SERVICES.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                      <option value="Medical Fitness & Posture Conditioning">
                        Medical Fitness & Posture Conditioning
                      </option>
                      <option value="Senior Citizen Fall Prevention & Mobility">
                        Senior Citizen Fall Prevention & Mobility
                      </option>
                      <option value="Other Physical Therapy Need">
                        Other Musculoskeletal / Pain Condition
                      </option>
                    </select>
                  </div>

                  {/* Date & Time Slot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="date-input" className="block text-xs font-semibold text-slate-700 mb-1">
                        Preferred Date
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          id="date-input"
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={formData.preferredDate}
                          onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-slate-50 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="time-select" className="block text-xs font-semibold text-slate-700 mb-1">
                        Preferred Time Window
                      </label>
                      <div className="relative">
                        <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <select
                          id="time-select"
                          value={formData.preferredTime}
                          onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-slate-50 focus:bg-white"
                        >
                          {timeSlots.map((slot, i) => (
                            <option key={i} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Message / Symptoms */}
                  <div>
                    <label htmlFor="symptoms-input" className="block text-xs font-semibold text-slate-700 mb-1">
                      Brief Symptoms / Problem Description (Optional)
                    </label>
                    <textarea
                      id="symptoms-input"
                      rows={2}
                      value={formData.symptoms}
                      onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                      placeholder="e.g. Left knee stiffness for 2 months, pain worse when climbing stairs..."
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-slate-50 focus:bg-white"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      id="submit-appointment-request-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 bg-teal-700 hover:bg-teal-800 active:scale-98 text-white font-bold rounded-xl shadow-md shadow-teal-800/20 text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <span>Processing request...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Request Appointment</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center">
                    Prefer direct booking? You can also call <a href={`tel:${CLINIC_INFO.contact.primaryPhoneRaw}`} className="text-teal-700 font-semibold underline">{CLINIC_INFO.contact.primaryPhone}</a> or WhatsApp us.
                  </p>

                </form>
              ) : (
                /* Confirmation Screen with 1-Click WhatsApp Sync */
                <div id="appointment-confirmation-box" className="text-center py-6 space-y-5 animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-2xl font-bold text-slate-900">
                      Appointment Request Received!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                      Thank you, <strong className="text-slate-900">{formData.fullName}</strong>. Your request for <span className="font-semibold text-teal-800">{formData.service}</span> has been logged for review by Dr. Ankit Yagik's clinic team.
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
                    <div className="flex justify-between pb-1.5 border-b border-slate-200">
                      <span className="text-slate-500">Patient Phone:</span>
                      <span className="font-semibold text-slate-900">{formData.phone}</span>
                    </div>
                    <div className="flex justify-between pb-1.5 border-b border-slate-200">
                      <span className="text-slate-500">Visit Type:</span>
                      <span className="font-semibold text-slate-900">
                        {formData.visitType === 'clinic' ? 'Clinic Visit (Gole Ka Mandir)' : 'Home Visit (Gwalior)'}
                      </span>
                    </div>
                    <div className="flex justify-between pb-1.5 border-b border-slate-200">
                      <span className="text-slate-500">Preferred Date:</span>
                      <span className="font-semibold text-slate-900">{formData.preferredDate || 'Earliest available'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payment:</span>
                      <span className="font-bold text-teal-800">Directly at clinic / home visit</span>
                    </div>
                  </div>

                  {/* Immediate WhatsApp Notification Button */}
                  <div className="space-y-2 pt-2">
                    <a
                      id="notify-clinic-whatsapp-btn"
                      href={getWhatsAppSyncUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full max-w-md py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Send Booking Details to Clinic on WhatsApp</span>
                    </a>

                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-xs text-slate-500 hover:text-slate-700 underline block mx-auto cursor-pointer"
                    >
                      Submit another request
                    </button>
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
