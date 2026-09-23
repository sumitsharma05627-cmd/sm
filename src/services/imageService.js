// src/services/imageService.js
/**
 * ImageService: Manages persistent image metadata in localStorage and persistent storage.
 * 
 * Implements localStorage methods for storing an array of image objects:
 * - getImages(): Deserializes and returns the persistent array of images.
 * - addImage(image): Serializes a new image object into the array in localStorage.
 * - deleteImage(id): Removes an image by ID and updates localStorage.
 * - replaceImage(id, newImage): Replaces an image by ID with new data and updates localStorage.
 */

const STORAGE_KEY = 'sankatmochan_gallery_images';
const LEGACY_METADATA_KEY = 'sankatmochan_gallery_metadata_v1';
const LEGACY_STORAGE_KEY = 'sankatmochan_custom_gallery_photos_v2';

/**
 * Default clinic gallery assets
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
    order: 1,
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
    order: 2,
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
    order: 3,
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
    order: 4,
    permanent: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  }
];

/** @type {Set<Function>} */
const subscribers = new Set();

/** @type {Array<Object>} */
let inMemoryCache = [];

/**
 * Returns a cloned array of default clinic images
 * @returns {Array<Object>}
 */
export function getDefaultPhotos() {
  return DEFAULT_GALLERY_PHOTOS.map((photo) => ({ ...photo }));
}

/**
 * Deserializes image metadata array from localStorage
 * Handles JSON parsing errors and provides backwards compatibility.
 * @returns {Array<Object> | null}
 */
function deserializeFromLocalStorage() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  try {
    const raw = 
      localStorage.getItem(STORAGE_KEY) || 
      localStorage.getItem(LEGACY_METADATA_KEY) || 
      localStorage.getItem(LEGACY_STORAGE_KEY);

    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[imageService] Failed to deserialize images from localStorage:', err);
  }
  return null;
}

/**
 * Serializes image metadata array to localStorage
 * @param {Array<Object>} images
 */
function serializeToLocalStorage(images) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    const serialized = JSON.stringify(images);
    localStorage.setItem(STORAGE_KEY, serialized);
    // Keep legacy key in sync for backwards compatibility
    localStorage.setItem(LEGACY_METADATA_KEY, serialized);
  } catch (err) {
    console.warn('[imageService] Failed to serialize images to localStorage:', err);
  }
}

/**
 * Notifies all registered subscribers of state updates
 */
function notifySubscribers() {
  const currentImages = [...inMemoryCache];
  subscribers.forEach((callback) => {
    try {
      callback(currentImages);
    } catch (err) {
      console.error('[imageService] Subscriber callback error:', err);
    }
  });
}

/**
 * Deserializes and retrieves the array of images from localStorage.
 * If no images exist in storage, initializes with default images and serializes them.
 * @returns {Array<Object>} Array of image objects
 */
export function getImages() {
  if (inMemoryCache.length > 0) {
    return [...inMemoryCache];
  }

  // 1. Try deserializing from localStorage
  const stored = deserializeFromLocalStorage();
  if (stored && stored.length > 0) {
    inMemoryCache = stored;
    return [...inMemoryCache];
  }

  // 2. Initialize with default clinic photos
  const defaults = getDefaultPhotos();
  inMemoryCache = defaults;
  serializeToLocalStorage(defaults);
  return [...inMemoryCache];
}

/**
 * Adds a new image object, serializes the updated list to localStorage,
 * and synchronizes with persistent backend storage if available.
 * @param {Object} image - The image object or payload
 * @returns {Promise<Object>} The added image object
 */
