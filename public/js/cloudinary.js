// js/cloudinary.js
// ─────────────────────────────────────────────
// Cloudinary upload helper  (unsigned preset)
// ─────────────────────────────────────────────
export const CLOUD_NAME    = 'dkz78oljz';
export const UPLOAD_PRESET = 'tienda';
export const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}`;

/**
 * Detecta la carpeta correcta según el tipo MIME del archivo
 * Estructura en Cloudinary:
 *   cordyclub/imagenes/
 *   cordyclub/videos/
 *   cordyclub/musicas/
 *   cordyclub/pdf/
 */
export function getFolderByType(file) {
  const type = file.type;
  if (type.startsWith('image/'))                          return 'cordyclub/imagenes';
  if (type.startsWith('video/'))                          return 'cordyclub/videos';
  if (type.startsWith('audio/'))                          return 'cordyclub/musicas';
  if (type === 'application/pdf')                         return 'cordyclub/pdf';
  return 'cordyclub/otros'; // fallback para tipos inesperados
}

/**
 * Sube un archivo a Cloudinary con carpeta automática por tipo
 * @param {File}     file
 * @param {string}   folder      – si se pasa explícitamente, sobreescribe la detección automática
 * @param {Function} onProgress  – cb(percent:number)
 */
export async function uploadToCloudinary(file, folder = null, onProgress = null) {
  // Carpeta automática si no se especifica
  const targetFolder = folder ?? getFolderByType(file);

  // Cloudinary usa resource_type 'video' también para audio
  const resourceType = file.type.startsWith('video/') || file.type.startsWith('audio/')
    ? 'video'
    : file.type === 'application/pdf'
      ? 'image'   // Cloudinary acepta PDF como resource_type "image"
      : 'image';

  const fd = new FormData();
  fd.append('file',          file);
  fd.append('upload_preset', UPLOAD_PRESET);
  fd.append('folder',        targetFolder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${CLOUDINARY_URL}/${resourceType}/upload`);

    if (onProgress) {
      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      });
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve({
          secure_url:    data.secure_url,
          public_id:     data.public_id,
          resource_type: resourceType,
          format:        data.format,
          bytes:         data.bytes,
          original_filename: data.original_filename,
          folder:        targetFolder   // ← útil para debug
        });
      } else {
        reject(new Error(`Cloudinary error ${xhr.status}: ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error al subir a Cloudinary'));
    xhr.send(fd);
  });
}

/**
 * Devuelve una URL optimizada de Cloudinary
 */
export function cloudinaryUrl(publicId, { w = 400, h = 400, q = 'auto', format = 'auto' } = {}) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${w},h_${h},c_fill,q_${q},f_${format}/${publicId}`;
}
