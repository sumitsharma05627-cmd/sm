// Persistent photo store for authentic clinic photos uploaded by the user/owner
// Zero cartoonization, zero AI enhancement, preserving original bytes.
// Backed by real persistent IndexedDB via persistentStorage.

import { persistentStorage } from './persistentStorage.ts';

export const photoStore = {
  getSlot(slotId: string): string | null {
    return persistentStorage.getSlot(slotId);
  },

  setSlot(slotId: string, dataUrl: string): Promise<string> {
    return persistentStorage.setSlot(slotId, dataUrl);
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
