// Persistent photo store for authentic clinic photos uploaded by the user/owner
// Zero cartoonization, zero AI enhancement, preserving original bytes.
// Backed by real persistent IndexedDB via persistentStorage.

import { persistentStorage } from './persistentStorage.ts';

export const photoStore = {
  getSlot(slotId: string): string | null {
    return persistentStorage.getSlot(slotId);
  },

  setSlot(slotId: string, dataUrl: string): void {
    // Asynchronously persists to IndexedDB while updating synchronous cache immediately
    persistentStorage.setSlot(slotId, dataUrl).catch((err) => {
      console.error('Failed to permanently store photo in IndexedDB:', err);
    });
  },

  getDrAnkitPhoto(): string | null {
    return persistentStorage.getDrAnkitPhoto();
  },

  removeSlot(slotId: string): void {
    persistentStorage.removeSlot(slotId).catch((err) => {
      console.error('Failed to remove photo slot:', err);
    });
  },

  subscribe(listener: () => void): () => void {
    return persistentStorage.subscribe(listener);
  }
};
