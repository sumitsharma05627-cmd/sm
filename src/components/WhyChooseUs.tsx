import React from 'react';
import { CLINIC_INFO } from '../data/clinicData.ts';
import { 
  ShieldCheck, Star, Users, MapPin, DollarSign, Activity, CheckCircle, Sparkles
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const trustPillars = [
    {
      title: 'Qualified Specialist Care',
      description: 'Led by Dr. Ankit Yagik holding an MPT in Rehabilitation, a Musculoskeletal Fellowship, and active membership in the Indian Association of Physiotherapists (IAP).',
      icon: ShieldCheck,
      badge: 'Certified Clinician'
    },
    {
      title: '5.0-Star Patient Feedback',
      description: 'Consistently rated 5.0 / 5.0 across 169+ verified patient reviews on public business directories, recognizing our clinical care, hygiene, and bedside manner.',
      icon: Star,
      badge: '169+ Reviews'
    },
    {
      title: 'Personalized 1-on-1 Sessions',
      description: 'We do not rush patients through assembly-line treatments. Every session includes thorough physical reassessment, manual therapy, and tailored active drills.',
      icon: Users,
      badge: 'Individual Attention'
    },
    {
      title: 'Accessible Gwalior Location',
      description: 'Situated on the Ground Floor of Rudra Associates Building near Mishra Hospital in Gole Ka Mandir, easily reachable by public transport with ample parking.',
      icon: MapPin,
      badge: 'Gole Ka Mandir'
    },
    {
      title: 'Patient-First Diagnostic Care',
      description: 'Thorough, honest evaluation avoiding unnecessary investigations or protracted machine dependence. Every session prioritizes functional restoration and sustainable relief.',
      icon: Sparkles,
      badge: 'Ethical Care'
    },
    {
      title: 'Home Visits Across Gwalior',
      description: 'For patients recovering from severe fractures, knee replacements, stroke, or elderly citizens with limited mobility, we provide dedicated home visit therapy.',
      icon: Activity,
      badge: 'Doorstep Service'
    }
  ];

  return (
    <section id="why-us" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/70 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <CheckCircle className="w-3.5 h-3.5 text-teal-700" />
            <span>Built on Verified Patient Trust</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Patients Choose Sankat Mochan Physiotherapy
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Our reputation is built on transparent care, qualified clinical credentials, and genuine patient outcomes—grounded in facts, not exaggerated claims.
          </p>
        </div>

        {/* 6 Trust Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-3.5 shadow-2xs hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/70 text-teal-700 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Verified Rating Metric Showcase Banner */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center shrink-0">
              <Star className="w-7 h-7 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-2xl font-black text-slate-900">5.0 out of 5.0</span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                  Verified Score
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculated from 169+ customer reviews and public directory ratings in Gwalior.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              id="why-us-call-btn"
              href={`tel:${CLINIC_INFO.contact.primaryPhoneRaw}`}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
            >
              Call {CLINIC_INFO.contact.primaryPhone}
            </a>
            <a
              id="why-us-reviews-anchor-btn"
              href="#reviews"
              className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Read Patient Feedback
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
