import React from 'react';
import { CLINIC_INFO } from '../data/clinicData.ts';
import { Dumbbell, Activity, HeartPulse, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { ClinicImageSlot } from './ClinicImageSlot.tsx';

interface FitnessSectionProps {
  onOpenAppointment: (serviceTitle?: string) => void;
}

export const FitnessSection: React.FC<FitnessSectionProps> = ({ onOpenAppointment }) => {
  const fitnessPillars = [
    {
      title: 'Medical Exercise Therapy (MET)',
      subtitle: 'Physiotherapist-guided strength & joint preservation',
      description: 'Unlike standard gym regimens that risk aggravating joint degeneration or herniated discs, our therapeutic exercise programs are designed to strengthen stabilizing muscles around vulnerable joints.',
      icon: Dumbbell,
      points: ['Spine-safe core bracing protocols', 'Progressive overload without compressive joint loading', 'Individualized resistance machine guidance']
    },
    {
      title: 'Sports Injury Return-to-Play Conditioning',
      subtitle: 'From pain relief to active athletic agility',
      description: 'Once pain subsides, athletes require functional drills, eccentric deceleration training, and agility conditioning before resuming cricket, football, running, or badminton safely.',
      icon: Activity,
      points: ['Neuromuscular balance & reactive drills', 'Tendon loading & explosive power recovery', 'Sport-specific movement retraining']
    },
    {
      title: 'Posture & Ergonomic Stabilization',
      subtitle: 'For desk workers, IT professionals & students',
      description: 'Reverses forward-head posture, rounded shoulders, and anterior pelvic tilt caused by hours of sitting. Builds muscular endurance in the posterior chain to prevent recurring neck and lumbar stiffness.',
      icon: ShieldCheck,
      points: ['Deep neck flexor & scapular retraction', 'Gluteal activation & hip flexor release', 'Workstation posture correction guidance']
    },
    {
      title: 'Senior Citizen Mobility & Joint Health',
      subtitle: 'Active independence, balance & fall prevention',
      description: 'Safe, low-impact conditioning for older adults battling osteoarthritic knee stiffness, loss of balance, or muscular frailty. Retains independent walking and stairs climbing ability.',
      icon: HeartPulse,
      points: ['Gait correction & weight-bearing confidence', 'Static & dynamic balance training', 'Gentle resistance band bone health workouts']
    }
  ];

  return (
    <section id="fitness" className="py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <Dumbbell className="w-3.5 h-3.5 text-teal-700" />
            <span>Integrated Physiotherapy & Fitness</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            The Fitness Center: Active Movement for Long-Term Health
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Pain relief is only step one. At <strong className="text-slate-900 font-semibold">{CLINIC_INFO.name}</strong>, we integrate clinical physiotherapy with medical fitness training so your body stays resilient, strong, and injury-free.
          </p>
        </div>

        {/* Real Facility Showcase Card */}
        <div className="mb-12 bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-lg grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-6 relative h-64 sm:h-80 bg-slate-950 overflow-hidden">
            <ClinicImageSlot
              slotKey="fitness-rehab-gym"
              defaultSrc="https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80"
              altText="Authentic medical fitness gym at Sankat Mochan center Gwalior"
              label="Medical Rehabilitation Gym"
              aspectRatio="h-full w-full"
              className="w-full h-full"
            />
          </div>
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-center space-y-4 text-white">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Purpose-Built Active Recovery
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Clinical Fitness Equipment Calibrated for Rehabilitation
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Unlike generic gyms focused on heavy loading, our medical gym at Gole Ka Mandir combines supervised strength conditioning, eccentric hamstring and quad protocols, gait re-education, and controlled cardiovascular endurance under direct physiotherapy supervision.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenAppointment('Medical Fitness Assessment')}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Schedule Guided Assessment
              </button>
              <a
                href="#gallery"
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                View Full Center Gallery
              </a>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {fitnessPillars.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-4 hover:border-teal-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-teal-800 font-medium mt-0.5">
                      {pillar.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-200/80 text-xs text-slate-700">
                  {pillar.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onOpenAppointment(`Fitness & Conditioning: ${pillar.title}`)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-900 transition-colors cursor-pointer"
                  >
                    <span>Inquire About Program</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Comparison Callout: Commercial Gym vs Clinical Medical Fitness */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 to-teal-950 text-white rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Why Medical Fitness Matters
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                How Our Fitness Center Differs From an Unsupervised Gym
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                If you have a past slip disc, knee meniscus tear, or cervical strain, unsupervised heavy gym workouts often trigger painful flare-ups. Under Dr. Ankit’s clinical guidance, every exercise is calibrated to your joint tolerances, spine biomechanics, and recovery stage.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                onClick={() => onOpenAppointment('Medical Fitness Assessment')}
                className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl text-center shadow-md transition-all cursor-pointer"
              >
                Book Fitness Evaluation
              </button>
              <a
                href={`https://wa.me/${CLINIC_INFO.contact.whatsAppNumber}?text=${encodeURIComponent('Hello Dr. Ankit, I would like to ask about your medical fitness and exercise therapy training.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl text-center border border-slate-700 transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
