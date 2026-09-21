import { ServiceItem, ReviewItem, FaqItem, GalleryPhoto, DoctorProfile, VideoShowcase } from '../types.ts';

export const CLINIC_INFO = {
  name: 'Sankat Mochan Physiotherapy & Fitness Center',
  shortName: 'Sankat Mochan Physio',
  tagline: 'Helping You Move Better, Recover Faster & Live Pain-Free',
  subtitle: 'Evidence-based physiotherapy, sports rehabilitation, and medical fitness care in Gwalior.',
  
  doctor: {
    name: 'Dr. Ankit Yagik',
    designation: 'Lead Physiotherapist & Musculoskeletal Specialist',
    qualifications: 'MPT (General & Community Based Rehabilitation), Fellowship in Musculoskeletal Physiotherapy',
    council: 'Member of Indian Association of Physiotherapists (IAP)',
    experienceHeadline: 'Specialist in Sports Injuries, Spine Biomechanics & Musculoskeletal Rehab',
    bio: 'Dr. Ankit Yagik is an established physiotherapist in Gwalior focused on targeted clinical assessment, personalized manual therapy, and active exercise rehabilitation. He holds an MPT in General & Community Based Physiotherapy & Rehabilitation along with a Fellowship in Musculoskeletal Physiotherapy and is an active member of the Indian Association of Physiotherapists (IAP). His clinical approach avoids temporary quick-fixes, prioritizing root-cause biomechanical correction and functional recovery.',
    instagram: '@a_sportsphysio',
    instagramUrl: 'https://www.instagram.com/a_sportsphysio',
    youtube: '@apex_sportsphysioIN',
    youtubeUrl: 'https://www.youtube.com/@apex_sportsphysioIN',
    linkedin: 'Dr. Ankit Yagik',
  },

  doctors: [
    {
      name: 'Dr. Ankit Yagik',
      role: 'Lead Physiotherapist & Musculoskeletal Specialist',
      qualifications: 'MPT (General & Community Based Rehabilitation), Fellowship in Musculoskeletal Physiotherapy',
      council: 'Member of Indian Association of Physiotherapists (IAP)',
      experienceHeadline: 'Specialist in Sports Injuries, Spine Biomechanics, Stroke & Orthopaedic Rehab',
      bio: 'Dr. Ankit Yagik heads Sankat Mochan Physiotherapy & Fitness Center with a focus on targeted clinical assessment, personalized manual therapy, and active exercise rehabilitation. He holds an MPT in General & Community Based Physiotherapy & Rehabilitation along with a Fellowship in Musculoskeletal Physiotherapy and is an active member of the Indian Association of Physiotherapists (IAP). His clinical approach prioritizes root-cause biomechanical correction and functional recovery across stroke, paralysis, spine, and complex sports conditions.',
      avatarInitials: 'AY',
      photoUrl: '/sankatmochan-physiotherapy-and-fitness-centre-gole-ka-mandir-gwalior-physiotherapists-15v5gevngz.jpg',
      specialties: [
        'Stroke & Paralysis Rehabilitation',
        'Cervical & Sciatica Spine Biomechanics',
        'Diabetic Neuropathies & Numbness',
        'Frozen Shoulder & Arthritis',
        'Joint Replacement Post-Op Care',
        'Sports, Ligament & Tendon Injuries',
        'Old Age & Geriatric Movement Therapy'
      ],
      instagram: '@a_sportsphysio',
      instagramUrl: 'https://www.instagram.com/a_sportsphysio',
      youtube: '@apex_sportsphysioIN',
      youtubeUrl: 'https://www.youtube.com/@apex_sportsphysioIN',
    },
    {
      name: 'Dr. Shruti Nahar',
      role: 'Consultant Physiotherapist & Rehabilitation Specialist',
      qualifications: 'BPT / MPT (PT), Registered Physiotherapy Practitioner',
      council: 'Certified Women’s Physical Health, Pediatric & Postural Clinician',
      experienceHeadline: 'Specialist in Women’s Health, Gynecology Rehab, Pediatric & Occupational Therapy',
      bio: 'Dr. Shruti Nahar brings dedicated clinical expertise in gynecological physical therapy, women’s musculoskeletal health, pediatric developmental disorders, and occupational rehabilitation. She provides specialized, compassionate care for periods pain (PCOD), pre and post pregnancy core conditioning, cerebral palsy (C.P. child), autism, Down syndrome, ADHD, and pelvic health.',
      avatarInitials: 'SN',
      photoUrl: '',
      specialties: [
        'Periods Pain & Irregular Periods (PCOD)',
        'Pre & Post Pregnancy Therapy & Core Rehab',
        'Breast & Vaginal Post-Natal Management',
        'Pediatric Rehabilitation (C.P. Child, Autism, ADHD)',
        'Down Syndrome & Neuro Developmental Support',
        'Occupational Therapy & Motor Skills',
        'Pelvic Health & Incontinence Management'
      ],
      instagram: '@a_sportsphysio',
      instagramUrl: 'https://www.instagram.com/a_sportsphysio',
    }
  ] as DoctorProfile[],

  clinicVideo: {
    title: 'Move Better, Live Better — Step Into Active Recovery',
    hindiTitle: 'बेहतर मूवमेंट, बेहतर जीवन की ओर एक कदम! मिलिए हमारे Physiotherapist से',
    description: 'मिलिए हमारे Physiotherapist से, जो सही clinical assessment, personalized rehabilitation और active movement drills के साथ आपको दर्दमुक्त और मजबूत जीवन की ओर ले जाते हैं।',
    fileName: 'बेहतर मूवमेंट, बेहतर जीवन की ओर एक कदम!मिलिए हमारे Physiotherapist से, जो सही assessment, person.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    youtubeEmbedId: 'm4_qZfLCEu0',
    posterUrl: '/sankatmochan-physiotherapy-and-fitness-centre-gole-ka-mandir-gwalior-physiotherapists-15v5gevngz.jpg',
    tags: ['Clinical Assessment', 'Targeted Exercise Therapy', 'Gwalior Physiotherapy', 'Evidence-Based Care']
  } as VideoShowcase,

  contact: {
    primaryPhone: '+91 75099 77899',
    primaryPhoneRaw: '+917509977899',
    secondaryPhone: '+91 72230 91723',
    secondaryPhoneRaw: '+917223091723',
    landlineOrAlt: '+91 73836 82178',
    landlineRaw: '+917383682178',
    whatsAppNumber: '917509977899',
    whatsAppDisplay: '+91 75099 77899',
    email: 'info@sankatmochanphysio.in',
    defaultWhatsAppMessage: 'Hello Dr. Ankit, I found Sankat Mochan Physiotherapy & Fitness Center online and would like to know more about booking an appointment.',
  },

  location: {
    addressLine1: 'Ground Floor, Rudra Associates Building',
    landmark: 'Near Mishra Hospital, Gola Ka Mandir',
    city: 'Gwalior',
    state: 'Madhya Pradesh',
    pincode: '474005',
    country: 'India',
    fullAddress: 'Ground Floor, Rudra Associates Building, Near Mishra Hospital, Gola Ka Mandir, Gwalior, Madhya Pradesh - 474005',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sankat+Mochan+Physiotherapy+%26+Fitness+Centre+Near+Mishra+Hospital+Gole+Ka+Mandir+Gwalior',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Ground+Floor+Rudra+Associates+Building+Near+Mishra+Hospital+Gole+Ka+Mandir+Gwalior+Madhya+Pradesh+474005',
    publicTransitNote: 'Conveniently accessible via local transport near Gola Ka Mandir square with parking space available.',
  },

  timings: {
    days: 'Monday to Sunday',
    hours: 'Open 24 Hours (Prior Appointment Recommended)',
    recommendedSlotNote: 'To ensure dedicated one-on-one attention without waiting, please call or WhatsApp in advance to confirm your preferred session time.',
    appointmentNote: 'Prior appointment recommended for comprehensive physical assessment and one-on-one therapy.',
    homeVisitsAvailable: true,
    homeVisitArea: 'Available across Gwalior for senior citizens, post-operative, or limited-mobility patients.',
  },

  stats: {
    googleRating: 5.0,
    totalReviews: 169,
    ratingSource: 'Public Listing & Verified Patient Reviews',
    iapCertified: true,
  }
};

