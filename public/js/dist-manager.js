/* ═══════════════════════════════════════════════════
   dist-manager.js  —  CordyClub Bolivia
   Módulo compartido: lógica de distribuidor activo
   Importar con: import DM from './dist-manager.js';
═══════════════════════════════════════════════════ */

const MASTER = {
  id: 0,
  nombre: 'CordyClub Bolivia',
  whatsapp: '59163488086',
  isMaster: true,
};

const KEY_FAV  = 'cc_fav_dist';   // { id, nombre, whatsapp }
const KEY_CART = 'cc_cart';

const DM = {

  /* ── Leer favorito ── */
  getFav() {
    try { return JSON.parse(localStorage.getItem(KEY_FAV)) || null; }
    catch { return null; }
  },

  /* ── Guardar favorito (solo uno) ── */
  setFav(dist) {
    // dist: { id, nombre, whatsapp, whatsapp_publico?, ciudad? }
    const data = {
      id:       dist.id,
      nombre:   dist.nombre,
      whatsapp: dist.whatsapp_publico || dist.whatsapp,
      ciudad:   dist.ciudad || '',
    };
    localStorage.setItem(KEY_FAV, JSON.stringify(data));
    return data;
  },

  /* ── Quitar favorito ── */
  clearFav() {
    localStorage.removeItem(KEY_FAV);
  },

  /* ── Distribuidor activo (fav o master) ── */
  getActive() {
    return this.getFav() || MASTER;
  },

  /* ── ¿Este distribuidor es el favorito actual? ── */
  isFav(distId) {
    const fav = this.getFav();
    return fav ? fav.id === distId : false;
  },

  /* ── Número WA activo ── */
  getWA() {
    return this.getActive().whatsapp || MASTER.whatsapp;
  },

  /* ── Nombre activo ── */
  getNombre() {
    return this.getActive().nombre || MASTER.nombre;
  },

  /* ── URL de WhatsApp con mensaje ── */
  waUrl(mensaje) {
    const wa  = this.getWA();
    const msg = encodeURIComponent(mensaje);
    return `https://wa.me/${wa}?text=${msg}`;
  },

  /* ── Toggle favorito; devuelve {ahora: bool, dist} ── */
  toggleFav(dist) {
    if (this.isFav(dist.id)) {
      this.clearFav();
      return { ahora: false, dist };
    } else {
      const saved = this.setFav(dist);
      return { ahora: true, dist: saved };
    }
  },

  /* ── Mensaje estándar para un producto ── */
  msgProducto(nombre, codigo, precio) {
    const dist = this.getActive();
    const sufijo = dist.isMaster ? '' : ` — solicitado a ${dist.nombre}`;
    return `Hola! Me interesa *${nombre}* (${codigo}) — ${precio} Bs${sufijo}. ¿Tienes disponibilidad?`;
  },

  /* ── Mensaje estándar para carrito ── */
  msgCarrito(items) {
    const total = items.reduce((s, c) => s + c.precio * c.qty, 0);
    const lines = items.map(c =>
      `• ${c.nombre} (${c.codigo}) ×${c.qty} = ${c.precio * c.qty} Bs`
    ).join('\n');
    const dist = this.getActive();
    const sufijo = dist.isMaster ? '' : `\n\nDistribuidor: ${dist.nombre}`;
    return `Hola! Quiero hacer este pedido:\n\n${lines}\n\n*Total: ${total} Bs*${sufijo}`;
  },

  /* ── Carrito helpers ── */
  getCart() {
    try { return JSON.parse(localStorage.getItem(KEY_CART)) || []; }
    catch { return []; }
  },
  saveCart(cart) {
    localStorage.setItem(KEY_CART, JSON.stringify(cart));
  },
};

export default DM;
export { MASTER };
