export interface ServiceItem {
  id: string;
  title: string;
  category: 'pain' | 'sports' | 'ortho' | 'neuro' | 'general';
  tagline: string;
  description: string;
  conditions: string[];
  suitableFor: string;
  iconName: string;
  features: string[];
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  source: string;
  comment: string;
  highlight: string;
  treatment?: string;
  categoryTag?: 'sports' | 'spine' | 'joint' | 'cervical' | 'post-op';
  language?: 'Hindi' | 'English';
}

export interface DoctorProfile {
  name: string;
  role: string;
  qualifications: string;
  council: string;
  experienceHeadline: string;
  bio: string;
  avatarInitials: string;
  photoUrl?: string;
  specialties: string[];
  instagram?: string;
  instagramUrl?: string;
  youtube?: string;
  youtubeUrl?: string;
}

export interface VideoShowcase {
  title: string;
  hindiTitle: string;
  description: string;
  fileName: string;
  tags: string[];
  videoUrl?: string;
  youtubeEmbedId?: string;
  posterUrl?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'clinic' | 'equipment' | 'rehab' | 'fitness';
  imageUrl: string;
  altText: string;
  description: string;
}

export interface AppointmentFormData {
  fullName: string;
  phone: string;
  visitType: 'clinic' | 'home_visit';
  service: string;
  doctorPreference?: string;
  preferredDate: string;
  preferredTime: string;
  symptoms: string;
}
