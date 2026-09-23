// Centralized Clinic Knowledge Base for Sankat Mochan Physiotherapy & Fitness Center
// Pure local JavaScript/TypeScript logic. NO external AI APIs used.

import { CLINIC_INFO, CLINIC_SERVICES, VERIFIED_REVIEWS } from './clinicData.ts';

export interface ClinicKnowledgeBase {
  businessName: string;
  tagline: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: {
    primary: string;
    primaryRaw: string;
    secondary: string;
    secondaryRaw: string;
    direct: string;
    directRaw: string;
  };
  hours: {
    days: string;
    timings: string;
    note: string;
  };
  doctors: Array<{
    name: string;
    qualifications: string;
    role: string;
    council: string;
  }>;
  services: Array<{
    name: string;
    description: string;
    suitableFor: string;
  }>;
  fees: string;
  reviewsSummary: {
    rating: number;
    count: number;
    highlights: string[];
    sampleQuotes: Array<{ author: string; comment: string; treatment?: string }>;
  };
  homeVisits: {
    available: boolean;
    coverage: string;
  };
  directionsUrl: string;
}

export const clinicKnowledge: ClinicKnowledgeBase = {
  businessName: CLINIC_INFO.name,
  tagline: CLINIC_INFO.tagline,
  address: CLINIC_INFO.location.fullAddress,
  landmark: CLINIC_INFO.location.landmark,
  city: CLINIC_INFO.location.city,
  state: CLINIC_INFO.location.state,
  pincode: CLINIC_INFO.location.pincode,
  country: CLINIC_INFO.location.country,
  phone: {
    primary: CLINIC_INFO.contact.primaryPhone,
    primaryRaw: CLINIC_INFO.contact.primaryPhoneRaw,
    secondary: CLINIC_INFO.contact.secondaryPhone,
    secondaryRaw: CLINIC_INFO.contact.secondaryPhoneRaw,
    direct: CLINIC_INFO.contact.landlineOrAlt,
    directRaw: CLINIC_INFO.contact.landlineRaw
  },
  hours: {
    days: CLINIC_INFO.timings.days,
    timings: CLINIC_INFO.timings.hours,
    note: CLINIC_INFO.timings.recommendedSlotNote
  },
  doctors: [
    {
      name: CLINIC_INFO.doctor.name,
      qualifications: CLINIC_INFO.doctor.qualifications,
      role: CLINIC_INFO.doctor.designation,
      council: CLINIC_INFO.doctor.council
    },
    {
      name: 'Dr. Shruti Nahar',
      qualifications: 'BPT / MPT (PT), Certified Women’s Physical Health & Pediatric Clinician',
      role: 'Consultant Physiotherapist & Rehabilitation Specialist',
      council: 'Registered Physiotherapy Practitioner'
    }
  ],
  services: CLINIC_SERVICES.map((s) => ({
    name: s.title,
    description: s.description,
    suitableFor: s.suitableFor
  })),
  fees: 'Please contact the clinic for the latest charges. Consultation and treatment session charges vary depending on the condition, modalities required (e.g. manual therapy, electrotherapy, exercise conditioning), and whether care is in-clinic or a home visit.',
  reviewsSummary: {
    rating: 5.0,
    count: CLINIC_INFO.stats.totalReviews,
    highlights: [
      'Comprehensive physical diagnosis & root-cause analysis',
      'Punctual appointments with 1-on-1 doctor attention',
      'Effective pain relief without unnecessary medications',
      'Clean, sanitized private treatment bays',
      'Active exercise guidance and medical gym rehabilitation'
    ],
    sampleQuotes: VERIFIED_REVIEWS.slice(0, 3).map((r) => ({
      author: r.author,
      comment: r.comment,
      treatment: r.treatment
    }))
  },
  homeVisits: {
    available: true,
    coverage: 'Available across Gwalior for senior citizens, post-operative patients, or individuals with restricted mobility.'
  },
  directionsUrl: CLINIC_INFO.location.directionsUrl
};

export interface ChatbotResponse {
  text: string;
  actionType?: 'location' | 'appointment' | 'call' | 'services' | 'reviews' | 'quick_links';
  actionButton?: {
    label: string;
    url?: string;
    onClickType?: 'open_appointment' | 'get_directions' | 'call_clinic';
  };
  quickSuggestions?: string[];
}

