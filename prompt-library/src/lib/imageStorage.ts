import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
// The app always runs under this basePath (see next.config.js), in both
// dev and the static export, so it's safe to bake it into stored paths.
const BASE_PATH = '/PromptLibrary';

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
};

const MAX_BYTES = 10 * 1024 * 1024; // 10MB

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

function extensionFor(mimeType: string, fallbackName?: string): string | null {
  if (ALLOWED_MIME_TYPES[mimeType]) return ALLOWED_MIME_TYPES[mimeType];
  const fromName = fallbackName?.split('.').pop()?.toLowerCase();
  if (fromName && Object.values(ALLOWED_MIME_TYPES).includes(fromName)) return fromName;
  return null;
}

/** Saves image bytes under public/uploads and returns the stored (basePath-prefixed) path. */
function saveImageBytes(bytes: Buffer, mimeType: string, fallbackName?: string): string {
  if (bytes.byteLength > MAX_BYTES) {
    throw new Error('Image is too large (max 10MB)');
  }

  const ext = extensionFor(mimeType, fallbackName);
  if (!ext) {
    throw new Error(`Unsupported image type: ${mimeType || 'unknown'}`);
  }

  ensureUploadsDir();

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  fs.writeFileSync(path.join(UPLOADS_DIR, filename), bytes);

  return `${BASE_PATH}/uploads/${filename}`;
}

/** Uploads a browser-supplied File. */
export async function saveUploadedFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  return saveImageBytes(Buffer.from(arrayBuffer), file.type, file.name);
}

/** Fetches an image from a remote URL and stores a local copy. */
export async function fetchAndSaveImage(url: string): Promise<string> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error('Could not reach that URL');
  }

  if (!response.ok) {
    throw new Error(`Fetching the image failed: ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) {
    throw new Error(`That URL didn't return an image (got ${contentType || 'unknown content type'})`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return saveImageBytes(Buffer.from(arrayBuffer), contentType, url);
}

/** Deletes a previously stored upload, if the path is one of ours. Ignores anything else (external URLs, missing files). */
export function deleteStoredImage(imagePath: string | undefined | null): void {
  if (!imagePath || !imagePath.startsWith(`${BASE_PATH}/uploads/`)) return;

  const filename = imagePath.slice(`${BASE_PATH}/uploads/`.length);
  // Guard against path traversal — the filename must not contain a separator.
  if (!filename || filename.includes('/') || filename.includes('..')) return;

  const filePath = path.join(UPLOADS_DIR, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
