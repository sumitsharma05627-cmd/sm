// Persistent photo store for authentic clinic photos uploaded by the user/owner
// Zero cartoonization, zero AI enhancement, preserving original bytes.

type Listener = () => void;
const listeners = new Set<Listener>();

const STORAGE_PREFIX = 'sankatmochan_photo_slot_';

export const photoStore = {
  getSlot(slotId: string): string | null {
    try {
      return localStorage.getItem(STORAGE_PREFIX + slotId);
    } catch {
      return null;
    }
  },

  setSlot(slotId: string, dataUrl: string): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + slotId, dataUrl);
      // Auto-sync related slots for Dr. Ankit
      if (slotId === 'owner-dr-ankit' || slotId === 'dr-ankit' || slotId === 'dr-ankit-portrait') {
        localStorage.setItem(STORAGE_PREFIX + 'owner-dr-ankit', dataUrl);
        localStorage.setItem(STORAGE_PREFIX + 'dr-ankit', dataUrl);
        localStorage.setItem(STORAGE_PREFIX + 'dr-ankit-portrait', dataUrl);
      }
      listeners.forEach((cb) => cb());
    } catch {
      console.warn('LocalStorage full or unavailable');
    }
  },

  getDrAnkitPhoto(): string | null {
    const stored = this.getSlot('owner-dr-ankit') || this.getSlot('dr-ankit') || this.getSlot('dr-ankit-portrait');
    if (stored) return stored;
    return null;
  },

  removeSlot(slotId: string): void {
    try {
      localStorage.removeItem(STORAGE_PREFIX + slotId);
      if (slotId === 'owner-dr-ankit' || slotId === 'dr-ankit' || slotId === 'dr-ankit-portrait') {
        localStorage.removeItem(STORAGE_PREFIX + 'owner-dr-ankit');
        localStorage.removeItem(STORAGE_PREFIX + 'dr-ankit');
        localStorage.removeItem(STORAGE_PREFIX + 'dr-ankit-portrait');
      }
      listeners.forEach((cb) => cb());
    } catch {
      // Ignore
    }
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }
};
