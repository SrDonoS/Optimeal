// Utilidades de texto pequeñitas ✍️

// "sofia.rojas@colegio.cl" -> "Sofia Rojas"
export function nombreDesdeCorreo(correo) {
  const usuario = correo.split('@')[0] ?? ''
  const palabras = usuario
    .split(/[._\-+0-9]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
  return palabras.join(' ') || 'Usuario'
}

// "Sofia Rojas" -> "SR"
export function iniciales(nombre) {
  return nombre
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

// Valida que el correo "parezca" un correo (algo@algo.algo). Nada más.
export function pareceCorreo(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())
}
