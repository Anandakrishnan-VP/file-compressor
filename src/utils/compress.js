import { zipSync } from 'fflate';

export async function compressFile(file) {
  // Check for easter egg
  if (file.name.endsWith('.crushed.zip') || file.name.endsWith('.crushr')) {
    throw new Error('EASTER_EGG_SELF_CRUSH');
  }

  const startTime = performance.now();
  const buffer = await file.arrayBuffer();
  const uint8 = new Uint8Array(buffer);

  // Compress using fflate maximum level 9
  const zipped = zipSync({
    [file.name]: uint8,
  }, {
    level: 9,
    mem: 8,
  });

  const durationMs = Math.max(1, performance.now() - startTime);
  const blob = new Blob([zipped], { type: 'application/zip' });

  const beforeSize = file.size;
  const afterSize = blob.size;
  const savedBytes = Math.max(0, beforeSize - afterSize);
  const ratio = beforeSize > 0 ? (((beforeSize - afterSize) / beforeSize) * 100).toFixed(1) : '0.0';

  // Output filename: filename.crushed.zip
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  const downloadName = `${baseName}.crushed.zip`;

  return {
    blob,
    downloadName,
    originalName: file.name,
    beforeSize,
    afterSize,
    savedBytes,
    ratio: parseFloat(ratio),
    durationMs,
    throughputMBps: ((beforeSize / (1024 * 1024)) / (durationMs / 1000)).toFixed(2),
  };
}

export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
