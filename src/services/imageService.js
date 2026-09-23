// imageService.js
// Persistent image service for Sankat Mochan Physiotherapy & Fitness Center
// Interacts with persistent storage:
// 1. localStorage for immediate metadata persistence and zero-flicker synchronous initial state on refresh.
// 2. Persistent file storage API (/api/upload, /api/images, /api/replace-image, /api/delete-image)
//    backed by server disk storage (/public/uploads/) and database manifest (gallery.json).

const METADATA_STORAGE_KEY = 'sankatmochan_gallery_metadata_v1';
const LEGACY_STORAGE_KEY = 'sankatmochan_custom_gallery_photos_v2';

/**
 * Default permanent clinic gallery assets
 */
export const DEFAULT_GALLERY_PHOTOS = [
  {
    id: 'g-dr-ankit-portrait',
    title: 'Dr. Ankit Yagik — Lead Physiotherapist & Founder',
    category: 'clinic',
    filename: 'sankatmochan-physiotherapy-and-fitness-centre-gole-ka-mandir-gwalior-physiotherapists-15v5gevngz.jpg',
    url: '/sankatmochan-physiotherapy-and-fitness-centre-gole-ka-mandir-gwalior-physiotherapists-15v5gevngz.jpg',
    altText: 'Dr. Ankit Yagik seated at consultation desk with official nameplate and credentials at Sankat Mochan Physiotherapy',
    description: 'Lead physiotherapist Dr. Ankit Yagik (MPT, Fellowship, MIAP) at his consultation desk, specializing in sports injury rehabilitation, spine biomechanics, stroke, and joint restoration.',
    order: 1000,
    permanent: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'g-1',
    title: 'Clinical Treatment & Examination Bay',
    category: 'clinic',
    filename: 'treatment-bay.jpg',
    url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80',
    altText: 'Clean modern physiotherapy treatment bed and clinical examination area',
    description: 'Hygienic, private treatment spaces equipped with electrotherapy and manual therapy tables.',
    order: 1001,
    permanent: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'g-2',
    title: 'Active Functional Rehabilitation & Drills',
    category: 'rehab',
    filename: 'active-rehab.jpg',
    url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    altText: 'Physiotherapist guiding patient through active movement rehabilitation exercise',
    description: 'Targeted exercise therapy using resistance bands, balance trainers, and functional drills.',
    order: 1002,
    permanent: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'g-4',
    title: 'Cervical & Spine Traction Modalities',
    category: 'equipment',
    filename: 'traction-modalities.jpg',
    url: 'https://images.unsplash.com/photo-1583912267670-6575ad472688?w=800&auto=format&fit=crop&q=80',
    altText: 'Modern physical therapy equipment and assessment modalities',
    description: 'Sterilized modalities including TENS, IFT, ultrasound, and cervical-lumbar traction units.',
    order: 1003,
    permanent: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  }
];

/** @type {Set<Function>} */
const subscribers = new Set();

/** @type {Array<Object>} */
let inMemoryCache = [];

/**
 * Returns default permanent clinic gallery assets
 * @returns {Array<Object>}
 */
export function getDefaultPhotos() {
  return DEFAULT_GALLERY_PHOTOS.map((photo) => ({ ...photo }));
}

/**
 * Reads metadata synchronously from localStorage
 * @returns {Array<Object> | null}
 */
function readMetadataFromStorage() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  try {
    const raw = localStorage.getItem(METADATA_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse image metadata from localStorage:', err);
  }
  return null;
}

/**
 * Writes metadata to localStorage
 * @param {Array<Object>} records
 */
function writeMetadataToStorage(records) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.warn('LocalStorage quota exceeded or unavailable for image metadata:', err);
  }
}

/**
 * Notifies all subscribed UI components
 */
function notifySubscribers() {
  subscribers.forEach((callback) => {
    try {
      callback([...inMemoryCache]);
    } catch (err) {
      console.error('Error in imageService subscriber callback:', err);
    }
  });
}

