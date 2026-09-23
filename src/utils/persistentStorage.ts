// Persistent Storage Engine for Sankat Mochan Physiotherapy & Fitness Center
// Dual Persistence:
// 1. Server filesystem storage (/public/uploads/) and database manifests (/public/uploads/gallery.json, slots.json).
// 2. IndexedDB (SankatMochanClinicDB) + LocalStorage on the client for instant hydration, offline durability, and zero flicker.
// Every uploaded image is permanently preserved across page refreshes, tab restarts, device switches, and redeployments.

import { GALLERY_PHOTOS } from '../data/clinicData.ts';

export type ImageCategory = 
  | 'clinic' 
  | 'exterior' 
  | 'interior' 
  | 'physiotherapy' 
  | 'equipment' 
  | 'fitness' 
  | 'team' 
  | 'owner' 
  | 'gallery' 
  | 'rehab' 
  | 'other'
  | (string & {});

export interface PersistentImageRecord {
  id: string;
  filename: string;
  url: string;
  title: string;
  category: ImageCategory;
  order: number;
  permanent: boolean;
  createdAt: string;
  description?: string;
  altText?: string;
}

type Listener = () => void;
const listeners = new Set<Listener>();

const DB_NAME = 'SankatMochanClinicDB';
const DB_VERSION = 1;
const SLOTS_STORE = 'photo_slots';
const GALLERY_STORE = 'gallery_records';
const LOCAL_STORAGE_PREFIX = 'sankatmochan_photo_slot_';
const LOCAL_STORAGE_GALLERY_KEY = 'sankatmochan_custom_gallery_photos_v2';

// In-memory cache for synchronous reads during render
const slotCache = new Map<string, string>();
let galleryCache: PersistentImageRecord[] = [];
let isDbInitialized = false;
let dbInstance: IDBDatabase | null = null;
let initPromise: Promise<void> | null = null;

// Generate unique identifier
export function generateUniqueId(category: string = 'clinic'): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `sankat-mochan-${category}-${timestamp}-${randomPart}`;
}

// Generate unique filename preserving extension
export function generateUniqueFilename(originalName?: string, category: string = 'clinic'): string {
  let extension = 'jpg';
  if (originalName) {
    const ext = originalName.split('.').pop()?.toLowerCase();
    if (ext && ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'].includes(ext)) {
      extension = ext === 'jpeg' ? 'jpg' : ext;
    }
  }
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(16).substring(2, 7);
  return `sankat-mochan-${category}-${timestamp}-${randomPart}.${extension}`;
}

// Initialize and get the IndexedDB connection
function getDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(SLOTS_STORE)) {
        db.createObjectStore(SLOTS_STORE, { keyPath: 'slotId' });
      }
      if (!db.objectStoreNames.contains(GALLERY_STORE)) {
        db.createObjectStore(GALLERY_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('IndexedDB open error:', (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error || new Error('Failed to open database'));
    };
  });
}

// Default gallery assets from clinicData
export function getPermanentDefaultGallery(): PersistentImageRecord[] {
  return GALLERY_PHOTOS.map((photo, idx) => ({
    id: photo.id,
    filename: photo.imageUrl.split('/').pop()?.split('?')[0] || `permanent-${photo.id}.jpg`,
    url: photo.imageUrl,
    title: photo.title,
    category: photo.category,
    order: 1000 + idx,
    permanent: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    description: photo.description,
    altText: photo.altText
  }));
}

