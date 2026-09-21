import React, { useState, useRef, useEffect } from 'react';
import { CLINIC_INFO } from '../data/clinicData.ts';
import { 
  Award, CheckCircle, ShieldCheck, MapPin, GraduationCap, 
  HeartPulse, UserCheck, Play, Video, Volume2, Sparkles,
  ArrowRight, Phone, MessageCircle, Stethoscope, Dumbbell,
  Pause, RotateCcw, Upload, Link2, ExternalLink, X, Camera
} from 'lucide-react';
import { DoctorProfile } from '../types.ts';
import { photoStore } from '../utils/photoStore.ts';

interface AboutSectionProps {
  onOpenAppointment: (service?: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenAppointment }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoMode, setVideoMode] = useState<'html5' | 'youtube'>('html5');
  const [videoSrc, setVideoSrc] = useState<string>(
    CLINIC_INFO.clinicVideo.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  );
  const [customVideoTitle, setCustomVideoTitle] = useState<string>('');
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [drAnkitPhoto, setDrAnkitPhoto] = useState<string | null>(photoStore.getDrAnkitPhoto());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const doctorFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const update = () => {
      setDrAnkitPhoto(photoStore.getDrAnkitPhoto());
    };
    update();
    return photoStore.subscribe(update);
  }, []);

  const handleDoctorPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        photoStore.setSlot('owner-dr-ankit', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setVideoSrc(objectUrl);
      setCustomVideoTitle(file.name);
      setVideoMode('html5');
      setIsVideoPlaying(true);
      setShowSourceModal(false);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
        }
      }, 300);
    }
  };

  const handleApplyUrl = () => {
    if (!inputUrl.trim()) return;
    const url = inputUrl.trim();
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      setVideoMode('youtube');
    } else {
      setVideoSrc(url);
      setVideoMode('html5');
    }
    setIsVideoPlaying(true);
    setShowSourceModal(false);
  };

  return (
    <section id="about" className="py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5 text-teal-700" />
            <span>Verified Clinic Background &amp; Specialists</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Meet Our Clinical Team &amp; Philosophy
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Led by Dr. Ankit Yagik and Dr. Shruti Nahar, bringing science-backed musculoskeletal diagnosis, manual therapy, and active exercise rehabilitation to Gola Ka Mandir, Gwalior.
          </p>
        </div>

        {/* Video Showcase Feature Card with WORKING VIDEO PLAYER */}
        <div className="mb-14 bg-slate-900 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* Video Player / Screen Box */}
            <div className="lg:col-span-7 bg-slate-950 relative min-h-[300px] sm:min-h-[380px] flex items-center justify-center p-4 sm:p-6">
              {!isVideoPlaying ? (
                <div className="relative w-full aspect-video min-h-[260px] sm:min-h-[320px] rounded-2xl overflow-hidden bg-gradient-to-tr from-slate-900 via-teal-950 to-slate-800 border border-slate-800 flex flex-col justify-between p-6 group">
                  {/* Poster Image Background */}
                  <img
                    src="/sankatmochan-physiotherapy-and-fitness-centre-gole-ka-mandir-gwalior-physiotherapists-15v5gevngz.jpg"
                    alt="Sankat Mochan Physiotherapy Clinic and Exercise Assessment"
                    className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-45 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/70 pointer-events-none" />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold backdrop-blur-xs">
                      <Video className="w-3.5 h-3.5" />
                      Featured In-Clinic Video
                    </span>
                    <span className="text-[11px] text-slate-300 font-mono bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-700">
                      Active Playable Video
                    </span>
                  </div>

                  <div className="relative z-10 text-center my-auto py-6">
                    <button
                      id="play-intro-video-btn"
                      onClick={() => {
                        setIsVideoPlaying(true);
                        setTimeout(() => {
                          if (videoRef.current) {
                            videoRef.current.play().catch(() => {});
                          }
                        }, 200);
                      }}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center justify-center mx-auto shadow-2xl shadow-teal-500/40 hover:scale-110 active:scale-95 transition-all cursor-pointer group/btn"
                      aria-label="Play clinic introductory video"
                    >
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-slate-950 ml-1 group-hover/btn:scale-110 transition-transform" />
                    </button>
                    <p className="mt-4 text-xs sm:text-sm font-bold text-white drop-shadow-md">
                      Click to Play Physical Assessment &amp; Exercise Video
                    </p>
                    <p className="text-[11px] text-teal-300 font-medium">
                      "{CLINIC_INFO.clinicVideo.hindiTitle}"
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="flex items-center gap-1">
                      <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                      Assessment &amp; Movement Guidance
                    </span>
                    <span className="text-teal-400 font-semibold">1080p HD Video</span>
                  </div>
                </div>
              ) : (
                /* REAL PLAYABLE VIDEO PLAYER */
                <div className="w-full aspect-video min-h-[260px] sm:min-h-[320px] rounded-2xl overflow-hidden bg-black flex flex-col justify-between border border-slate-800 relative shadow-2xl">
                  
                  {/* Video Top Controls */}
                  <div className="flex items-center justify-between p-3 bg-slate-900/90 border-b border-slate-800 text-xs z-10">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span className="font-bold text-teal-300 truncate">
                        {customVideoTitle || CLINIC_INFO.clinicVideo.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setShowSourceModal(true)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700 cursor-pointer"
                        title="Change video or upload MP4"
                      >
                        <Upload className="w-3 h-3 text-teal-400" />
                        <span className="hidden sm:inline">Change / Upload</span>
                      </button>

                      <button
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.pause();
                          }
                          setIsVideoPlaying(false);
                        }}
                        className="px-2.5 py-1 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs font-bold border border-rose-800/60 cursor-pointer"
                      >
                        ✕ Close
                      </button>
                    </div>
                  </div>

                  {/* Playable Media Area */}
                  <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
                    {videoMode === 'html5' ? (
                      <video
                        ref={videoRef}
                        src={videoSrc}
                        poster="/sankatmochan-physiotherapy-and-fitness-centre-gole-ka-mandir-gwalior-physiotherapists-15v5gevngz.jpg"
                        controls
                        autoPlay
                        playsInline
                        className="w-full h-full object-contain max-h-[380px]"
                      >
                        Your browser does not support HTML5 video playback.
                      </video>
                    ) : (
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube-nocookie.com/embed/${CLINIC_INFO.clinicVideo.youtubeEmbedId}?autoplay=1&rel=0`}
                        title="Clinic Rehabilitation Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </div>

                  {/* Video Subtitle Footer */}
                  <div className="p-2.5 bg-slate-950 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                    <span className="truncate">
                      <strong>File:</strong> {customVideoTitle || CLINIC_INFO.clinicVideo.fileName}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setVideoMode(videoMode === 'html5' ? 'youtube' : 'html5')}
                        className="text-teal-400 hover:text-teal-300 font-semibold underline cursor-pointer"
                      >
                        Switch to {videoMode === 'html5' ? 'YouTube Stream' : 'In-Clinic Video'}
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3 h-3" /> Select Local MP4
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Video Context & Description */}
            <div className="lg:col-span-5 p-6 sm:p-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Evidence-Based Rehabilitation</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {CLINIC_INFO.clinicVideo.hindiTitle}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {CLINIC_INFO.clinicVideo.description}
              </p>

              <div className="space-y-2 pt-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Comprehensive Biomechanical Assessment:</strong> Testing spinal alignment, joint angles, and nerve glides.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Dedicated Active Exercises:</strong> Moving beyond passive machines to strengthen stabiliser muscles.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Dedicated One-on-One Evaluation:</strong> Transparent, evidence-based care accessible to everyone in Gwalior.</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-3">
                <button
                  id="video-card-book-btn"
                  onClick={() => onOpenAppointment()}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-teal-600 hover:bg-teal-500 active:scale-98 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer"
                >
                  <span>Book Initial Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setIsVideoPlaying(true);
                    setTimeout(() => {
                      if (videoRef.current) {
                        videoRef.current.play().catch(() => {});
                      }
                    }, 200);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs border border-slate-700 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
                  <span>Watch Video</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Change Video / Source Selection Modal */}
        {showSourceModal && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowSourceModal(false)}
          >
            <div
              className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-bold text-base text-teal-400 flex items-center gap-2">
                  <Video className="w-5 h-5" /> Change Video Demonstration
                </h4>
                <button
                  onClick={() => setShowSourceModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Option 1: Upload or Choose Local MP4 Video File
                  </label>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Upload className="w-4 h-4" /> Browse Video from Computer / Mobile
                  </button>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Select "{CLINIC_INFO.clinicVideo.fileName}" or any MP4 file from your device.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <label className="block text-slate-300 font-semibold mb-1">
                    Option 2: Paste Direct MP4 or YouTube Video Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/video.mp4 or YouTube link"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-teal-400"
                    />
                    <button
                      onClick={handleApplyUrl}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold rounded-xl border border-slate-700 cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <label className="block text-slate-300 font-semibold mb-1">
                    Option 3: Reset to Standard In-Clinic Exercise Video
                  </label>
                  <button
                    onClick={() => {
                      setVideoSrc('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
                      setCustomVideoTitle('');
                      setVideoMode('html5');
                      setShowSourceModal(false);
                      setIsVideoPlaying(true);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-teal-400" /> Reset Default Clinical Demo Video
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Doctors Grid: Dr. Ankit Yagik & Dr. Shruti Nahar */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Our Qualified Physiotherapy Practitioners
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Qualified, empathetic, and evidence-driven clinical leadership.
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              IAP Affiliated Center
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CLINIC_INFO.doctors.map((doc: DoctorProfile) => (
              <div
                key={doc.name}
                id={`doctor-card-${doc.avatarInitials.toLowerCase()}`}
                className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-5">
                  {/* Doctor Header & Avatar / Photo */}
                  <div className="flex items-start gap-4">
                    {/* Hidden input for Dr. Ankit photo upload */}
                    {doc.name.includes('Ankit') && (
                      <input
                        ref={doctorFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleDoctorPhotoUpload}
                      />
                    )}
                    {doc.name.includes('Ankit') && drAnkitPhoto ? (
                      <div 
                        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-teal-600/60 shadow-md shrink-0 bg-slate-100 group/avatar cursor-pointer"
                        onClick={() => doctorFileInputRef.current?.click()}
                        title="Click to change Dr. Ankit's photo"
                      >
                        <img
                          src={drAnkitPhoto}
                          alt={doc.name}
                          className="w-full h-full object-cover object-top transition-transform group-hover/avatar:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                          Change
                        </div>
                      </div>
                    ) : doc.photoUrl ? (
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-teal-600/40 shadow-md shrink-0 bg-slate-100">
                        <img
                          src={doc.photoUrl}
                          alt={doc.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            // On error, hide the broken image and show avatar initials cleanly
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <div 
                        className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-teal-700 to-slate-800 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0 ${doc.name.includes('Ankit') ? 'cursor-pointer hover:ring-2 hover:ring-teal-400' : ''}`}
                        onClick={() => {
                          if (doc.name.includes('Ankit')) doctorFileInputRef.current?.click();
                        }}
                        title={doc.name.includes('Ankit') ? "Click to set Dr. Ankit's original photo" : undefined}
                      >
                        {doc.avatarInitials}
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
                        <Award className="w-3 h-3 text-teal-600" />
                        {doc.council}
                      </div>
                      <h4 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                        {doc.name}
                      </h4>
                      <p className="text-xs text-slate-600 font-semibold">
                        {doc.role}
                      </p>
                    </div>
                  </div>

                  {/* Qualifications & Credentials */}
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-start gap-2">
                      <GraduationCap className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 block font-semibold">Qualifications:</strong>
                        <span>{doc.qualifications}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 pt-1 border-t border-slate-100">
                      <Stethoscope className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 block font-semibold">Clinical Focus:</strong>
                        <span>{doc.experienceHeadline}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {doc.bio}
                  </p>

                  {/* Specialties Pills */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Core Specializations:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {doc.specialties.map((spec, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg text-xs bg-white border border-slate-200 font-medium text-slate-700 shadow-2xs"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Social & Direct Contact Links */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {doc.instagramUrl && (
                      <a
                        href={doc.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-pink-600 font-medium transition-colors flex items-center gap-1"
                      >
                        <span>{doc.instagram}</span>
                      </a>
                    )}
                    {doc.youtubeUrl && (
                      <a
                        href={doc.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-red-600 font-medium transition-colors flex items-center gap-1"
                      >
                        <span>{doc.youtube}</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenAppointment(doc.name)}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Consult {doc.name.split(' ')[1]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Treatment Philosophy Pillars */}
        <div className="mt-16 pt-12 border-t border-slate-200 space-y-8">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-bold text-slate-900">
              Why Our Approach Yields Faster Recovery
            </h3>
            <p className="text-slate-600 text-sm mt-1 leading-relaxed">
              We eliminate passive dependance. Here is how our four-step recovery philosophy protects you from recurring injuries:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black text-sm">
                01
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Root-Cause Assessment</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We spend dedicated time pinpointing whether pain is originating from disc bulge, muscular spasm, joint wear, or nerve irritation.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black text-sm">
                02
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Targeted Manual Therapy</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hands-on joint mobilization, myofascial release, and certified electrotherapy modalities to quickly bring acute pain under control.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black text-sm">
                03
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Active Movement Re-education</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Utilizing our on-site therapeutic fitness equipment to rebuild muscle strength, joint stability, and core endurance safely.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black text-sm">
                04
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Permanent Prevention</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Personalized home exercise routines, ergonomics counseling for desk/work life, and home visit access for elderly or post-op patients.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