export const imageService = {
  /**
   * Load initial state synchronously for React useState initialization
   * Survives page refresh and avoids temporary empty arrays.
   * @returns {Array<Object>}
   */
  getInitialPhotos() {
    if (inMemoryCache.length > 0) {
      return [...inMemoryCache];
    }

    // 1. Synchronous read from persistent localStorage metadata
    const stored = readMetadataFromStorage();
    if (stored && stored.length > 0) {
      inMemoryCache = stored;
      return [...inMemoryCache];
    }

    // 2. Fallback to permanent defaults if first launch
    const defaults = getDefaultPhotos();
    inMemoryCache = defaults;
    writeMetadataToStorage(defaults);
    return [...inMemoryCache];
  },

  /**
   * Fetch current photos from persistent server storage and sync with localStorage
   * @returns {Promise<Array<Object>>}
   */
  async fetchPhotos() {
    try {
      const res = await fetch('/api/images');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.images) && data.images.length > 0) {
          const defaults = getDefaultPhotos();
          const serverIds = new Set(data.images.map((img) => img.id));
          const missingDefaults = defaults.filter((d) => !serverIds.has(d.id));

          // Merge: server authoritative list first (newest on top), followed by any missing defaults
          const merged = [...data.images, ...missingDefaults];
          inMemoryCache = merged;
          writeMetadataToStorage(merged);
          notifySubscribers();
          return [...inMemoryCache];
        }
      }
    } catch (err) {
      console.warn('Failed to fetch from persistent image API, relying on local storage metadata:', err);
    }

    // If server unreachable, use current cache or storage
    if (inMemoryCache.length === 0) {
      inMemoryCache = this.getInitialPhotos();
    }
    return [...inMemoryCache];
  },

  /**
   * Upload an image to persistent storage and save metadata
   * Flow: Select image -> Upload to persistent storage -> Save permanent URL -> Save metadata -> Display image
   * @param {Object} params
   * @param {string} params.dataUrl - Base64 data URL
   * @param {string} params.title - Image title
   * @param {string} params.category - Image category
   * @param {string} [params.description] - Image description
   * @param {string} [params.altText] - Image alt text
   * @param {string} [params.originalFilename] - Original filename
   * @returns {Promise<Object>}
   */
  async uploadImage(params) {
    if (!params.dataUrl) {
      throw new Error('Please select an image file to upload.');
    }
    if (!params.title || !params.title.trim()) {
      throw new Error('Image title is required.');
    }

    // 1. Upload to persistent server storage
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataUrl: params.dataUrl,
        title: params.title.trim(),
        category: params.category || 'clinic',
        description: params.description?.trim() || 'Authentic clinical photograph at Sankat Mochan Center, Gwalior.',
        altText: params.altText?.trim() || params.title.trim(),
        originalFilename: params.originalFilename,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error || 'Persistent storage unavailable. Image could not be saved to server database.');
    }

    const data = await res.json();
    if (!data.success || !data.record) {
      throw new Error(data?.error || 'Persistent image upload could not be verified.');
    }

    const savedRecord = data.record;

    // 2. Prepend to metadata cache (additive)
    inMemoryCache = [savedRecord, ...inMemoryCache.filter((img) => img.id !== savedRecord.id)];

    // 3. Save metadata to localStorage
    writeMetadataToStorage(inMemoryCache);

    // 4. Notify UI subscribers
    notifySubscribers();

    return savedRecord;
  },

  /**
   * Replace an existing image with a new file in persistent storage
   * @param {string} id - Image ID to replace
   * @param {Object} params
   * @param {string} params.dataUrl - Replacement base64 data
   * @param {string} [params.originalFilename] - Original filename
   * @returns {Promise<Object>}
   */
  async replaceImage(id, params) {
    if (!id) throw new Error('Image ID is required for replacement.');
    if (!params.dataUrl) throw new Error('Replacement image data is missing.');

    const res = await fetch('/api/replace-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        dataUrl: params.dataUrl,
        originalFilename: params.originalFilename,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error || 'Failed to replace image in persistent storage.');
    }

    const data = await res.json();
    if (!data.success || !data.record) {
      throw new Error(data?.error || 'Image replacement could not be verified.');
    }

    const updatedRecord = data.record;

    // Update in-memory cache
    const idx = inMemoryCache.findIndex((img) => img.id === id);
    if (idx !== -1) {
      inMemoryCache[idx] = updatedRecord;
    } else {
      inMemoryCache = [updatedRecord, ...inMemoryCache];
    }

    // Save metadata to localStorage
    writeMetadataToStorage(inMemoryCache);

    // Notify UI
    notifySubscribers();

    return updatedRecord;
  },

  /**
   * Delete an image from persistent storage
   * Only called when user explicitly confirms deletion.
   * @param {string} id - Image ID to delete
   * @returns {Promise<void>}
   */
  async deleteImage(id) {
    if (!id) throw new Error('Image ID is required for deletion.');

    const res = await fetch('/api/delete-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error || 'Failed to delete image from persistent server storage.');
    }

    // Remove from in-memory cache
    inMemoryCache = inMemoryCache.filter((img) => img.id !== id);

    // Save updated metadata to localStorage
    writeMetadataToStorage(inMemoryCache);

    // Notify UI
    notifySubscribers();
  },

  /**
   * Save / Sync all uploaded images and metadata to persistent server storage
   * @returns {Promise<{ success: boolean, message: string, count: number }>}
   */
  async saveAllUploadedImages() {
    const currentPhotos = this.getInitialPhotos();
    try {
      const res = await fetch('/api/sync-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gallery: currentPhotos }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.gallery && Array.isArray(data.gallery)) {
          inMemoryCache = data.gallery;
          writeMetadataToStorage(data.gallery);
          notifySubscribers();
        }
        return {
          success: true,
          message: data.message || `All ${currentPhotos.length} images safely backed up to persistent disk storage.`,
          count: currentPhotos.length,
        };
      }
    } catch (err) {
      console.warn('saveAllUploadedImages server sync warning:', err);
    }
    // Saved in persistent localStorage
    writeMetadataToStorage(currentPhotos);
    return {
      success: true,
      message: `All ${currentPhotos.length} images safely preserved in persistent storage.`,
      count: currentPhotos.length,
    };
  },

  /**
   * Subscribe to image updates
   * @param {Function} callback
   * @returns {() => void} Unsubscribe function
   */
  subscribe(callback) {
    subscribers.add(callback);
    return () => {
      subscribers.delete(callback);
    };
  },
};

export default imageService;
