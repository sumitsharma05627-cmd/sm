import React, { useState, useEffect } from 'react';
import { CLINIC_INFO } from '../data/clinicData.ts';
import { Phone, MessageCircle, Menu, X, Calendar, MapPin, Award, Star } from 'lucide-react';
import { ClinicLogo } from './ClinicLogo.tsx';

interface NavbarProps {
  onOpenAppointment: (prefilledService?: string) => void;
  onOpenChatbot?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAppointment, onOpenChatbot }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Top verified alert & contact bar */}
      <div id="top-announcement-bar" className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-semibold text-teal-400">
              <Award className="w-3.5 h-3.5" />
              IAP Member
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-300">
              Dr. Ankit Yagik & Dr. Shruti Nahar
            </span>
            <span className="text-slate-500">•</span>
            <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
              <Star className="w-3 h-3 fill-amber-400" />
              Rated 5.0 (169+ Reviews)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline-flex items-center gap-1 text-slate-300">
              <MapPin className="w-3 h-3 text-teal-400" />
              Gole Ka Mandir, Gwalior
            </span>
            <a
              id="top-bar-call-link"
              href={`tel:${CLINIC_INFO.contact.primaryPhoneRaw}`}
              className="inline-flex items-center gap-1 text-teal-300 hover:text-teal-200 font-medium transition-colors"
            >
              <Phone className="w-3 h-3" />
              {CLINIC_INFO.contact.primaryPhone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        id="main-header"
        className={`sticky top-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
            : 'bg-white border-b border-slate-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <a id="brand-logo-link" href="#home" className="flex items-center gap-3 group">
            <ClinicLogo size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight tracking-tight">
                  Sankat Mochan
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200/60">
                  Gwalior
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Physiotherapy & Fitness Center
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav" className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-teal-700 transition-colors py-1 relative"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              id="header-call-btn"
              href={`tel:${CLINIC_INFO.contact.primaryPhoneRaw}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              <span>Call Us</span>
            </a>

            <button
              id="header-book-appointment-btn"
              onClick={() => onOpenAppointment()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:scale-98 rounded-lg shadow-sm shadow-teal-600/20 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-quick-call-btn"
              onClick={() => onOpenAppointment()}
              className="sm:hidden px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 rounded-lg shadow-sm"
            >
              Book
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div id="mobile-nav-drawer" className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-1 pb-4 border-b border-slate-100">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Direct Contact:</span>
                <span className="font-semibold text-slate-800">{CLINIC_INFO.contact.primaryPhone}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  id="mobile-drawer-call-btn"
                  href={`tel:${CLINIC_INFO.contact.primaryPhoneRaw}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  Call Clinic
                </a>
                <button
                  id="mobile-drawer-ask-btn"
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenChatbot) onOpenChatbot();
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-teal-50 text-teal-900 border border-teal-200 text-xs font-semibold rounded-lg hover:bg-teal-100 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-teal-600" />
                  Ask Us
                </button>
              </div>
              <button
                id="mobile-drawer-appointment-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAppointment();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-teal-600 text-white text-sm font-bold rounded-lg hover:bg-teal-700 shadow-md shadow-teal-700/20 transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                Book Consultation
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
