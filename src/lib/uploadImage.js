import { supabase } from './supabase';

const BUCKET = 'saree-images';

/** Downscale a File to a reasonable web size before upload (saves space + speeds the catalogue). */
async function downscale(file, maxW = 1280, quality = 0.85) {
  // Non-images (or if decode fails) are uploaded as-is.
  if (!file.type.startsWith('image/')) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxW / bitmap.width);
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));
    return blob || file;
  } catch {
    return file;
  }
}

/** Upload one image File to Storage; returns its public URL. Admin-only (RLS). */
export async function uploadSareeImage(file) {
  if (!supabase) throw new Error('Storage is not configured');
  const blob = await downscale(file);
  const path = `sarees/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: 'image/jpeg', upsert: false });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Best-effort delete of a previously-uploaded image by its public URL. */
export async function deleteSareeImage(url) {
  if (!supabase || typeof url !== 'string') return;
  const marker = `/${BUCKET}/`;
  const i = url.indexOf(marker);
  if (i === -1) return; // not one of ours (e.g. an external URL)
  const path = url.slice(i + marker.length);
  try {
    await supabase.storage.from(BUCKET).remove([path]);
  } catch {
    /* ignore */
  }
}
