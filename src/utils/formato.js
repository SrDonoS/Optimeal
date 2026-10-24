// 🔢 Formatos de números en español de Chile

export const numero = (v) => Math.round(v).toLocaleString('es-CL')

// 12,4 kg
export const kilos = (v) => `${v.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`

// $1.234.567
export const pesos = (v) => `$${Math.round(v).toLocaleString('es-CL')}`

// $1,2 M · $845 mil
export function pesosCorto(v) {
  const abs = Math.abs(v)
  const signo = v < 0 ? '−' : ''
  if (abs >= 1_000_000) return `${signo}$${(abs / 1_000_000).toLocaleString('es-CL', { maximumFractionDigits: 1 })} M`
  if (abs >= 1_000) return `${signo}$${Math.round(abs / 1_000).toLocaleString('es-CL')} mil`
  return `${signo}$${Math.round(abs)}`
}

// 0.483 → '48 %'
export const porcentaje = (v) => `${Math.round(v * 100)} %`

// Convierte '12,5' o '12.5' en 12.5 (o NaN si no es un número)
export const leerDecimal = (texto) => Number(String(texto).trim().replace(',', '.'))
