import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Support large image payloads (up to 50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const UPLOADS_DIR = path.resolve(__dirname, 'public/uploads');
const GALLERY_FILE = path.resolve(UPLOADS_DIR, 'gallery.json');
const SLOTS_FILE = path.resolve(UPLOADS_DIR, 'slots.json');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Ensure default JSON store files exist
if (!fs.existsSync(GALLERY_FILE)) {
  fs.writeFileSync(GALLERY_FILE, JSON.stringify([], null, 2), 'utf-8');
}
if (!fs.existsSync(SLOTS_FILE)) {
  fs.writeFileSync(SLOTS_FILE, JSON.stringify({}, null, 2), 'utf-8');
}

// Helper to save base64 dataUrl to disk file
function saveBase64ToFile(dataUrl: string, targetFilename: string): string {
  const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    // Already a URL or relative path
    return dataUrl;
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');

  // Determine extension if missing
  let ext = path.extname(targetFilename);
  if (!ext) {
    if (mimeType.includes('png')) ext = '.png';
    else if (mimeType.includes('webp')) ext = '.webp';
    else if (mimeType.includes('svg')) ext = '.svg';
    else ext = '.jpg';
    targetFilename = `${targetFilename}${ext}`;
  }

  const cleanFilename = targetFilename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = path.resolve(UPLOADS_DIR, cleanFilename);
  fs.writeFileSync(filePath, buffer);

  return `/uploads/${cleanFilename}`;
}

// Helper to read and write records
function readGalleryManifest(): any[] {
  try {
    if (fs.existsSync(GALLERY_FILE)) {
      const content = fs.readFileSync(GALLERY_FILE, 'utf-8');
      return JSON.parse(content || '[]');
    }
  } catch (err) {
    console.error('Error reading gallery manifest:', err);
  }
  return [];
}

function writeGalleryManifest(records: any[]): void {
  try {
    fs.writeFileSync(GALLERY_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing gallery manifest:', err);
  }
}

function readSlotsManifest(): Record<string, string> {
  try {
    if (fs.existsSync(SLOTS_FILE)) {
      const content = fs.readFileSync(SLOTS_FILE, 'utf-8');
      return JSON.parse(content || '{}');
    }
  } catch (err) {
    console.error('Error reading slots manifest:', err);
  }
  return {};
}

function writeSlotsManifest(slots: Record<string, string>): void {
  try {
    fs.writeFileSync(SLOTS_FILE, JSON.stringify(slots, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing slots manifest:', err);
  }
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// GET all saved gallery images
app.get('/api/images', (req, res) => {
  const images = readGalleryManifest();
  res.json({ success: true, count: images.length, images });
});

// GET all photo slots
app.get('/api/slots', (req, res) => {
  const slots = readSlotsManifest();
  res.json({ success: true, slots });
});

// POST Upload Single Image permanently
app.post('/api/upload', (req, res) => {
  try {
    const { dataUrl, title, category, description, altText, originalFilename } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ success: false, error: 'No image data provided' });
    }

    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 7);
    const prefix = category ? `sankat-mochan-${category}` : 'sankat-mochan-image';
    const filename = originalFilename
      ? `${prefix}-${timestamp}-${randomPart}-${originalFilename.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      : `${prefix}-${timestamp}-${randomPart}.jpg`;

    let fileUrl = dataUrl;
    if (dataUrl.startsWith('data:')) {
      fileUrl = saveBase64ToFile(dataUrl, filename);
    }

    const newRecord = {
      id: `img-${timestamp}-${randomPart}`,
      filename: path.basename(fileUrl),
      url: fileUrl,
      title: title || 'Clinic Photograph',
      category: category || 'clinic',
      order: Date.now(),
      permanent: true,
      createdAt: new Date().toISOString(),
      description: description || 'Authentic clinical photograph at Sankat Mochan Center, Gwalior.',
      altText: altText || title || 'Clinic Photograph'
    };

    const existing = readGalleryManifest();
    const updated = [newRecord, ...existing.filter(item => item.id !== newRecord.id)];
    writeGalleryManifest(updated);

    res.json({ success: true, record: newRecord });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, error: err?.message || 'Failed to save image' });
  }
});

// POST Save Photo Slot (Dr. Ankit portrait, banner, etc.)
app.post('/api/save-slot', (req, res) => {
  try {
    const { slotId, dataUrl, filename } = req.body;
    if (!slotId || !dataUrl) {
      return res.status(400).json({ success: false, error: 'slotId and dataUrl are required' });
    }

    let fileUrl = dataUrl;
    if (dataUrl.startsWith('data:')) {
      const cleanSlotName = slotId.replace(/[^a-zA-Z0-9_-]/g, '_');
      const targetFilename = filename ? `slot_${cleanSlotName}_${filename}` : `slot_${cleanSlotName}.jpg`;
      fileUrl = saveBase64ToFile(dataUrl, targetFilename);
    }

    const slots = readSlotsManifest();
    slots[slotId] = fileUrl;

    // Aliases for Dr. Ankit slot
    if (slotId === 'owner-dr-ankit' || slotId === 'dr-ankit' || slotId === 'dr-ankit-portrait') {
      slots['owner-dr-ankit'] = fileUrl;
      slots['dr-ankit'] = fileUrl;
      slots['dr-ankit-portrait'] = fileUrl;
    }

    writeSlotsManifest(slots);

    res.json({ success: true, slotId, url: fileUrl });
  } catch (err: any) {
    console.error('Save slot error:', err);
    res.status(500).json({ success: false, error: err?.message || 'Failed to save photo slot' });
  }
});

// POST Sync All Uploaded Images (Backup / Save All)
// Receives all locally uploaded images from the browser and writes them permanently to disk
app.post('/api/sync-all', (req, res) => {
  try {
    const { slots = {}, gallery = [] } = req.body;
    const currentSlots = readSlotsManifest();
    const currentGallery = readGalleryManifest();

    let slotsSavedCount = 0;
    let gallerySavedCount = 0;

    // 1. Process and save slots
    for (const [key, value] of Object.entries(slots)) {
      if (typeof value === 'string' && value.startsWith('data:')) {
        const cleanSlotName = key.replace(/[^a-zA-Z0-9_-]/g, '_');
        const fileUrl = saveBase64ToFile(value, `slot_${cleanSlotName}.jpg`);
        currentSlots[key] = fileUrl;
        slotsSavedCount++;
      } else if (typeof value === 'string' && !currentSlots[key]) {
        currentSlots[key] = value;
      }
    }
    writeSlotsManifest(currentSlots);

    // 2. Process and save gallery images
    const existingIds = new Set(currentGallery.map((g: any) => g.id));
    const newItems: any[] = [];

    for (const item of gallery) {
      if (!item) continue;
      let fileUrl = item.url;
      if (typeof item.url === 'string' && item.url.startsWith('data:')) {
        const timestamp = Date.now().toString(36);
        const randomPart = Math.random().toString(36).substring(2, 6);
        const cat = item.category || 'clinic';
        const targetFilename = item.filename || `sankat-mochan-${cat}-${timestamp}-${randomPart}.jpg`;
        fileUrl = saveBase64ToFile(item.url, targetFilename);
        gallerySavedCount++;
      }

      const record = {
        ...item,
        url: fileUrl,
        filename: path.basename(fileUrl),
        permanent: true
      };

      if (existingIds.has(record.id)) {
        // Update existing record url
        const idx = currentGallery.findIndex((g: any) => g.id === record.id);
        if (idx !== -1) currentGallery[idx] = record;
      } else {
        newItems.push(record);
      }
    }

    const updatedGallery = [...newItems, ...currentGallery];
    writeGalleryManifest(updatedGallery);

    res.json({
      success: true,
      message: `All images saved permanently to disk. (${slotsSavedCount} slots, ${gallerySavedCount + newItems.length} gallery records)`,
      slots: currentSlots,
      gallery: updatedGallery
    });
  } catch (err: any) {
    console.error('Sync error:', err);
    res.status(500).json({ success: false, error: err?.message || 'Failed to sync images' });
  }
});

// POST Replace an existing gallery image
app.post('/api/replace-image', (req, res) => {
  try {
    const { id, dataUrl, originalFilename } = req.body;
    if (!id || !dataUrl) {
      return res.status(400).json({ success: false, error: 'id and dataUrl are required' });
    }

    const currentGallery = readGalleryManifest();
    const existingIndex = currentGallery.findIndex((item: any) => item.id === id);
    if (existingIndex === -1) {
      return res.status(404).json({ success: false, error: `Image with id "${id}" not found` });
    }

    const existing = currentGallery[existingIndex];
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 7);
    const prefix = existing.category ? `sankat-mochan-${existing.category}` : 'sankat-mochan-image';
    const filename = originalFilename
      ? `${prefix}-${timestamp}-${randomPart}-${originalFilename.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      : `${prefix}-${timestamp}-${randomPart}.jpg`;

    let fileUrl = dataUrl;
    if (dataUrl.startsWith('data:')) {
      fileUrl = saveBase64ToFile(dataUrl, filename);
    }

    const updatedRecord = {
      ...existing,
      url: fileUrl,
      filename: path.basename(fileUrl),
      createdAt: new Date().toISOString(),
    };

    currentGallery[existingIndex] = updatedRecord;
    writeGalleryManifest(currentGallery);

    res.json({ success: true, record: updatedRecord });
  } catch (err: any) {
    console.error('Replace image error:', err);
    res.status(500).json({ success: false, error: err?.message || 'Failed to replace image' });
  }
});

// POST Delete an image from gallery manifest
app.post('/api/delete-image', (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, error: 'id is required' });

    const currentGallery = readGalleryManifest();
    const updated = currentGallery.filter((item: any) => item.id !== id);
    writeGalleryManifest(updated);

    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});

// ----------------------------------------------------
// STATIC & VITE MIDDLEWARE
// ----------------------------------------------------

// Serve public directory statically (e.g. /uploads/..., /clinic-logo.png, etc.)
app.use(express.static(path.resolve(__dirname, 'public')));

async function startServer() {
  if (!isProd) {
    // In development mode, mount Vite middlewares
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production mode, serve built dist directory
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (isProd: ${isProd})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