export const CLINIC_SERVICES: ServiceItem[] = [
  {
    id: 'sports-rehab',
    title: 'Sports Injury Rehabilitation',
    category: 'sports',
    tagline: 'Aggressive & structured recovery for athletes and fitness enthusiasts',
    description: 'Comprehensive rehabilitation for acute and chronic sports injuries including ligament sprains, muscle tears, shin splints, runner’s knee, and tennis elbow. Focuses on returning to sport safely with restored strength and agility.',
    conditions: ['ACL / MCL Ligament Sprains', 'Hamstring & Quadriceps Strains', 'Tennis / Golfer’s Elbow', 'Rotator Cuff & Shoulder Impingement', 'Ankle Inversion Sprains'],
    suitableFor: 'Athletes, gym-goers, runners, and physically active individuals with sports-related injuries.',
    iconName: 'Activity',
    features: ['Biomechanical movement screen', 'Targeted eccentric strengthening', 'Agility & return-to-sport testing', 'Injury recurrence prevention protocols']
  },
  {
    id: 'cervical-neck-pain',
    title: 'Cervical & Neck Pain Treatment',
    category: 'pain',
    tagline: 'Relief from chronic neck stiffness, radiating nerve pain & headache',
    description: 'Targeted assessment and manual treatment designed to relieve cervical muscle spasms, improve cervical spine mobility, and alleviate nerve compression associated with desk posture, phone strain, or degenerative disc changes.',
    conditions: ['Cervical Spondylosis', 'Tech Neck / Forward Head Posture', 'Trapezius Spasms', 'Cervicogenic Headaches', 'Radiating Arm Numbness / Tingling'],
    suitableFor: 'IT professionals, students, drivers, and individuals suffering from persistent neck stiffness or radiating arm pain.',
    iconName: 'Smile',
    features: ['Gentle manual cervical mobilization', 'Postural ergonomic correction', 'Deep neck flexor activation', 'Radiating nerve glides']
  },
  {
    id: 'low-back-pain-sciatica',
    title: 'Low Back Pain & Sciatica Therapy',
    category: 'pain',
    tagline: 'Evidence-based spinal decompression & core stabilization',
    description: 'Specialized non-surgical physical therapy for acute lumbar strain, lumbar disc bulge (PIVD), sciatica nerve pain, and degenerative lumbar stiffness. Replaces temporary rest with active recovery.',
    conditions: ['Slip Disc / PIVD', 'Sciatica (Nerve Pain down leg)', 'Lumbar Muscle Spasms', 'Sacroiliac (SI) Joint Dysfunction', 'Postural Lower Back Ache'],
    suitableFor: 'Individuals struggling to sit, stand, or bend due to sharp or dull lower back and buttock pain.',
    iconName: 'ShieldAlert',
    features: ['Mechanical traction & spinal decompression', 'Core stability & transverse abdominis training', 'Lumbar extension & flexion protocols', 'Spine-safe daily living education']
  },
  {
    id: 'joint-pain-arthritis',
    title: 'Joint Pain & Osteoarthritis Care',
    category: 'ortho',
    tagline: 'Restore joint mobility, reduce stiffness & delay joint wear',
    description: 'Individualized therapy sessions for knee osteoarthritis, adhesive capsulitis (frozen shoulder), hip impingement, and joint stiffness. Utilizes joint mobilization techniques and low-impact strengthening.',
    conditions: ['Knee Osteoarthritis', 'Frozen Shoulder (Adhesive Capsulitis)', 'Hip Joint Stiffness', 'Bursitis & Tendinopathy', 'Ankle & Foot Plantar Fasciitis'],
    suitableFor: 'Middle-aged & senior patients suffering from morning joint stiffness, knee cracking, or inability to raise the arm.',
    iconName: 'Bone',
    features: ['Grade I-IV joint mobilization', 'Quadriceps & gluteal strengthening', 'Shoulder pulley & resistance band drills', 'Gait training & weight distribution']
  },
  {
    id: 'neuro-hand-rehab',
    title: 'Neuro Hand & Neurological Rehabilitation',
    category: 'neuro',
    tagline: 'Neuromuscular re-education and functional motor retraining',
    description: 'Dedicated functional therapy for patients recovering from neurological conditions such as stroke (hemiplegia), facial palsy, neuropathy, and localized neuro hand movement impairments.',
    conditions: ['Post-Stroke Motor Deficit', 'Neuro Hand Fine Motor Loss', 'Bell’s Palsy / Facial Paralysis', 'Peripheral Neuropathy', 'Balance & Coordination Issues'],
    suitableFor: 'Patients requiring dedicated neuromuscular re-education to regain hand grip, walking balance, or daily independence.',
    iconName: 'Brain',
    features: ['Fine motor task-oriented training', 'Proprioceptive neuromuscular facilitation (PNF)', 'Balance & fall-prevention drills', 'Sensory re-education']
  },
  {
    id: 'post-operative-fracture',
    title: 'Post-Operative & Fracture Rehabilitation',
    category: 'ortho',
    tagline: 'Regain full range of motion and joint stability following surgery',
    description: 'Structured phase-by-phase recovery following orthopedic surgeries (such as knee/hip replacement, ACL reconstruction, tendon repair) and cast removal after bone fractures.',
    conditions: ['Post Total Knee / Hip Replacement', 'Post ACL / Meniscus Surgery', 'Post-Casting Joint Stiffness', 'Post-Fracture Muscle Atrophy', 'Hardware Fixation Recovery'],
    suitableFor: 'Patients after orthopedic surgery needing physician-coordinated physical rehabilitation.',
    iconName: 'Stethoscope',
    features: ['Scar tissue mobilization', 'Gradual range-of-motion progression', 'Progressive resistance loading', 'Gait re-education with walking aids']
  },
  {
    id: 'therapeutic-fitness',
    title: 'Therapeutic Fitness & Conditioning',
    category: 'general',
    tagline: 'Medical exercise therapy combining physical therapy with fitness',
    description: 'Because our facility combines physiotherapy and fitness, we offer guided exercise training to build muscular endurance, strengthen postural stabilizers, and prevent future musculoskeletal breakdowns.',
    conditions: ['General Muscular Weakness', 'Poor Postural Endurance', 'Sedentary Lifestyle Conditioning', 'Weight-bearing Joint Protection', 'Cardiorespiratory Stamina'],
    suitableFor: 'Individuals recovering from pain who want to safely transition into long-term fitness and active living without re-injury.',
    iconName: 'Dumbbell',
    features: ['Supervised posture-safe workouts', 'Core & spine stabilization', 'Resistance machine & free-weight progression', 'Functional movement training']
  },
  {
    id: 'home-visit-physiotherapy',
    title: 'Home Visit Physiotherapy in Gwalior',
    category: 'general',
    tagline: 'Professional physiotherapy delivered in the comfort of your home',
    description: 'For bedridden, senior, acute post-operative, or mobility-impaired patients unable to travel to our Gole Ka Mandir clinic, Dr. Ankit and team provide personalized home visit therapy across Gwalior.',
    conditions: ['Bedridden & Elderly Patients', 'Immediate Post-Surgical Recovery', 'Severe Acute Spinal Spasms', 'Neurological Patients with Travel Barriers', 'Wheelchair-bound Individuals'],
    suitableFor: 'Patients residing in Gwalior who require on-site therapy at home with portable modalities and exercises.',
    iconName: 'Home',
    features: ['Portable electrotherapy & ultrasound modalities', 'Home environment ergonomic setup', 'Family caregiver transfer training', 'Bedside range of motion & chest physio']
  }
];

