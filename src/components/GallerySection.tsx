import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Info, Maximize2, X, PlusCircle, CheckCircle2, UploadCloud, 
  Trash2, RefreshCw, Settings, Eye, AlertCircle, FileCheck, Layers
} from 'lucide-react';
import imageService, { getImages, addImage, replaceImage, deleteImage } from '../services/imageService.js';
import { PersistentImageRecord, ImageCategory } from '../utils/persistentStorage.ts';

export const GallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<PersistentImageRecord | null>(null);
  const [photos, setPhotos] = useState<PersistentImageRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Views: 'gallery' or 'manager'
  const [activeTab, setActiveTab] = useState<'gallery' | 'manager'>('gallery');

  // Add Image Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ImageCategory>('clinic');
  const [newDesc, setNewDesc] = useState('');
  const [uploadDataUrl, setUploadDataUrl] = useState<string | null>(null);
  const [originalFilename, setOriginalFilename] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Replace Image Modal State
  const [replacingPhoto, setReplacingPhoto] = useState<PersistentImageRecord | null>(null);
  const [replacementDataUrl, setReplacementDataUrl] = useState<string | null>(null);
  const [replacementFilename, setReplacementFilename] = useState<string>('');
  const [isReplacing, setIsReplacing] = useState(false);

  // Delete Confirmation Modal State
  const [deletingPhoto, setDeletingPhoto] = useState<PersistentImageRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingAll, setIsSavingAll] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveAllImages = async () => {
    setIsSavingAll(true);
    setErrorMessage(null);
    try {
      const res = await imageService.saveAllUploadedImages();
      setSuccessMessage(res.message);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch {
      setErrorMessage('Could not complete image backup.');
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsSavingAll(false);
    }
  };

  // Load image library from imageService on component mount
  useEffect(() => {
    // 1. Load image library from imageService
    try {
      const initialImages = imageService.getImages();
      if (initialImages && initialImages.length > 0) {
        setPhotos(initialImages as PersistentImageRecord[]);
      }
    } catch (err) {
      console.error('Failed to load initial images from imageService:', err);
    } finally {
      setIsLoading(false);
    }

    // 2. Fetch latest authoritative records from persistent storage
    imageService.fetchPhotos().then((records: any[]) => {
      if (records && records.length > 0) {
        setPhotos(records as PersistentImageRecord[]);
      }
    }).catch((err) => {
      console.warn('Failed to fetch remote images from imageService:', err);
    });

    // 3. Subscribe to real-time updates from imageService
    const unsubscribe = imageService.subscribe((updatedPhotos: any[]) => {
      setPhotos(updatedPhotos as PersistentImageRecord[]);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Handle file selection for Add Image
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setOriginalFilename(file.name);
    // Suggest title from filename if empty
    if (!newTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setNewTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadDataUrl(reader.result);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read the selected image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  // Submit Add Image to Persistent Storage
  const handleSaveNewPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadDataUrl) {
      setErrorMessage('Please select an image file to upload.');
      return;
    }
    if (!newTitle.trim()) {
      setErrorMessage('Please enter a title for the photograph.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      // Real persistent upload into Persistent File Storage + LocalStorage Metadata
      await imageService.addImage({
        dataUrl: uploadDataUrl,
        title: newTitle.trim(),
        category: newCategory,
        description: newDesc.trim() || 'Authentic clinical photograph at Sankat Mochan Center, Gwalior.',
        altText: newTitle.trim(),
        originalFilename: originalFilename
      });

      setSuccessMessage('Image permanently saved to clinic storage. It will remain after page refreshes.');
      setTimeout(() => setSuccessMessage(null), 4000);

      // Reset form
      setNewTitle('');
      setNewDesc('');
      setUploadDataUrl(null);
      setOriginalFilename('');
      setIsAddOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setErrorMessage(err?.message || 'Image could not be permanently saved. Please check storage configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle file selection for Replace Image
  const handleReplaceFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setReplacementFilename(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setReplacementDataUrl(reader.result);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read the replacement image file.');
    };
    reader.readAsDataURL(file);
  };

  // Submit Replace Image
  const handleConfirmReplace = async () => {
    if (!replacingPhoto || !replacementDataUrl) return;

    setIsReplacing(true);
    setErrorMessage(null);

    try {
      await imageService.replaceImage(
        replacingPhoto.id,
        {
          dataUrl: replacementDataUrl,
          originalFilename: replacementFilename
        }
      );

      setSuccessMessage(`Successfully updated "${replacingPhoto.title}" in persistent storage.`);
      setTimeout(() => setSuccessMessage(null), 4000);

      setReplacingPhoto(null);
      setReplacementDataUrl(null);
      setReplacementFilename('');
      if (replaceFileInputRef.current) replaceFileInputRef.current.value = '';
    } catch (err: any) {
      setErrorMessage(err?.message || 'Image could not be permanently saved. Please check storage configuration.');
    } finally {
      setIsReplacing(false);
    }
  };

  // Submit Delete Image
  const handleConfirmDelete = async () => {
    if (!deletingPhoto) return;

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await imageService.deleteImage(deletingPhoto.id);
      setSuccessMessage(`Deleted "${deletingPhoto.title}" from storage.`);
      setTimeout(() => setSuccessMessage(null), 3000);
      setDeletingPhoto(null);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not delete image from persistent storage.');
    } finally {
      setIsDeleting(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'clinic', label: 'Clinic' },
    { id: 'physiotherapy', label: 'Physiotherapy' },
    { id: 'rehab', label: 'Rehabilitation' },
    { id: 'equipment', label: 'Equipment' },
    { id: 'exterior', label: 'Exterior' },
    { id: 'interior', label: 'Interior' },
    { id: 'fitness', label: 'Fitness' },
    { id: 'team', label: 'Team' },
    { id: 'owner', label: 'Owner' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'other', label: 'Other' },
  ];

  const filteredPhotos = selectedCategory === 'all'
    ? photos
    : photos.filter((p) => p.category === selectedCategory || (selectedCategory === 'physiotherapy' && p.category === 'rehab'));

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Permanent Asset';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime()) || d.getFullYear() <= 2026 && d.getMonth() === 0 && d.getDate() === 1) {
        return 'Permanent Asset';
      }
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Permanent Asset';
    }
  };

  return (
    <section id="gallery" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/70 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5 text-teal-700" />
            <span>Clinic &amp; Facility Environment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Inside Our Center
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Take a look at authentic photographs of our clinical treatment bays, manual therapy procedures, neurological gait training facility, and active medical fitness gym at Gole Ka Mandir.
          </p>

          {/* Action Toolbar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              id="btn-add-clinic-photo"
              onClick={() => {
                setErrorMessage(null);
                setIsAddOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Image</span>
            </button>

            <button
              id="btn-toggle-image-manager"
              onClick={() => setActiveTab(activeTab === 'gallery' ? 'manager' : 'gallery')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                activeTab === 'manager'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {activeTab === 'gallery' ? (
                <>
                  <Settings className="w-4 h-4 text-teal-600" />
                  <span>Open Image Manager ({photos.length})</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-teal-400" />
                  <span>Switch to Gallery View</span>
                </>
              )}
            </button>

            <button
              id="btn-save-all-images"
              onClick={handleSaveAllImages}
              disabled={isSavingAll}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-75 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-emerald-200" />
              <span>{isSavingAll ? 'Saving & Backing Up...' : 'Save All Uploaded Images'}</span>
            </button>
          </div>

          {/* Persistent Storage Feedback Alerts */}
          {successMessage && (
            <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* TAB 1: VISITOR GALLERY VIEW */}
        {/* ======================================================== */}
        {activeTab === 'gallery' && (
          <>
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
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs cursor-pointer transition-all hover:shadow-md hover:border-teal-500/40"
                >
                  <div className="h-56 sm:h-64 overflow-hidden bg-slate-100 relative">
                    <img
                      src={photo.url}
                      alt={photo.altText || photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Permanent Asset Status Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-xs text-teal-300 text-[10px] font-bold border border-teal-500/40 shadow-xs">
                        <CheckCircle2 className="w-3 h-3 text-teal-400" />
                        <span>Permanent Photo</span>
                      </span>
                    </div>

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
                      <span className="text-[11px] text-slate-500">{formatDate(photo.createdAt)}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                      {photo.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {photo.description || 'Authentic facility photo of Sankat Mochan Center.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ======================================================== */}
        {/* TAB 2: IMAGE MANAGER VIEW (CRUD, PREVIEW, REPLACE, DELETE) */}
        {/* ======================================================== */}
        {activeTab === 'manager' && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                  <h3 className="text-base font-bold text-white">Clinic Image Manager</h3>
                </div>
                <p className="text-xs text-slate-300">
                  Every uploaded image is saved persistently to database storage and survives browser refreshes and site updates.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Add Image</span>
                </button>
              </div>
            </div>

            {/* Image Manager Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  {/* Image Preview Box */}
                  <div>
                    <div className="h-52 bg-slate-950 relative overflow-hidden group">
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-xs text-teal-300 text-[10px] font-bold border border-teal-500/30">
                          <CheckCircle2 className="w-3 h-3 text-teal-400" />
                          <span>Permanent</span>
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 z-10">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono">
                          {item.filename}
                        </span>
                      </div>
                    </div>

                    {/* Metadata Details */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="uppercase font-bold tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                          {item.category}
                        </span>
                        <span className="text-slate-500 font-medium">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-500 line-clamp-2">
                        {item.description || 'Authentic photograph from Sankat Mochan Center.'}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar: Replace & Delete */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setReplacingPhoto(item);
                        setReplacementDataUrl(null);
                        setReplacementFilename('');
                        setErrorMessage(null);
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3 text-teal-600" />
                      <span>Replace</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDeletingPhoto(item);
                        setErrorMessage(null);
                      }}
                      className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold transition-colors cursor-pointer"
                      title="Delete this image"
                    >
                      <Trash2 className="w-3 h-3 text-rose-600" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notice on Real Business Photography for Editability */}
        <div className="mt-10 max-w-2xl mx-auto p-4 bg-teal-50/70 border border-teal-200/80 rounded-xl text-xs text-teal-900 flex items-start gap-3">
          <Info className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block">Permanent Storage Verification:</strong>
            All uploaded photographs are safely stored in browser persistent database storage with unique filenames. Images survive browser refresh, navigation, and site reloads.
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* LIGHTBOX MODAL */}
      {/* ======================================================== */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm p-4 flex items-center justify-center"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative"
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
                src={selectedPhoto.url}
                alt={selectedPhoto.altText || selectedPhoto.title}
                className="w-full max-h-[70vh] object-contain"
              />
            </div>

            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                  {selectedPhoto.category}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Permanent Photo Record
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {selectedPhoto.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedPhoto.description}
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Filename: <strong className="text-slate-600 font-mono">{selectedPhoto.filename}</strong></span>
                <span>Date: {formatDate(selectedPhoto.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD PHOTO MODAL */}
      {/* ======================================================== */}
      {isAddOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs p-4 flex items-center justify-center"
          onClick={() => !isSaving && setIsAddOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-bold text-slate-900">+ Add Permanent Clinic Image</h3>
              </div>
              <button
                onClick={() => !isSaving && setIsAddOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveNewPhoto} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Real Image File (JPG / PNG / WebP)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Original bytes will be preserved without cartoonization or modification.
                </p>
              </div>

              {uploadDataUrl && (
                <div className="space-y-1">
                  <span className="block font-semibold text-slate-700">Preview:</span>
                  <div className="h-44 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center">
                    <img
                      src={uploadDataUrl}
                      alt="Upload Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Photo Title / Procedure Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cervical Manual Therapy by Dr. Ankit Yagik"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ImageCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  >
                    <option value="clinic">Clinic</option>
                    <option value="physiotherapy">Physiotherapy</option>
                    <option value="rehab">Rehabilitation</option>
                    <option value="equipment">Equipment</option>
                    <option value="exterior">Exterior</option>
                    <option value="interior">Interior</option>
                    <option value="fitness">Fitness</option>
                    <option value="team">Team</option>
                    <option value="owner">Owner</option>
                    <option value="gallery">Gallery</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Location / Center
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Gole Ka Mandir Center, Gwalior"
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
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl font-semibold text-slate-700 cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !uploadDataUrl || !newTitle.trim()}
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-xl font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Permanently...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Save Permanently to Storage</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* REPLACE PHOTO MODAL */}
      {/* ======================================================== */}
      {replacingPhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs p-4 flex items-center justify-center"
          onClick={() => !isReplacing && setReplacingPhoto(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-bold text-slate-900">Replace Selected Image</h3>
              </div>
              <button
                onClick={() => !isReplacing && setReplacingPhoto(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-3">
              <p className="text-slate-600">
                You are replacing: <strong className="text-slate-900">{replacingPhoto.title}</strong>
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500">Current Photo:</span>
                  <div className="h-32 rounded-xl overflow-hidden border border-slate-200 bg-black flex items-center justify-center">
                    <img
                      src={replacingPhoto.url}
                      alt={replacingPhoto.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500">New Replacement:</span>
                  <div className="h-32 rounded-xl overflow-hidden border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
                    {replacementDataUrl ? (
                      <img
                        src={replacementDataUrl}
                        alt="New replacement"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-[11px] text-slate-400 text-center p-2">
                        Select new file below
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Choose New Image File
                </label>
                <input
                  ref={replaceFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleReplaceFileSelect}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                />
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {errorMessage}
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={isReplacing}
                  onClick={() => setReplacingPhoto(null)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl font-semibold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isReplacing || !replacementDataUrl}
                  onClick={handleConfirmReplace}
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-xl font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {isReplacing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Replacing...</span>
                    </>
                  ) : (
                    <span>Confirm Replace</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {deletingPhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs p-4 flex items-center justify-center"
          onClick={() => !isDeleting && setDeletingPhoto(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Confirm Photo Deletion</h3>
                <p className="text-xs text-slate-500">This action will permanently delete this image from storage.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <img
                src={deletingPhoto.url}
                alt={deletingPhoto.title}
                className="w-14 h-14 object-cover rounded-lg shrink-0 bg-slate-200"
              />
              <div className="text-xs overflow-hidden">
                <h4 className="font-bold text-slate-900 truncate">{deletingPhoto.title}</h4>
                <p className="text-slate-500 truncate">Category: {deletingPhoto.category}</p>
                <p className="text-slate-400 font-mono text-[10px] truncate">{deletingPhoto.filename}</p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {errorMessage}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingPhoto(null)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl font-semibold text-slate-700 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Permanently</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
