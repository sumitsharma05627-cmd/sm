import React, { useState, useEffect } from 'react';
import { GALLERY_PHOTOS } from '../data/clinicData.ts';
import { Image, Camera, Info, Maximize2, X, PlusCircle, CheckCircle2, UploadCloud } from 'lucide-react';
import { GalleryPhoto } from '../types.ts';

const LOCAL_STORAGE_GALLERY_KEY = 'sankatmochan_custom_gallery_photos';

export const GallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [customPhotos, setCustomPhotos] = useState<GalleryPhoto[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState<'clinic' | 'equipment' | 'fitness' | 'rehab'>('clinic');
  const [newPhotoDesc, setNewPhotoDesc] = useState('');
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  // Load any previously saved user uploads from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_GALLERY_KEY);
      if (saved) {
        setCustomPhotos(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadPreview || !newPhotoTitle.trim()) return;

    const newPhoto: GalleryPhoto = {
      id: `custom-${Date.now()}`,
      title: newPhotoTitle.trim(),
      category: newPhotoCategory,
      imageUrl: uploadPreview,
      altText: newPhotoTitle.trim(),
      description: newPhotoDesc.trim() || 'Uploaded clinic photograph from Sankat Mochan Center.'
    };

    const updated = [newPhoto, ...customPhotos];
    setCustomPhotos(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_GALLERY_KEY, JSON.stringify(updated));
    } catch {
      // Ignore quota errors
    }

    // Reset form
    setNewPhotoTitle('');
    setNewPhotoDesc('');
    setUploadPreview(null);
    setIsUploadOpen(false);
  };

  const allDisplayPhotos = [...customPhotos, ...GALLERY_PHOTOS];

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'clinic', label: 'Treatment Areas' },
    { id: 'rehab', label: 'Rehabilitation' },
    { id: 'fitness', label: 'Fitness Center' },
    { id: 'equipment', label: 'Modalities & Equipment' },
  ];

  const filteredPhotos = selectedCategory === 'all'
    ? allDisplayPhotos
    : allDisplayPhotos.filter(p => p.category === selectedCategory);

  const isAuthenticPhoto = (photoId: string) => {
    return (
      photoId.startsWith('g-owners') ||
      photoId.startsWith('g-ad-banner') ||
      photoId.startsWith('g-dr-ankit') ||
      photoId.startsWith('g-cervical') ||
      photoId.startsWith('g-clinic-hall') ||
      photoId.startsWith('g-fitness-gym') ||
      photoId.startsWith('custom-')
    );
  };

  return (
    <section id="gallery" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/70 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5 text-teal-700" />
            <span>Clinic & Facility Environment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Inside Our Center
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Take a look at authentic photographs of our clinical treatment bays, manual therapy procedures, neurological gait training facility, and active medical fitness gym at Gole Ka Mandir.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add / Upload Clinic Photo</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => {
            const isAuthentic = isAuthenticPhoto(photo.id);
            return (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs cursor-pointer transition-all hover:shadow-md hover:border-teal-500/40"
              >
                <div className="h-56 sm:h-64 overflow-hidden bg-slate-100 relative">
                  <img
                    src={photo.imageUrl}
                    alt={photo.altText}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Authentic Clinic Badge */}
                  {isAuthentic && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-xs text-teal-300 text-[10px] font-bold border border-teal-500/40 shadow-xs">
                        <CheckCircle2 className="w-3 h-3 text-teal-400" />
                        <span>Authentic Clinic Photo</span>
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/90 text-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 shadow-sm">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-1.5 bg-white">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold uppercase tracking-wider text-[10px] text-teal-700">
                      {photo.category}
                    </span>
                    <span className="text-[11px] text-slate-500">Tap to expand</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                    {photo.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {photo.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notice on Real Business Photography for Editability */}
        <div className="mt-10 max-w-2xl mx-auto p-4 bg-teal-50/70 border border-teal-200/80 rounded-xl text-xs text-teal-900 flex items-start gap-3">
          <Info className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block">Verified Gwalior Facility Showcase:</strong>
            These images feature the authentic premises of Sankat Mochan Physiotherapy & Fitness Center at Gole Ka Mandir, including Dr. Ankit Yagik’s cervical mobilization care, the neurological gait training arena, and active fitness rehabilitation gym.
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm p-4 flex items-center justify-center"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="bg-slate-950 flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.altText}
                className="w-full max-h-[70vh] object-contain"
              />
            </div>

            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                  {selectedPhoto.category}
                </span>
                {isAuthenticPhoto(selectedPhoto.id) && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Facility Photo
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {selectedPhoto.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedPhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Photo Upload Modal */}
      {isUploadOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs p-4 flex items-center justify-center"
          onClick={() => setIsUploadOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-bold text-slate-900">Upload Clinic Photo</h3>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Image File (JPG / PNG)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
              </div>

              {uploadPreview && (
                <div className="h-44 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img
                    src={uploadPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Photo Title / Procedure Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cervical Manual Therapy by Dr. Ankit Yagik"
                  value={newPhotoTitle}
                  onChange={(e) => setNewPhotoTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newPhotoCategory}
                    onChange={(e) => setNewPhotoCategory(e.target.value as 'clinic' | 'equipment' | 'fitness' | 'rehab')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  >
                    <option value="clinic">Treatment Areas</option>
                    <option value="rehab">Rehabilitation</option>
                    <option value="fitness">Fitness Center</option>
                    <option value="equipment">Modalities & Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Location / Bay
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Gole Ka Mandir Center"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description / Treatment Details (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the equipment, patient exercise, or clinical modality..."
                  value={newPhotoDesc}
                  onChange={(e) => setNewPhotoDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadPreview || !newPhotoTitle.trim()}
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Save to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