export const VERIFIED_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-bhoomika-pal',
    author: 'Bhoomika Pal',
    rating: 5,
    date: '9 months ago',
    source: 'Verified Patient Review',
    highlight: 'Therapist listened carefully, effective exercises & fast recovery',
    comment: 'I recently completed my physiotherapy treatment here and I am extremely satisfied with the results. The therapist listened carefully to my problem, explained the treatment plan clearly, and guided me patiently throughout every session. The exercises and therapy techniques were effective and helped me recover faster than expected. The environment is clean, well-maintained, and appointments are always on time. Overall, wonderful experience — I would definitely recommend this clinic for anyone dealing with pain, injury recovery, or mobility issues.',
    treatment: 'Injury Recovery & Mobility Rehabilitation',
    categoryTag: 'joint',
    language: 'English'
  },
  {
    id: 'rev-manoj-kumar',
    author: 'Manoj Kumar',
    rating: 5,
    date: '3 months ago',
    source: 'Verified Patient Review',
    highlight: 'Kandhe ke dard me pehle hi din se aaram mila',
    comment: 'Meri wife ke kandhe main Kafi dino se dard tha maine yaha par aakar therapy karwai ek din me hi bohot aaram mila aur treatment complete hone par dard puri tarah theek ho gaya. Doctor saab ka vyavhar bohot accha hai aur unka tarika bohot scientific hai.',
    treatment: 'Shoulder Pain & Frozen Shoulder Therapy',
    categoryTag: 'joint',
    language: 'Hindi'
  },
  {
    id: 'rev-rishabh-singh',
    author: 'Rishabh Singh',
    rating: 5,
    date: '4 months ago',
    source: 'Verified Patient Review',
    highlight: 'Sports injury and ligament rehab handled professionally',
    comment: 'Best physiotherapy center in Gwalior. I had a sports injury with severe knee ligament pain while playing cricket. The therapist diagnosed the biomechanical deficit and guided me through sports-specific conditioning. Back to active running and training without discomfort.',
    treatment: 'Sports Injury & Ligament Rehabilitation',
    categoryTag: 'sports',
    language: 'English'
  },
  {
    id: 'rev-deependra-rajput',
    author: 'Deependra Rajput',
    rating: 5,
    date: '5 months ago',
    source: 'Verified Patient Review',
    highlight: 'Running pain & shin splints completely resolved',
    comment: 'Running pain aur muscle stiffness ki wajah se workout karna mushkil ho gaya tha. Yaha par therapy aur running biomechanics exercises se complete relief mila. Physiotherapy session ke dauran proper attention diya gaya. Great experience.',
    treatment: 'Running Pain & Athletic Conditioning',
    categoryTag: 'sports',
    language: 'Hindi'
  },
  {
    id: 'rev-raju-rathore',
    author: 'Raju Rathore',
    rating: 5,
    date: '6 months ago',
    source: 'Verified Patient Review',
    highlight: 'Severe back pain cured with manual therapy and stretching',
    comment: 'Mujhe kafi samay se kamar aur peeth me severe pain rehta tha. Yahan par manual therapy aur specific stretching exercises se pura dard theek ho gaya. Doctor saab ne bohot patient hokar samjhaya. Clinic ka atmosphere bhi clean aur shant hai.',
    treatment: 'Lower Back Pain & Spine Rehabilitation',
    categoryTag: 'spine',
    language: 'Hindi'
  },
  {
    id: 'rev-shalini-dandotiya',
    author: 'Shalini Dandotiya',
    rating: 5,
    date: '7 months ago',
    source: 'Verified Patient Review',
    highlight: 'Cervical neck stiffness gone in just a few sessions',
    comment: 'Suffering from severe cervical neck pain and computer posture stiffness. The team diagnosed the issue accurately and treated it with modern therapy techniques. In just a few sessions, neck stiffness was gone and posture improved noticeably.',
    treatment: 'Cervical Spondylosis & Neck Pain',
    categoryTag: 'cervical',
    language: 'English'
  },
  {
    id: 'rev-ranjana-agrawal',
    author: 'Ranjana Agrawal',
    rating: 5,
    date: '8 months ago',
    source: 'Verified Patient Review',
    highlight: 'Ghutno ke dard me chalna firna aasan ho gaya',
    comment: 'Ghutno ke dard (knee osteoarthritis) se chalne me bahut dikkat thi. Yaha par doctor saheb ne bahut dhyan se therapy di aur ghar ke liye safe exercises batayi. Ab chalne firne me koi pareshani nahi hoti. Senior citizens ke liye bohot respectful care hai.',
    treatment: 'Knee Osteoarthritis & Joint Mobility',
    categoryTag: 'joint',
    language: 'Hindi'
  },
  {
    id: 'rev-vivek-tawar',
    author: 'Vivek Tawar',
    rating: 5,
    date: '9 months ago',
    source: 'Verified Patient Review',
    highlight: 'Post fracture joint stiffness recovered with progressive mobilization',
    comment: 'Very professional and dedicated care. Post fracture stiffness was treated patiently with gradual joint mobilization and progressive exercises. One of the best physiotherapy clinics in Gwalior with genuine focus on patient recovery.',
    treatment: 'Post-Fracture Joint Mobilization',
    categoryTag: 'post-op',
    language: 'English'
  },
  {
    id: 'rev-tarun-verma',
    author: 'Tarun Verma',
    rating: 5,
    date: '10 months ago',
    source: 'Verified Patient Review',
    highlight: 'Scientific diagnosis and dedicated rehabilitation care',
    comment: 'Honest diagnosis and thorough evaluation. The treatment approach is scientific and avoids unnecessary medicines. The doctor personally monitors exercise form throughout the session. Highly recommend Sankat Mochan Physio.',
    treatment: 'Sciatica & Musculoskeletal Therapy',
    categoryTag: 'spine',
    language: 'English'
  }
];

