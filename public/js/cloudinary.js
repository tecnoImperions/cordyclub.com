// js/cloudinary.js
// ─────────────────────────────────────────────
// Cloudinary upload helper  (unsigned preset)
// ─────────────────────────────────────────────
export const CLOUD_NAME   = 'dv6d41ect';          // tu cloud name
export const UPLOAD_PRESET = 'tienda';         // preset sin firma (unsigned)
export const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}`;

/**
 * Sube un archivo a Cloudinary y devuelve { secure_url, public_id, resource_type }
 * @param {File}   file
 * @param {string} folder  – carpeta destino en Cloudinary, ej. "productos"
 * @param {Function} onProgress – cb(percent:number)
 * @returns {Promise<{secure_url:string, public_id:string, resource_type:string}>}
 */
export async function uploadToCloudinary(file, folder = 'productos', onProgress = null) {
  const resourceType = file.type.startsWith('video') ? 'video' : 'image';

  const fd = new FormData();
  fd.append('file',         file);
  fd.append('upload_preset', UPLOAD_PRESET);
  fd.append('folder',       folder);

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
        resolve({ secure_url: data.secure_url, public_id: data.public_id, resource_type: resourceType });
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
 * @param {string} publicId
 * @param {object} opts  – { w, h, q, format }
 */
export function cloudinaryUrl(publicId, { w = 400, h = 400, q = 'auto', format = 'auto' } = {}) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${w},h_${h},c_fill,q_${q},f_${format}/${publicId}`;
}
