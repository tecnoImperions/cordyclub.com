// ═══════════════════════════════════════
//  js/cloudinary.js – CordyClub Bolivia
//  Utilidades para URLs de Cloudinary
// ═══════════════════════════════════════

const CLOUDINARY_CLOUD = 'dv6d41ect'; // 👉 tu cloud name
const CLOUDINARY_PRESET = 'tienda';    // 👉 el nombre que pusiste en "Nombre del preajuste de carga"

const Cloudinary = {
  // Función para subir archivos (La que conecta con tu API)
  async upload(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
      method: 'POST',
      body: formData
    });
    return await response.json();
  },

  // URL de imagen optimizada
  image(publicId, opts = {}) {
    const { w = 400, q = 'auto', f = 'auto' } = opts;
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/w_${w},q_${q},f_${f}/${publicId}`;
  },

  // URL de video/audio
  video(publicId, opts = {}) {
    const { q = 'auto' } = opts;
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/video/upload/q_${q}/${publicId}`;
  },

  // Miniatura de video (poster)
  videoThumb(publicId) {
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/video/upload/so_0/${publicId}.jpg`;
  }
};

// Disponible globalmente
window.CordyCloudinary = Cloudinary;