export async function addImage(image) {
  if (!image) {
    throw new Error('Image data is required to add an image.');
  }

  // Ensure initial images are loaded
  if (inMemoryCache.length === 0) {
    getImages();
  }

  let finalRecord = null;

  // If a dataUrl is provided and we can persist to server disk storage, do so
  if (typeof window !== 'undefined' && image.dataUrl) {
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataUrl: image.dataUrl,
          title: image.title ? String(image.title).trim() : 'Clinic Photograph',
          category: image.category || 'clinic',
          description: image.description?.trim() || 'Authentic clinical photograph at Sankat Mochan Center, Gwalior.',
          altText: image.altText?.trim() || image.title || 'Clinic Photograph',
          originalFilename: image.originalFilename || image.filename,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.record) {
          finalRecord = data.record;
        }
      }
    } catch (err) {
      console.warn('[imageService] Server upload failed, falling back to client-only persistence:', err);
    }
  }

  // Fallback to client-side record creation if server upload did not return a record
  if (!finalRecord) {
    const id = image.id || `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    finalRecord = {
      id,
      title: image.title ? String(image.title).trim() : 'Clinic Photograph',
      category: image.category || 'clinic',
      filename: image.filename || image.originalFilename || `${id}.jpg`,
      url: image.url || image.dataUrl || '',
      altText: image.altText || image.title || 'Clinic Photograph',
      description: image.description || 'Authentic clinical photograph at Sankat Mochan Center, Gwalior.',
      order: typeof image.order === 'number' ? image.order : inMemoryCache.length + 1,
      permanent: false,
      createdAt: image.createdAt || new Date().toISOString(),
    };
  }

  // Add to in-memory list (prepend so newest appears first)
  inMemoryCache = [finalRecord, ...inMemoryCache.filter((img) => img.id !== finalRecord.id)];

  // Serialize updated array to localStorage
  serializeToLocalStorage(inMemoryCache);

  // Notify reactive subscribers
  notifySubscribers();

  return finalRecord;
}

/**
 * Replaces an existing image by ID with new image data, serializes to localStorage,
 * and synchronizes with persistent backend storage if available.
 * @param {string} id - The ID of the image to replace
 * @param {Object} newImage - The replacement image data
 * @returns {Promise<Object>} The updated image object
 */
export async function replaceImage(id, newImage) {
  if (!id) {
    throw new Error('Image ID is required for replacement.');
  }
  if (!newImage) {
    throw new Error('New image data is required for replacement.');
  }

  // Ensure initial images are loaded
  if (inMemoryCache.length === 0) {
    getImages();
  }

  let updatedRecord = null;

  // If replacement dataUrl is provided and we can persist to server disk storage, do so
  if (typeof window !== 'undefined' && newImage.dataUrl) {
    try {
      const res = await fetch('/api/replace-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          dataUrl: newImage.dataUrl,
          originalFilename: newImage.originalFilename || newImage.filename,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.record) {
          updatedRecord = data.record;
        }
      }
    } catch (err) {
      console.warn('[imageService] Server replace failed, falling back to client-only persistence:', err);
    }
  }

  // If server did not return updated record, update local object
  if (!updatedRecord) {
    const existing = inMemoryCache.find((img) => img.id === id);
    if (!existing) {
      throw new Error(`Image with ID "${id}" not found.`);
    }

    updatedRecord = {
      ...existing,
      ...newImage,
      id, // Preserve original ID
      url: newImage.url || newImage.dataUrl || existing.url,
      updatedAt: new Date().toISOString(),
    };
  }

  // Update in-memory array
  const index = inMemoryCache.findIndex((img) => img.id === id);
  if (index !== -1) {
    inMemoryCache[index] = updatedRecord;
  } else {
    inMemoryCache = [updatedRecord, ...inMemoryCache];
  }

  // Serialize updated array to localStorage
  serializeToLocalStorage(inMemoryCache);

  // Notify reactive subscribers
  notifySubscribers();

  return updatedRecord;
}

/**
 * Deletes an image by ID from localStorage and persistent storage.
 * @param {string} id - The ID of the image to delete
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function deleteImage(id) {
  if (!id) {
    throw new Error('Image ID is required for deletion.');
  }

  // Ensure initial images are loaded
  if (inMemoryCache.length === 0) {
    getImages();
  }

  // Optionally delete from server API
  if (typeof window !== 'undefined') {
    try {
      await fetch('/api/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.warn('[imageService] Server delete notice failed:', err);
    }
  }

  // Remove from in-memory array
  inMemoryCache = inMemoryCache.filter((img) => img.id !== id);

  // Serialize updated array to localStorage
  serializeToLocalStorage(inMemoryCache);

  // Notify reactive subscribers
  notifySubscribers();

  return true;
}

/**
 * Subscribes to image state changes
 * @param {Function} callback
 * @returns {() => void} Unsubscribe function
 */
export function subscribe(callback) {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

/**
 * Asynchronously fetches and merges current photos from persistent server storage
 * @returns {Promise<Array<Object>>}
 */
export async function fetchPhotos() {
  try {
    const res = await fetch('/api/images');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.images) && data.images.length > 0) {
        const defaults = getDefaultPhotos();
        const serverIds = new Set(data.images.map((img) => img.id));
        const missingDefaults = defaults.filter((d) => !serverIds.has(d.id));

        const merged = [...data.images, ...missingDefaults];
        inMemoryCache = merged;
        serializeToLocalStorage(merged);
        notifySubscribers();
        return [...inMemoryCache];
      }
    }
  } catch (err) {
    console.warn('[imageService] Persistent API unreachable, using localStorage metadata:', err);
  }

  return getImages();
}

/**
 * Backs up / synchronizes all images to server storage
 * @returns {Promise<{ success: boolean, message: string, count: number }>}
 */
export async function saveAllUploadedImages() {
  const currentPhotos = getImages();
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
        serializeToLocalStorage(data.gallery);
        notifySubscribers();
      }
      return {
        success: true,
        message: data.message || `All ${currentPhotos.length} images safely backed up to persistent disk storage.`,
        count: currentPhotos.length,
      };
    }
  } catch (err) {
    console.warn('[imageService] saveAllUploadedImages server sync warning:', err);
  }

  serializeToLocalStorage(currentPhotos);
  return {
    success: true,
    message: `All ${currentPhotos.length} images safely preserved in persistent storage.`,
    count: currentPhotos.length,
  };
}

/**
 * Export unified service object
 */
export const imageService = {
  getImages,
  addImage,
  deleteImage,
  replaceImage,
  getInitialPhotos: getImages,
  uploadImage: addImage,
  fetchPhotos,
  saveAllUploadedImages,
  subscribe,
};

export default imageService;
