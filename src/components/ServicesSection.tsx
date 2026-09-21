import React, { useState } from 'react';
import { CLINIC_SERVICES, CLINIC_INFO } from '../data/clinicData.ts';
import { 
  Activity, Smile, ShieldAlert, Bone, Brain, Stethoscope, Dumbbell, Home,
  CheckCircle2, ArrowRight, MessageCircle, Calendar
} from 'lucide-react';
import { ServiceItem } from '../types.ts';

interface ServicesSectionProps {
  onOpenAppointment: (serviceTitle?: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenAppointment }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Verified Services' },
    { id: 'pain', label: 'Spine & Pain Relief' },
    { id: 'sports', label: 'Sports Injury Rehab' },
    { id: 'ortho', label: 'Joints & Post-Op' },
    { id: 'neuro', label: 'Neuro Hand Rehab' },
    { id: 'general', label: 'Fitness & Home Care' },
  ];

  const filteredServices = activeCategory === 'all'
    ? CLINIC_SERVICES
    : CLINIC_SERVICES.filter(s => s.category === activeCategory);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity': return <Activity className="w-5 h-5" />;
      case 'Smile': return <Smile className="w-5 h-5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5" />;
      case 'Bone': return <Bone className="w-5 h-5" />;
      case 'Brain': return <Brain className="w-5 h-5" />;
      case 'Stethoscope': return <Stethoscope className="w-5 h-5" />;
      case 'Dumbbell': return <Dumbbell className="w-5 h-5" />;
      case 'Home': return <Home className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/70 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-teal-700" />
            <span>Targeted Physical Therapy & Rehabilitation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Verified Treatments & Services
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Every treatment program at Sankat Mochan Physiotherapy & Fitness Center is customized around your specific diagnostic assessment, functional mobility score, and daily lifestyle.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service: ServiceItem) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              <div className="space-y-4">
                
                {/* Header Icon + Tagline */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200/70 text-teal-700 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition-colors shrink-0">
                    {getServiceIcon(service.iconName)}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {service.category === 'sports' && 'Sports Injury'}
                    {service.category === 'pain' && 'Spine & Pain'}
                    {service.category === 'ortho' && 'Orthopedic'}
                    {service.category === 'neuro' && 'Neurological'}
                    {service.category === 'general' && 'General Care'}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs font-medium text-teal-800 mt-1">
                    {service.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {service.description}
                </p>

                {/* Suitable for Box */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                  <strong className="text-slate-800 font-semibold block mb-0.5">Suitable For:</strong>
                  <p className="text-slate-600 leading-normal">{service.suitableFor}</p>
                </div>

                {/* Conditions Treated Pills */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Common Conditions Treated:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {service.conditions.map((cond, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                      >
                        {cond}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Approach Bullet Points */}
                <div className="space-y-1 pt-1 text-xs text-slate-600">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-6 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  id={`book-service-${service.id}`}
                  onClick={() => onOpenAppointment(service.title)}
                  className="py-2.5 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Visit</span>
                </button>

                <a
                  id={`whatsapp-service-${service.id}`}
                  href={`https://wa.me/${CLINIC_INFO.contact.whatsAppNumber}?text=${encodeURIComponent(`Hello Dr. Ankit, I am interested in consultation for: ${service.title}. Could you please guide me on available appointment slots?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ask Details</span>
                </a>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Consultation Assistance Note */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold text-slate-900">
              Not sure which treatment is right for your symptoms?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Speak directly with our clinic. Dr. Ankit and team will review your symptoms during an initial consultation and guide your recovery plan.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              id="services-call-direct-btn"
              href={`tel:${CLINIC_INFO.contact.primaryPhoneRaw}`}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
            >
              Call {CLINIC_INFO.contact.primaryPhone}
            </a>
            <button
              id="services-book-general-btn"
              onClick={() => onOpenAppointment()}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Book Assessment
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