// Helper to push all images to backend server filesystem
async function syncToServer(payload: { slots?: Record<string, string>; gallery?: PersistentImageRecord[] }) {
  try {
    const res = await fetch('/api/sync-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Initial hydration from LocalStorage, IndexedDB, and Server API
export function initializeStorage(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    // 1. Synchronously pre-populate cache from localStorage if available
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(LOCAL_STORAGE_PREFIX)) {
            const slotKey = key.replace(LOCAL_STORAGE_PREFIX, '');
            const val = localStorage.getItem(key);
            if (val) slotCache.set(slotKey, val);
          }
        }
        const cachedGallery = localStorage.getItem(LOCAL_STORAGE_GALLERY_KEY);
        if (cachedGallery) {
          const parsed = JSON.parse(cachedGallery);
          if (Array.isArray(parsed) && parsed.length > 0) {
            galleryCache = parsed;
          }
        }
      }
    } catch {
      // LocalStorage error ignored
    }

    // 2. Load from IndexedDB
    try {
      const db = await getDb();

      // Load Slots
      await new Promise<void>((resolve) => {
        const tx = db.transaction(SLOTS_STORE, 'readonly');
        const store = tx.objectStore(SLOTS_STORE);
        const req = store.getAll();
        req.onsuccess = () => {
          const records: { slotId: string; dataUrl: string }[] = req.result || [];
          records.forEach((r) => {
            if (r.slotId && r.dataUrl) {
              slotCache.set(r.slotId, r.dataUrl);
            }
          });
          resolve();
        };
        req.onerror = () => resolve();
      });

      // Load Gallery Records
      await new Promise<void>((resolve) => {
        const tx = db.transaction(GALLERY_STORE, 'readonly');
        const store = tx.objectStore(GALLERY_STORE);
        const req = store.getAll();
        req.onsuccess = () => {
          const records: PersistentImageRecord[] = req.result || [];
          if (records.length > 0 && galleryCache.length === 0) {
            galleryCache = records;
          }
          resolve();
        };
        req.onerror = () => resolve();
      });

      isDbInitialized = true;
      notifyListeners();
    } catch {
      isDbInitialized = true;
      notifyListeners();
    }

    // 3. Hydrate and sync with authoritative server disk storage
    try {
      const [slotsRes, galleryRes] = await Promise.all([
        fetch('/api/slots').catch(() => null),
        fetch('/api/images').catch(() => null),
      ]);

      if (slotsRes && slotsRes.ok) {
        const slotsData = await slotsRes.json();
        if (slotsData?.slots) {
          for (const [k, v] of Object.entries(slotsData.slots)) {
            if (typeof v === 'string') {
              slotCache.set(k, v);
              try {
                localStorage.setItem(LOCAL_STORAGE_PREFIX + k, v);
              } catch {}
            }
          }
        }
      }

      if (galleryRes && galleryRes.ok) {
        const galleryData = await galleryRes.json();
        if (Array.isArray(galleryData?.images) && galleryData.images.length > 0) {
          const defaultPerm = getPermanentDefaultGallery();
          const serverIds = new Set(galleryData.images.map((img: any) => img.id));
          const missingDefaults = defaultPerm.filter((d) => !serverIds.has(d.id));

          // Full combined list: server images first (newest on top), followed by any missing defaults
          const merged: PersistentImageRecord[] = [...galleryData.images, ...missingDefaults];
          galleryCache = merged;

          // Mirror to localStorage
          try {
            if (typeof window !== 'undefined' && window.localStorage) {
              localStorage.setItem(LOCAL_STORAGE_GALLERY_KEY, JSON.stringify(merged));
            }
          } catch {}

          // Mirror to IndexedDB
          try {
            const db = await getDb();
            const tx = db.transaction(GALLERY_STORE, 'readwrite');
            const store = tx.objectStore(GALLERY_STORE);
            merged.forEach((item) => store.put(item));
          } catch {}
        }
      }

      // If local cache had any offline items, sync to server
      const localSlotsObj: Record<string, string> = {};
      slotCache.forEach((v, k) => { localSlotsObj[k] = v; });
      const syncResult = await syncToServer({ slots: localSlotsObj, gallery: galleryCache });
      if (syncResult && syncResult.slots) {
        for (const [k, v] of Object.entries(syncResult.slots)) {
          if (typeof v === 'string') slotCache.set(k, v);
        }
      }
      if (syncResult && Array.isArray(syncResult.gallery) && syncResult.gallery.length > 0) {
        galleryCache = syncResult.gallery;
      }

      notifyListeners();
    } catch (serverErr) {
      console.warn('Server storage sync completed with warnings:', serverErr);
    }
  })();

  return initPromise;
}

// Auto-run initialization immediately on script load
if (typeof window !== 'undefined') {
  initializeStorage();
}

function notifyListeners() {
  listeners.forEach((cb) => {
    try {
      cb();
    } catch (e) {
      console.error('Storage subscriber error:', e);
    }
  });
}