// Local intelligence engine: handles intent parsing, medical safety checks, and queries
export function answerClinicQuestion(rawQuery: string): ChatbotResponse {
  const q = rawQuery.toLowerCase().trim();

  // 1. MEDICAL SAFETY CHECK: Never diagnose, never prescribe, never guarantee cure
  const diagnosisKeywords = [
    'what disease', 'diagnose me', 'do i have cancer', 'what illness',
    'which medicine', 'prescribe', 'cure 100%', 'guaranteed cure', 'can i take medicine',
    'what drug', 'infection', 'is it broken', 'am i dying', 'do i need surgery'
  ];
  if (diagnosisKeywords.some((k) => q.includes(k))) {
    return {
      text: `Medical Safety Notice: I cannot provide medical diagnoses or prescribe medications online.\n\nEvery musculoskeletal condition requires a hands-on physical assessment to evaluate joint mobility, nerve conduction, and posture. We strongly recommend scheduling an in-person assessment with Dr. Ankit Yagik at our clinic so your condition can be evaluated properly and safely.`,
      actionButton: {
        label: '📅 Request Clinical Assessment',
        onClickType: 'open_appointment'
      },
      quickSuggestions: ['📍 Location', '🕐 Timings', '🏥 Services', '📞 Contact']
    };
  }

  // 2. LOCATION & DIRECTIONS
  if (
    q.includes('where') ||
    q.includes('address') ||
    q.includes('location') ||
    q.includes('reach') ||
    q.includes('route') ||
    q.includes('landmark') ||
    q.includes('map') ||
    q.includes('directions') ||
    q.includes('kahan') ||
    q.includes('pata')
  ) {
    return {
      text: `📍 Clinic Address:\n${clinicKnowledge.businessName}\n${clinicKnowledge.address}\n\nLandmark: ${clinicKnowledge.landmark}\n\nAccessible via local transport with parking available for two-wheelers and cars.`,
      actionType: 'location',
      actionButton: {
        label: '🗺️ Get Directions on Google Maps',
        url: clinicKnowledge.directionsUrl,
        onClickType: 'get_directions'
      },
      quickSuggestions: ['🕐 Timings', '📅 Book Appointment', '📞 Call Now']
    };
  }

  // 3. TIMINGS & OPERATING HOURS
  if (
    q.includes('timing') ||
    q.includes('time') ||
    q.includes('hours') ||
    q.includes('open') ||
    q.includes('close') ||
    q.includes('when') ||
    q.includes('sunday') ||
    q.includes('samay') ||
    q.includes('kab')
  ) {
    return {
      text: `🕐 Operating Hours:\n• Days: ${clinicKnowledge.hours.days}\n• Hours: ${clinicKnowledge.hours.timings}\n\nNote: ${clinicKnowledge.hours.note}`,
      actionType: 'call',
      actionButton: {
        label: `📞 Call Clinic (${clinicKnowledge.phone.primary})`,
        url: `tel:${clinicKnowledge.phone.primaryRaw}`,
        onClickType: 'call_clinic'
      },
      quickSuggestions: ['📅 Book Appointment', '📍 Location', '🏥 Services']
    };
  }

  // 4. APPOINTMENT BOOKING
  if (
    q.includes('appointment') ||
    q.includes('book') ||
    q.includes('schedule') ||
    q.includes('consultation') ||
    q.includes('slot') ||
    q.includes('visit') ||
    q.includes('miliye') ||
    q.includes('booking')
  ) {
    return {
      text: `📅 Booking an Appointment:\nYou can request an appointment directly through our online form on this website, or call our direct phone line.\n\nWe offer both in-clinic consultations at Gole Ka Mandir and home visits across Gwalior.`,
      actionType: 'appointment',
      actionButton: {
        label: '📅 Book Appointment Form',
        onClickType: 'open_appointment'
      },
      quickSuggestions: ['📞 Call Clinic', '📍 Location', '💰 Fees']
    };
  }

  // 5. FEES & CHARGES
  if (
    q.includes('fee') ||
    q.includes('charge') ||
    q.includes('cost') ||
    q.includes('price') ||
    q.includes('rate') ||
    q.includes('kitna') ||
    q.includes('paisa') ||
    q.includes('rupee')
  ) {
    return {
      text: `💰 Clinic Charges:\n${clinicKnowledge.fees}\n\nYou can call our desk directly for transparent pricing based on your required treatment.`,
      actionType: 'call',
      actionButton: {
        label: `📞 Call for Charges (${clinicKnowledge.phone.primary})`,
        url: `tel:${clinicKnowledge.phone.primaryRaw}`,
        onClickType: 'call_clinic'
      },
      quickSuggestions: ['🏥 Services', '📅 Book Appointment', '📍 Location']
    };
  }

  // 6. SERVICES & TREATMENTS
  if (
    q.includes('service') ||
    q.includes('treatment') ||
    q.includes('therapy') ||
    q.includes('pain') ||
    q.includes('sciatica') ||
    q.includes('back') ||
    q.includes('neck') ||
    q.includes('cervical') ||
    q.includes('knee') ||
    q.includes('shoulder') ||
    q.includes('frozen') ||
    q.includes('sports') ||
    q.includes('stroke') ||
    q.includes('paralysis') ||
    q.includes('fitness') ||
    q.includes('ilaj')
  ) {
    const list = clinicKnowledge.services
      .slice(0, 5)
      .map((s, i) => `${i + 1}. ${s.name}: ${s.description.substring(0, 95)}...`)
      .join('\n\n');

    return {
      text: `🏥 Verified Clinical Services:\n\n${list}\n\nWe also offer Medical Fitness Training and Home Visits across Gwalior.`,
      actionType: 'services',
      actionButton: {
        label: '📅 Request Consultation for This Service',
        onClickType: 'open_appointment'
      },
      quickSuggestions: ['📅 Book Appointment', '💰 Fees', '📍 Location']
    };
  }

  // 7. DOCTOR & TEAM INFORMATION
  if (
    q.includes('doctor') ||
    q.includes('therapist') ||
    q.includes('ankit') ||
    q.includes('shruti') ||
    q.includes('who is') ||
    q.includes('qualification') ||
    q.includes('experience') ||
    q.includes('lead')
  ) {
    return {
      text: `👨‍⚕️ Clinical Leadership:\n\n• ${clinicKnowledge.doctors[0].name}: ${clinicKnowledge.doctors[0].role}. ${clinicKnowledge.doctors[0].qualifications}. Active ${clinicKnowledge.doctors[0].council}.\n\n• ${clinicKnowledge.doctors[1].name}: ${clinicKnowledge.doctors[1].role}. ${clinicKnowledge.doctors[1].qualifications}.\n\nBoth doctors focus on targeted 1-on-1 assessment, spine biomechanics, and active rehabilitation.`,
      actionButton: {
        label: '📅 Book Consultation with Doctor',
        onClickType: 'open_appointment'
      },
      quickSuggestions: ['🏥 Services', '⭐ Patient Reviews', '📞 Call Now']
    };
  }

  // 8. REVIEWS & PATIENT FEEDBACK
  if (
    q.includes('review') ||
    q.includes('rating') ||
    q.includes('feedback') ||
    q.includes('testimonial') ||
    q.includes('results') ||
    q.includes('patient') ||
    q.includes('star')
  ) {
    const sample = clinicKnowledge.reviewsSummary.sampleQuotes[0];
    return {
      text: `⭐ Patient Reviews & Rating:\n• Rating: ${clinicKnowledge.reviewsSummary.rating} / 5.0 Stars\n• Total Verified Reviews: ${clinicKnowledge.reviewsSummary.count}+\n\nPatient Highlight:\n"${sample.comment}"\n— ${sample.author} (${sample.treatment || 'Verified Patient'})\n\nYou can read all verified patient testimonials directly on this website in the Reviews section!`,
      actionType: 'reviews',
      actionButton: {
        label: '📅 Schedule Your Assessment',
        onClickType: 'open_appointment'
      },
      quickSuggestions: ['🏥 Services', '📍 Location', '📞 Contact']
    };
  }

  // 9. HOME VISITS
  if (
    q.includes('home') ||
    q.includes('ghar') ||
    q.includes('elderly') ||
    q.includes('bedridden') ||
    q.includes('visit')
  ) {
    return {
      text: `🏠 Home Visit Physiotherapy:\n${clinicKnowledge.homeVisits.coverage}\n\nOur physiotherapist visits with necessary portable modalities and exercise aids. Prior booking is required.`,
      actionButton: {
        label: '📅 Book Home Visit',
        onClickType: 'open_appointment'
      },
      quickSuggestions: ['📞 Call Clinic', '💰 Fees', '🕐 Timings']
    };
  }

  // 10. CONTACT & PHONE
  if (
    q.includes('contact') ||
    q.includes('phone') ||
    q.includes('call') ||
    q.includes('number') ||
    q.includes('mobile') ||
    q.includes('talk') ||
    q.includes('baat')
  ) {
    return {
      text: `📞 Verified Contact Numbers:\n• Primary / Appointments: ${clinicKnowledge.phone.primary}\n• Support Line: ${clinicKnowledge.phone.secondary}\n• Direct Desk: ${clinicKnowledge.phone.direct}\n\nOur team is available 24 hours for urgent clinical guidance.`,
      actionType: 'call',
      actionButton: {
        label: `📞 Call ${clinicKnowledge.phone.primary}`,
        url: `tel:${clinicKnowledge.phone.primaryRaw}`,
        onClickType: 'call_clinic'
      },
      quickSuggestions: ['📅 Book Appointment', '📍 Location', '🕐 Timings']
    };
  }

  // 11. GREETINGS
  if (
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey' ||
    q.includes('namaste') ||
    q.includes('good morning') ||
    q.includes('good evening')
  ) {
    return {
      text: `Hello! Welcome to ${clinicKnowledge.businessName}, Gwalior.\n\nI am your clinic assistant. How can I help you today? You can select any quick topic below or type your question.`,
      quickSuggestions: ['📍 Location', '🕐 Timings', '🏥 Services', '📅 Appointment', '💰 Fees', '⭐ Reviews', '📞 Contact']
    };
  }

  // 12. UNKNOWN QUESTION FALLBACK (Section 23 in prompt: "I'm not sure about that. I can help with our services, timings, location, appointments and general clinic information.")
  return {
    text: `I'm not sure about that. I can help with our services, timings, location, appointments and general clinic information.\n\nPlease choose one of the options below or call our clinic directly at ${clinicKnowledge.phone.primary}:`,
    quickSuggestions: ['🏥 Services', '🕐 Timings', '📍 Location', '📅 Appointment', '📞 Contact']
  };
}