export const FAQS: FaqItem[] = [
  {
    question: 'Where is Sankat Mochan Physiotherapy & Fitness Center located in Gwalior?',
    answer: 'The clinic is conveniently located at Ground Floor, Rudra Associates Building, Near Mishra Hospital, Gole Ka Mandir, Gwalior, Madhya Pradesh - 474005. It is easily accessible via public transport and private vehicles.'
  },
  {
    question: 'How does the initial assessment and treatment evaluation work?',
    answer: 'Your initial consultation includes a comprehensive physical evaluation where Dr. Ankit Yagik assesses your range of motion, joint mechanics, posture, and pain triggers to develop an individualized rehabilitation roadmap.'
  },
  {
    question: 'What are the qualifications of the lead physiotherapist?',
    answer: 'The center is headed by Dr. Ankit Yagik, who holds an MPT (Master of Physiotherapy) in General & Community Based Physiotherapy & Rehabilitation, a Fellowship in Musculoskeletal Physiotherapy, and is an active member of the Indian Association of Physiotherapists (IAP).'
  },
  {
    question: 'Do you provide home visit physiotherapy services in Gwalior?',
    answer: 'Yes. We provide personalized home visit physiotherapy for senior citizens, bedridden individuals, post-operative orthopedic cases, or patients who cannot physically travel to our Gole Ka Mandir clinic.'
  },
  {
    question: 'What conditions do you treat most frequently?',
    answer: 'Our verified focus areas include Sports Injury Rehabilitation, Cervical & Neck Spondylosis, Low Back Pain & Sciatica (Slip Disc), Knee Osteoarthritis, Frozen Shoulder, Post-Surgical Rehabilitation, and Neuro Hand motor retraining.'
  },
  {
    question: 'Are the clinic timings 24 hours? Do I need prior booking?',
    answer: 'While the center listing operates around the clock for acute consultations, we strongly advise patients to call or WhatsApp us in advance to schedule a dedicated appointment slot so that Dr. Ankit can dedicate uninterrupted one-on-one time for your session.'
  },
  {
    question: 'How can I book an appointment quickly?',
    answer: 'You can tap the "Book Appointment" button on this site, call our direct line at +91 73836 82178, or click the WhatsApp button to chat instantly with pre-filled details.'
  },
  {
    question: 'What should I bring to my first appointment?',
    answer: 'Please bring any recent X-rays, MRI reports, surgical discharge summaries, or physician prescriptions if available. Wear comfortable, loose-fitting clothing that allows easy access to the affected joint or body area.'
  }
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'g-dr-ankit-portrait',
    title: 'Dr. Ankit Yagik — Lead Physiotherapist & Founder',
    category: 'clinic',
    imageUrl: '/sankatmochan-physiotherapy-and-fitness-centre-gole-ka-mandir-gwalior-physiotherapists-15v5gevngz.jpg',
    altText: 'Dr. Ankit Yagik seated at consultation desk with official nameplate and credentials at Sankat Mochan Physiotherapy',
    description: 'Lead physiotherapist Dr. Ankit Yagik (MPT, Fellowship, MIAP) at his consultation desk, specializing in sports injury rehabilitation, spine biomechanics, stroke, and joint restoration.'
  },
  {
    id: 'g-1',
    title: 'Clinical Treatment & Examination Bay',
    category: 'clinic',
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80',
    altText: 'Clean modern physiotherapy treatment bed and clinical examination area',
    description: 'Hygienic, private treatment spaces equipped with electrotherapy and manual therapy tables.'
  },
  {
    id: 'g-2',
    title: 'Active Functional Rehabilitation & Drills',
    category: 'rehab',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    altText: 'Physiotherapist guiding patient through active movement rehabilitation exercise',
    description: 'Targeted exercise therapy using resistance bands, balance trainers, and functional drills.'
  },
  {
    id: 'g-4',
    title: 'Cervical & Spine Traction Modalities',
    category: 'equipment',
    imageUrl: 'https://images.unsplash.com/photo-1583912267670-6575ad472688?w=800&auto=format&fit=crop&q=80',
    altText: 'Modern physical therapy equipment and assessment modalities',
    description: 'Sterilized modalities including TENS, IFT, ultrasound, and cervical-lumbar traction units.'
  }
];
