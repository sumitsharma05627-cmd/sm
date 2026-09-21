import React, { useState } from 'react';
import { CLINIC_INFO, VERIFIED_REVIEWS } from '../data/clinicData.ts';
import { 
  Star, CheckCircle, MessageCircle, ShieldCheck, 
  Calendar, Quote, ThumbsUp, Filter, HeartHandshake,
  Sparkles
} from 'lucide-react';
import { ReviewItem } from '../types.ts';

interface ReviewsSectionProps {
  onOpenAppointment?: (service?: string) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ onOpenAppointment }) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  const filterTags = [
    { id: 'all', label: 'All Reviews', count: VERIFIED_REVIEWS.length },
    { id: 'joint', label: 'Joint & Shoulder', count: VERIFIED_REVIEWS.filter(r => r.categoryTag === 'joint').length },
    { id: 'spine', label: 'Spine & Sciatica', count: VERIFIED_REVIEWS.filter(r => r.categoryTag === 'spine').length },
    { id: 'sports', label: 'Sports & Running', count: VERIFIED_REVIEWS.filter(r => r.categoryTag === 'sports').length },
    { id: 'cervical', label: 'Cervical & Neck', count: VERIFIED_REVIEWS.filter(r => r.categoryTag === 'cervical').length },
    { id: 'post-op', label: 'Post-Fracture', count: VERIFIED_REVIEWS.filter(r => r.categoryTag === 'post-op').length },
  ];

  const filteredReviews = VERIFIED_REVIEWS.filter((rev) => {
    const matchesTag = selectedTag === 'all' || rev.categoryTag === selectedTag;
    const matchesLanguage = selectedLanguage === 'all' || rev.language === selectedLanguage;
    return matchesTag && matchesLanguage;
  });

  const verifiedThemes = [
    { label: 'Patient Assessment & Listening', count: '100% Mentioned' },
    { label: 'Rapid & Effective Recovery', count: 'High Success' },
    { label: 'Clean, Punctual & Hygienic Setup', count: 'Consistent' },
    { label: 'One-on-One Dedicated Doctor Time', count: 'Patient-First' },
    { label: 'Courteous & Supportive Doctors', count: 'Verified' },
  ];

  return (
    <section id="reviews" className="py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>Verified Patient Testimonials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Real Patient Experiences & Reviews
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Read verified treatment reviews directly on our website from patients who recovered from chronic pain, sports injuries, and joint stiffness at our Gwalior clinic.
          </p>
        </div>

        {/* Rating Overview Card */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 mb-10 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Score & Stars */}
            <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-black text-slate-900">5.0</span>
                <span className="text-xl font-bold text-slate-400">/ 5.0</span>
              </div>
              <div className="flex text-amber-400 my-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Consistently rated <strong>5.0 out of 5.0 stars</strong> by patients treated at our Gole Ka Mandir center.
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full font-bold">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Verified Direct In-Clinic Experiences</span>
              </div>
            </div>

            {/* Frequent Patient Themes */}
            <div className="md:col-span-7 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Frequently Highlighted Patient Themes:
              </span>
              <div className="flex flex-wrap gap-2">
                {verifiedThemes.map((theme, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs shadow-2xs"
                  >
                    <span className="font-semibold text-slate-800">{theme.label}</span>
                    <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-bold">
                      {theme.count}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Patients emphasize attentive hearing of their issues, clear explanations of exercises, punctual appointments, and lasting relief from joint and spine pain.
              </p>
            </div>

          </div>
        </div>

        {/* Interactive In-Page Filtering Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-3 rounded-2xl border border-slate-200">
          {/* Category Tag Filters */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Category:
            </span>
            {filterTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(tag.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedTag === tag.id
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tag.label} <span className="text-[10px] opacity-80">({tag.count})</span>
              </button>
            ))}
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setSelectedLanguage('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedLanguage === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({VERIFIED_REVIEWS.length})
            </button>
            <button
              onClick={() => setSelectedLanguage('Hindi')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedLanguage === 'Hindi'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setSelectedLanguage('English')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedLanguage === 'English'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Verified Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev: ReviewItem) => (
            <div
              key={rev.id}
              id={`review-card-${rev.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:border-slate-300 hover:shadow-xs transition-all relative"
            >
              <div className="space-y-3.5">
                {/* Header: Stars + Verified Badge + Date */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-teal-600" />
                    {rev.date}
                  </span>
                </div>

                {/* Highlight Quote Headline */}
                <h4 className="text-sm font-bold text-slate-900 leading-snug flex items-start gap-1.5">
                  <Quote className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>"{rev.highlight}"</span>
                </h4>

                {/* Full Patient Review Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                  "{rev.comment}"
                </p>
              </div>

              {/* Card Footer: Reviewer Name & Condition Treated */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-slate-900 text-sm">{rev.author}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  </div>
                  <span className="text-[10px] text-teal-700 font-semibold block">
                    Verified Patient
                  </span>
                </div>

                {rev.treatment && (
                  <span className="text-[11px] font-medium text-slate-700 bg-teal-50/80 border border-teal-100 px-2.5 py-1 rounded-lg max-w-[170px] text-right truncate">
                    {rev.treatment}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Internal Next Steps Callout (No External Redirects) */}
        <div className="mt-14 bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Begin Your Own Recovery Story</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Suffering from back, neck, knee, or sports injury?
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                Experience the same attentive care and evidence-based therapy praised by our patients. Schedule your comprehensive evaluation with Dr. Ankit Yagik and Dr. Shruti Nahar.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              {onOpenAppointment && (
                <button
                  id="reviews-cta-book-btn"
                  onClick={() => onOpenAppointment()}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold rounded-xl shadow-md transition-all cursor-pointer text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Assessment</span>
                </button>
              )}

              <a
                id="reviews-cta-whatsapp-btn"
                href={`https://wa.me/${CLINIC_INFO.contact.whatsAppNumber}?text=${encodeURIComponent(CLINIC_INFO.contact.defaultWhatsAppMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-all text-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
