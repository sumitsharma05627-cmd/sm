import React, { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { OwnersWelcomeSection } from './components/OwnersWelcomeSection.tsx';
import { Hero } from './components/Hero.tsx';
import { EmergencyBanner } from './components/EmergencyBanner.tsx';
import { AdBannerSection } from './components/AdBannerSection.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { FitnessSection } from './components/FitnessSection.tsx';
import { WhyChooseUs } from './components/WhyChooseUs.tsx';
import { ReviewsSection } from './components/ReviewsSection.tsx';
import { GallerySection } from './components/GallerySection.tsx';
import { AppointmentSection } from './components/AppointmentSection.tsx';
import { ContactAndLocation } from './components/ContactAndLocation.tsx';
import { FaqSection } from './components/FaqSection.tsx';
import { Footer } from './components/Footer.tsx';
import { MobileStickyBar } from './components/MobileStickyBar.tsx';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton.tsx';
import { AppointmentModal } from './components/AppointmentModal.tsx';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);

  const handleOpenAppointment = (serviceTitle?: string) => {
    setSelectedService(serviceTitle);
    setIsModalOpen(true);
  };

  const handleCloseAppointment = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top sticky responsive navbar */}
      <Navbar onOpenAppointment={handleOpenAppointment} />

      {/* Main content body */}
      <main className="flex-1">
        {/* 1. Owners Welcome Spotlight in Front of Website (First as requested) */}
        <OwnersWelcomeSection onOpenAppointment={handleOpenAppointment} />

        {/* 2. Main Hero Section */}
        <Hero onOpenAppointment={handleOpenAppointment} />

        {/* 3. Fast Contact & Acute Pain Strip */}
        <EmergencyBanner />

        {/* 4. Official Clinical Ad Banner Section (Second Image as Ad Banner) */}
        <AdBannerSection onOpenAppointment={handleOpenAppointment} />

        {/* 5. About Section (Doctor credentials, playable video player, and philosophy) */}
        <AboutSection onOpenAppointment={() => handleOpenAppointment()} />

        {/* 6. Services Section (Verified therapies & treatments) */}
        <ServicesSection onOpenAppointment={handleOpenAppointment} />

        {/* 7. Fitness Center Section (Therapeutic conditioning & athletic rehab) */}
        <FitnessSection onOpenAppointment={handleOpenAppointment} />

        {/* 8. Why Choose Us (Grounded in verified facts) */}
        <WhyChooseUs />

        {/* 9. Reviews Section (Internal verified patient reviews, 0 external redirects) */}
        <ReviewsSection onOpenAppointment={handleOpenAppointment} />

        {/* 10. Photo Gallery (Clean clinic spaces & authentic photographs) */}
        <GallerySection />

        {/* 11. In-Page Appointment Form Section */}
        <AppointmentSection prefilledService={selectedService} />

        {/* 12. Contact & Location Section (Google Map & Address) */}
        <ContactAndLocation />

        {/* 13. Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer onOpenAppointment={handleOpenAppointment} />

      {/* Floating WhatsApp Quick Action Button */}
      <WhatsAppFloatingButton />

      {/* Mobile Sticky Bottom Action Bar (Call, WhatsApp, Book) */}
      <MobileStickyBar onOpenAppointment={() => handleOpenAppointment()} />

      {/* Appointment Popup Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={handleCloseAppointment}
        prefilledService={selectedService}
      />
    </div>
  );
}
