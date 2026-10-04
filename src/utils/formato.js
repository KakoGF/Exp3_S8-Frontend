/* ==========================================================
   Funciones utilitarias reutilizables.
   No dependen de React: reciben datos y devuelven un resultado,
   por eso cualquier componente puede importarlas.
   ========================================================== */

// Formateador de pesos chilenos. Se crea una sola vez y se reutiliza.
const formateadorCLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

/**
 * Convierte un número en precio chileno: 14990 -> "$14.990".
 */
export function formatearPrecio(valor) {
  return formateadorCLP.format(valor)
}

/**
 * Porcentaje de descuento entre el precio normal y el de oferta.
 * Ejemplo: normal 20000, oferta 15000 -> 25.
 */
export function calcularDescuento(precioNormal, precioOferta) {
  if (!precioNormal || precioOferta >= precioNormal) return 0
  return Math.round(((precioNormal - precioOferta) / precioNormal) * 100)
}

/**
 * Devuelve la ruta correcta de un archivo de la carpeta public.
 * import.meta.env.BASE_URL vale "/" en desarrollo local y
 * "/Exp3_S8-Frontend/" en GitHub Pages, así las imágenes cargan en ambos casos.
 */
export function rutaPublica(archivo) {
  return `${import.meta.env.BASE_URL}${archivo}`
}

// Imagen que se muestra cuando un juego no trae portada o la URL no carga.
export const IMAGEN_POR_DEFECTO = 'img/sin-imagen.svg'

/**
 * Devuelve la ruta de la portada de un producto.
 * Los juegos del JSON usan imágenes locales ("img/elden-ring.jpg"), pero los
 * que se agregan desde el panel admin pueden traer una URL de internet ("https://...").
 * Si no hay imagen, se usa la imagen por defecto.
 */
export function rutaImagen(imagen) {
  if (!imagen) return rutaPublica(IMAGEN_POR_DEFECTO)
  if (imagen.startsWith('http')) return imagen
  return rutaPublica(imagen)
}

/**
 * Se usa en el evento onError de las etiquetas <img>, igual que en la guía:
 * si la portada no carga, se reemplaza por la imagen por defecto.
 * onerror = null evita un ciclo infinito si la imagen por defecto también fallara.
 */
export function manejarErrorImagen(evento) {
  evento.target.onerror = null
  evento.target.src = rutaPublica(IMAGEN_POR_DEFECTO)
}

/**
 * Normaliza un texto para comparar sin importar mayúsculas ni tildes.
 * Así "baldur" encuentra "Baldur's Gate 3" y "accion" encuentra "Acción".
 */
export function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}