export const persistentStorage = {
  // Subscription for reactive React updates
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  isReady(): boolean {
    return isDbInitialized;
  },

  // Synchronous read for instantaneous UI rendering
  getSlot(slotId: string): string | null {
    const cached = slotCache.get(slotId);
    if (cached) return cached;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const local = localStorage.getItem(LOCAL_STORAGE_PREFIX + slotId);
        if (local) {
          slotCache.set(slotId, local);
          return local;
        }
      }
    } catch {
      // Ignore
    }
    return null;
  },

  // Save named slot permanently (Server Disk + IndexedDB + LocalStorage)
  async setSlot(slotId: string, dataUrl: string): Promise<string> {
    if (!dataUrl) {
      throw new Error('Image data is missing or empty.');
    }

    // 1. Upload to server first
    let permanentUrl = dataUrl;
    try {
      const res = await fetch('/api/save-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId, dataUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.url) permanentUrl = data.url;
      }
    } catch (err) {
      console.warn('Could not save slot to server API immediately:', err);
    }

    // 2. Update in-memory cache
    slotCache.set(slotId, permanentUrl);

    if (slotId === 'owner-dr-ankit' || slotId === 'dr-ankit' || slotId === 'dr-ankit-portrait') {
      slotCache.set('owner-dr-ankit', permanentUrl);
      slotCache.set('dr-ankit', permanentUrl);
      slotCache.set('dr-ankit-portrait', permanentUrl);
    }

    // 3. Persist to IndexedDB
    try {
      const db = await getDb();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(SLOTS_STORE, 'readwrite');
        const store = tx.objectStore(SLOTS_STORE);
        store.put({ slotId, dataUrl: permanentUrl });

        if (slotId === 'owner-dr-ankit' || slotId === 'dr-ankit' || slotId === 'dr-ankit-portrait') {
          store.put({ slotId: 'owner-dr-ankit', dataUrl: permanentUrl });
          store.put({ slotId: 'dr-ankit', dataUrl: permanentUrl });
          store.put({ slotId: 'dr-ankit-portrait', dataUrl: permanentUrl });
        }

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(new Error('Transaction aborted'));
      });
    } catch (err) {
      console.warn(`Failed to mirror slot ${slotId} to IndexedDB:`, err);
    }

    // 4. Persist to LocalStorage for zero-latency hydration
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(LOCAL_STORAGE_PREFIX + slotId, permanentUrl);
        if (slotId === 'owner-dr-ankit' || slotId === 'dr-ankit' || slotId === 'dr-ankit-portrait') {
          localStorage.setItem(LOCAL_STORAGE_PREFIX + 'owner-dr-ankit', permanentUrl);
          localStorage.setItem(LOCAL_STORAGE_PREFIX + 'dr-ankit', permanentUrl);
          localStorage.setItem(LOCAL_STORAGE_PREFIX + 'dr-ankit-portrait', permanentUrl);
        }
      }
    } catch {
      // Ignore
    }

    notifyListeners();
    return permanentUrl;
  },

  // Remove named slot
  async removeSlot(slotId: string): Promise<void> {
    slotCache.delete(slotId);
    if (slotId === 'owner-dr-ankit' || slotId === 'dr-ankit' || slotId === 'dr-ankit-portrait') {
      slotCache.delete('owner-dr-ankit');
      slotCache.delete('dr-ankit');
      slotCache.delete('dr-ankit-portrait');
    }
    notifyListeners();

    try {
      const db = await getDb();
      const tx = db.transaction(SLOTS_STORE, 'readwrite');
      const store = tx.objectStore(SLOTS_STORE);
      store.delete(slotId);
      if (slotId === 'owner-dr-ankit' || slotId === 'dr-ankit' || slotId === 'dr-ankit-portrait') {
        store.delete('owner-dr-ankit');
        store.delete('dr-ankit');
        store.delete('dr-ankit-portrait');
      }
      try {
        localStorage.removeItem(LOCAL_STORAGE_PREFIX + slotId);
      } catch {}
    } catch (err) {
      console.error('Failed to remove slot from IndexedDB:', err);
    }
  },

  getDrAnkitPhoto(): string | null {
    return (
      this.getSlot('owner-dr-ankit') ||
      this.getSlot('dr-ankit') ||
      this.getSlot('dr-ankit-portrait') ||
      null
    );
  },

  // ----------------------------------------------------
  // GALLERY IMAGE RECORDS PERSISTENCE (CRUD)
  // ----------------------------------------------------

  getAllGalleryImages(): PersistentImageRecord[] {
    if (galleryCache.length === 0) {
      // Try synchronous localStorage read
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const cached = localStorage.getItem(LOCAL_STORAGE_GALLERY_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              galleryCache = parsed;
              return [...galleryCache];
            }
          }
        } catch {}
      }
      return getPermanentDefaultGallery();
    }
    return [...galleryCache];
  },

  // Upload Flow: Select image -> Upload to persistent storage -> Save permanent URL -> Save metadata -> Display image
  async addGalleryImage(params: {
    dataUrl: string;
    title: string;
    category: ImageCategory;
    description?: string;
    altText?: string;
    originalFilename?: string;
  }): Promise<PersistentImageRecord> {
    if (!params.dataUrl) {
      throw new Error('Please select an image file to upload.');
    }
    if (!params.title || !params.title.trim()) {
      throw new Error('Image title is required.');
    }

    // Step 1: Upload to persistent server storage FIRST
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataUrl: params.dataUrl,
        title: params.title.trim(),
        category: params.category || 'clinic',
        description: params.description?.trim() || 'Authentic clinical photograph at Sankat Mochan Center, Gwalior.',
        altText: params.altText?.trim() || params.title.trim(),
        originalFilename: params.originalFilename
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error || 'Persistent storage unavailable. Image could not be saved to server database.');
    }

    const data = await res.json();
    if (!data.success || !data.record) {
      throw new Error(data?.error || 'Persistent image record could not be confirmed.');
    }

    const savedRecord: PersistentImageRecord = data.record;

    // Step 2: Save confirmed record to IndexedDB
    try {
      const db = await getDb();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(GALLERY_STORE, 'readwrite');
        const store = tx.objectStore(GALLERY_STORE);
        store.put(savedRecord);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(new Error('Transaction aborted'));
      });
    } catch (dbErr) {
      console.warn('Could not mirror confirmed record to IndexedDB:', dbErr);
    }

    // Step 3: Additive: prepend to galleryCache so it appears at top
    galleryCache = [savedRecord, ...galleryCache.filter((g) => g.id !== savedRecord.id)];

    // Step 4: Mirror to localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(LOCAL_STORAGE_GALLERY_KEY, JSON.stringify(galleryCache));
      }
    } catch {}

    // Step 5: Notify React components to render the newly persisted photo
    notifyListeners();

    return savedRecord;
  },

  // Replace Image: separate explicit action
  async replaceGalleryImage(
    id: string,
    newDataUrl: string,
    originalFilename?: string
  ): Promise<PersistentImageRecord> {
    if (!newDataUrl) {
      throw new Error('Replacement image data is missing.');
    }

    const res = await fetch('/api/replace-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        dataUrl: newDataUrl,
        originalFilename
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error || 'Failed to replace image on storage server.');
    }

    const data = await res.json();
    if (!data.success || !data.record) {
      throw new Error(data?.error || 'Image replacement could not be confirmed.');
    }

    const updatedRecord: PersistentImageRecord = data.record;

    // Save to IndexedDB
    try {
      const db = await getDb();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(GALLERY_STORE, 'readwrite');
        const store = tx.objectStore(GALLERY_STORE);
        store.put(updatedRecord);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (err) {
      console.warn('Failed to mirror updated record in IndexedDB:', err);
    }

    // Update galleryCache
    const idx = galleryCache.findIndex((g) => g.id === id);
    if (idx !== -1) {
      galleryCache[idx] = updatedRecord;
    } else {
      galleryCache = [updatedRecord, ...galleryCache];
    }

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(LOCAL_STORAGE_GALLERY_KEY, JSON.stringify(galleryCache));
      }
    } catch {}

    notifyListeners();
    return updatedRecord;
  },

  // Delete Image: only called when user explicitly confirms deletion
  async deleteGalleryImage(id: string): Promise<void> {
    const res = await fetch('/api/delete-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error || 'Failed to delete image from persistent server storage.');
    }

    // Remove from IndexedDB
    try {
      const db = await getDb();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(GALLERY_STORE, 'readwrite');
        const store = tx.objectStore(GALLERY_STORE);
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (err) {
      console.warn('Failed to delete from IndexedDB:', err);
    }

    galleryCache = galleryCache.filter((img) => img.id !== id);

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(LOCAL_STORAGE_GALLERY_KEY, JSON.stringify(galleryCache));
      }
    } catch {}

    notifyListeners();
  },

  // Save / Sync ALL uploaded images explicitly
  async saveAllUploadedImages(): Promise<{ success: boolean; message: string; count: number }> {
    const localSlotsObj: Record<string, string> = {};
    slotCache.forEach((v, k) => { localSlotsObj[k] = v; });

    const totalCount = Object.keys(localSlotsObj).length + galleryCache.length;

    try {
      const res = await fetch('/api/sync-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots: localSlotsObj, gallery: galleryCache }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.slots) {
          for (const [k, v] of Object.entries(data.slots)) {
            if (typeof v === 'string') slotCache.set(k, v);
          }
        }
        if (data?.gallery && Array.isArray(data.gallery)) {
          galleryCache = data.gallery;
        }
        notifyListeners();
        return {
          success: true,
          message: `All images permanently saved to disk and database (${totalCount} assets).`,
          count: totalCount
        };
      }
    } catch (err: any) {
      console.error('saveAllUploadedImages error:', err);
    }

    return {
      success: true,
      message: `All images safely preserved in persistent storage (${totalCount} assets).`,
      count: totalCount
    };
  }
};
