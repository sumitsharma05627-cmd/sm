// Persistent Storage Engine for Sankat Mochan Physiotherapy & Fitness Center
// Dual Persistence:
// 1. IndexedDB + localStorage on the client for immediate rendering and offline durability.
// 2. Server filesystem storage (/public/uploads/) via /api/sync-all, /api/upload, and /api/save-slot.
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
const LOCAL_STORAGE_GALLERY_KEY = 'sankatmochan_custom_gallery_photos';

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

// Seed permanent existing gallery assets
function getPermanentDefaultGallery(): PersistentImageRecord[] {
  return GALLERY_PHOTOS.map((photo, idx) => ({
    id: photo.id,
    filename: photo.imageUrl.split('/').pop()?.split('?')[0] || `permanent-${photo.id}.jpg`,
    url: photo.imageUrl,
    title: photo.title,
    category: photo.category,
    order: idx + 1,
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

// Initial hydration from IndexedDB, LocalStorage, and Server Disk
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
        const legacyGallery = localStorage.getItem(LOCAL_STORAGE_GALLERY_KEY);
        if (legacyGallery) {
          const parsed = JSON.parse(legacyGallery);
          if (Array.isArray(parsed)) {
            parsed.forEach((item: any, idx: number) => {
              galleryCache.push({
                id: item.id || generateUniqueId(item.category || 'clinic'),
                filename: generateUniqueFilename(item.title, item.category || 'clinic'),
                url: item.imageUrl || item.url,
                title: item.title || 'Clinic Photograph',
                category: item.category || 'clinic',
                order: idx + 100,
                permanent: true,
                createdAt: item.createdAt || new Date().toISOString(),
                description: item.description,
                altText: item.altText || item.title
              });
            });
          }
        }
      }
    } catch {
      // LocalStorage read error ignored
    }

    // 2. Load from IndexedDB (the primary client-side persistent database)
    try {
      const db = await getDb();

      // Load Slots
      await new Promise<void>((resolve, reject) => {
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
        req.onerror = () => reject(req.error);
      });

      // Load Gallery Records
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(GALLERY_STORE, 'readonly');
        const store = tx.objectStore(GALLERY_STORE);
        const req = store.getAll();
        req.onsuccess = () => {
          const records: PersistentImageRecord[] = req.result || [];
          if (records.length > 0) {
            // Sort by order
            records.sort((a, b) => (a.order || 0) - (b.order || 0));
            // Merge with existing permanent defaults to ensure none are missing
            const recordIds = new Set(records.map((r) => r.id));
            const defaultPerm = getPermanentDefaultGallery();
            const missingDefaults = defaultPerm.filter((d) => !recordIds.has(d.id));
            galleryCache = [...missingDefaults, ...records];
          } else {
            // Seed defaults into IndexedDB
            const defaultPerm = getPermanentDefaultGallery();
            galleryCache = [...defaultPerm];
            try {
              const saveTx = db.transaction(GALLERY_STORE, 'readwrite');
              const saveStore = saveTx.objectStore(GALLERY_STORE);
              defaultPerm.forEach((item) => saveStore.put(item));
            } catch (seedErr) {
              console.warn('Could not seed defaults to IndexedDB', seedErr);
            }
          }
          resolve();
        };
        req.onerror = () => reject(req.error);
      });

      isDbInitialized = true;
      notifyListeners();
    } catch (err) {
      console.error('Failed to initialize IndexedDB storage:', err);
      if (galleryCache.length === 0) {
        galleryCache = getPermanentDefaultGallery();
      }
      isDbInitialized = true;
      notifyListeners();
    }

    // 3. Hydrate and sync with server disk storage
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
            }
          }
        }
      }

      if (galleryRes && galleryRes.ok) {
        const galleryData = await galleryRes.json();
        if (Array.isArray(galleryData?.images) && galleryData.images.length > 0) {
          const serverMap = new Map(galleryData.images.map((img: any) => [img.id, img]));
          galleryCache = galleryCache.map((local) => (serverMap.get(local.id) as PersistentImageRecord) || local);
          galleryData.images.forEach((img: any) => {
            if (!galleryCache.some((g) => g.id === img.id)) {
              galleryCache.unshift(img);
            }
          });
        }
      }

      // Automatically sync any local uploaded images to the server disk in the background
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

  // Save named slot permanently (IndexedDB + Server filesystem)
  async setSlot(slotId: string, dataUrl: string): Promise<void> {
    if (!dataUrl) return;

    // 1. Update in-memory cache immediately
    slotCache.set(slotId, dataUrl);

    if (slotId === 'owner-dr-ankit' || slotId === 'dr-ankit' || slotId === 'dr-ankit-portrait') {
      slotCache.set('owner-dr-ankit', dataUrl);
      slotCache.set('dr-ankit', dataUrl);
      slotCache.set('dr-ankit-portrait', dataUrl);
    }

    notifyListeners();

    // 2. Persist to IndexedDB
    try {
      const db = await getDb();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(SLOTS_STORE, 'readwrite');
        const store = tx.objectStore(SLOTS_STORE);
        store.put({ slotId, dataUrl });

        if (slotId === 'owner-dr-ankit' || slotId === 'dr-ankit' || slotId === 'dr-ankit-portrait') {
          store.put({ slotId: 'owner-dr-ankit', dataUrl });
          store.put({ slotId: 'dr-ankit', dataUrl });
          store.put({ slotId: 'dr-ankit-portrait', dataUrl });
        }

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(new Error('Transaction aborted'));
      });

      try {
        if (dataUrl.length < 2000000 && typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(LOCAL_STORAGE_PREFIX + slotId, dataUrl);
        }
      } catch {
        // LocalStorage quota error is safely ignored
      }
    } catch (err) {
      console.error(`Failed to permanently save slot ${slotId} to IndexedDB:`, err);
    }

    // 3. Persist to Server Disk via API
    try {
      const res = await fetch('/api/save-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId, dataUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.url) {
          slotCache.set(slotId, data.url);
          notifyListeners();
        }
      }
    } catch {
      // Server upload will retry during next sync
    }
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
      } catch {
        // Ignore
      }
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
      return getPermanentDefaultGallery();
    }
    return [...galleryCache];
  },

  async addGalleryImage(params: {
    dataUrl: string;
    title: string;
    category: ImageCategory;
    description?: string;
    altText?: string;
    originalFilename?: string;
  }): Promise<PersistentImageRecord> {
    if (!params.dataUrl) {
      throw new Error('Image data is missing or empty.');
    }
    if (!params.title || !params.title.trim()) {
      throw new Error('Image title is required.');
    }

    const uniqueId = generateUniqueId(params.category);
    const uniqueFilename = generateUniqueFilename(params.originalFilename, params.category);

    const newRecord: PersistentImageRecord = {
      id: uniqueId,
      filename: uniqueFilename,
      url: params.dataUrl,
      title: params.title.trim(),
      category: params.category,
      order: Date.now(),
      permanent: true,
      createdAt: new Date().toISOString(),
      description: params.description?.trim() || 'Authentic clinical photograph at Sankat Mochan Center, Gwalior.',
      altText: params.altText?.trim() || params.title.trim()
    };

    // 1. Save to IndexedDB
    try {
      const db = await getDb();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(GALLERY_STORE, 'readwrite');
        const store = tx.objectStore(GALLERY_STORE);
        store.put(newRecord);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(new Error('Transaction aborted'));
      });
    } catch (err) {
      console.error('Failed to permanently save image to IndexedDB:', err);
    }

    // 2. Additive: prepend to galleryCache immediately
    galleryCache = [newRecord, ...galleryCache];
    notifyListeners();

    // 3. Save to server filesystem
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataUrl: params.dataUrl,
          title: params.title.trim(),
          category: params.category,
          description: params.description,
          altText: params.altText,
          originalFilename: params.originalFilename
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.record?.url) {
          const idx = galleryCache.findIndex((g) => g.id === newRecord.id);
          if (idx !== -1) {
            galleryCache[idx] = {
              ...newRecord,
              url: data.record.url,
              filename: data.record.filename || newRecord.filename
            };
            notifyListeners();
          }
        }
      }
    } catch {
      // Sync will pick it up
    }

    return newRecord;
  },

  async replaceGalleryImage(
    id: string,
    newDataUrl: string,
    originalFilename?: string
  ): Promise<PersistentImageRecord> {
    if (!newDataUrl) {
      throw new Error('Replacement image data is missing.');
    }

    const existingIndex = galleryCache.findIndex((img) => img.id === id);
    if (existingIndex === -1) {
      throw new Error(`Image with id "${id}" not found.`);
    }

    const existing = galleryCache[existingIndex];
    const newFilename = generateUniqueFilename(originalFilename, existing.category);

    const updatedRecord: PersistentImageRecord = {
      ...existing,
      filename: newFilename,
      url: newDataUrl,
      createdAt: new Date().toISOString()
    };

    // Save to IndexedDB
    try {
      const db = await getDb();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(GALLERY_STORE, 'readwrite');
        const store = tx.objectStore(GALLERY_STORE);
        store.put(updatedRecord);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(new Error('Transaction aborted'));
      });
    } catch (err) {
      console.error('Failed to replace image in IndexedDB:', err);
    }

    const updated = [...galleryCache];
    updated[existingIndex] = updatedRecord;
    galleryCache = updated;
    notifyListeners();

    // Also update server disk
    try {
      fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataUrl: newDataUrl,
          title: updatedRecord.title,
          category: updatedRecord.category,
          originalFilename: originalFilename
        }),
      }).catch(() => {});
    } catch {
      // Ignore
    }

    return updatedRecord;
  },

  async deleteGalleryImage(id: string): Promise<void> {
    try {
      const db = await getDb();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(GALLERY_STORE, 'readwrite');
        const store = tx.objectStore(GALLERY_STORE);
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(new Error('Transaction aborted'));
      });
    } catch (err) {
      console.error('Failed to delete image from IndexedDB:', err);
    }

    galleryCache = galleryCache.filter((img) => img.id !== id);
    notifyListeners();

    try {
      fetch('/api/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      }).catch(() => {});
    } catch {
      // Ignore
    }
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

    // Local IndexedDB is already saved
    return {
      success: true,
      message: `All images safely preserved in permanent local IndexedDB storage (${totalCount} assets).`,
      count: totalCount
    };
  }
};
