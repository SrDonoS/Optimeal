// 📅 Utilidades de fechas y plazos.
// Las fechas de reserva se guardan como texto 'AAAA-MM-DD' (ej: '2026-10-23'),
// en la hora local del computador.

import { HORA_CIERRE } from '../data/config'

const pad = (n) => String(n).padStart(2, '0')

// Date → '2026-10-23'
export function aISO(fecha) {
  return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}`
}

// '2026-10-23' → Date (medianoche local)
export function desdeISO(iso) {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(a, m - 1, d)
}

export function sumarDias(fecha, dias) {
  const nueva = new Date(fecha)
  nueva.setDate(nueva.getDate() + dias)
  return nueva
}

export const esFinDeSemana = (fecha) => fecha.getDay() === 0 || fecha.getDay() === 6

// Lunes de la semana de una fecha
export function lunesDe(fecha) {
  const f = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate())
  const dia = f.getDay() === 0 ? 7 : f.getDay()
  return sumarDias(f, 1 - dia)
}

// Los 5 días hábiles (lun-vie) de la semana, como ISO
export function diasHabilesDeSemana(lunes) {
  return [0, 1, 2, 3, 4].map((i) => aISO(sumarDias(lunes, i)))
}

// Siguiente día hábil (o el mismo si ya es hábil y avanzar = 0)
export function diaHabil(desde, avanzar = 0) {
  let f = new Date(desde.getFullYear(), desde.getMonth(), desde.getDate())
  while (esFinDeSemana(f)) f = sumarDias(f, 1)
  let pasos = Math.abs(avanzar)
  const dir = avanzar >= 0 ? 1 : -1
  while (pasos > 0) {
    f = sumarDias(f, dir)
    if (!esFinDeSemana(f)) pasos--
  }
  return f
}

// Momento exacto en que cierran las reservas de un día
export function cierreDe(iso) {
  const f = desdeISO(iso)
  f.setHours(HORA_CIERRE.horas, HORA_CIERRE.minutos, 0, 0)
  return f
}

export const estaAbierta = (iso, ahora) => ahora < cierreDe(iso)

// ¿Es '2026-10-23' una fecha válida y día hábil?
export function esFechaHabil(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso ?? '')) return false
  const f = desdeISO(iso)
  return aISO(f) === iso && !esFinDeSemana(f)
}

// Primer día con reservas todavía abiertas
export function primerDiaAbierto(ahora) {
  let f = diaHabil(ahora)
  while (!estaAbierta(aISO(f), ahora)) f = diaHabil(f, 1)
  return aISO(f)
}

// ---------- Formatos en español de Chile ----------

const fmt = (opciones) => new Intl.DateTimeFormat('es-CL', opciones)
const fLarga = fmt({ weekday: 'long', day: 'numeric', month: 'long' })
const fCorta = fmt({ weekday: 'short', day: 'numeric', month: 'short' })
const fDiaSemana = fmt({ weekday: 'short' })
const fMes = fmt({ month: 'short' })
const fHora = fmt({ hour: '2-digit', minute: '2-digit', hour12: false })
const fHoraSeg = fmt({ hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })

const limpiar = (t) => t.replace(/\./g, '')

// 'jueves 23 de octubre'
export const fechaLarga = (iso) => fLarga.format(desdeISO(iso)).replace(',', '')
// 'jue 23 oct'
export const fechaCorta = (iso) => limpiar(fCorta.format(desdeISO(iso)).replace(',', ''))
// 'jue'
export const diaSemanaCorto = (iso) => limpiar(fDiaSemana.format(desdeISO(iso)))
// 'oct'
export const mesCorto = (iso) => limpiar(fMes.format(desdeISO(iso)))
// '10:00'
export const hora = (fecha) => fHora.format(fecha)
export const horaConSegundos = (fecha) => fHoraSeg.format(fecha)
export const capitalizar = (t) => t.charAt(0).toUpperCase() + t.slice(1)

// Hoy, mañana o la fecha corta
export function fechaRelativa(iso, ahora) {
  const hoy = aISO(ahora)
  if (iso === hoy) return 'hoy'
  if (iso === aISO(sumarDias(ahora, 1))) return 'mañana'
  if (iso === aISO(sumarDias(ahora, -1))) return 'ayer'
  return fechaCorta(iso)
}

// Milisegundos → { dias, horas, minutos, segundos }
export function partesTiempo(ms) {
  const total = Math.max(0, Math.floor(ms / 1000))
  return {
    dias: Math.floor(total / 86400),
    horas: Math.floor((total % 86400) / 3600),
    minutos: Math.floor((total % 3600) / 60),
    segundos: total % 60,
  }
}

// Milisegundos → '2 días 4 h', '5 h 12 min', '8 min', 'menos de 1 min'
export function textoRestante(ms) {
  const { dias, horas, minutos } = partesTiempo(ms)
  if (dias > 0) return `${dias} ${dias === 1 ? 'día' : 'días'}${horas ? ` ${horas} h` : ''}`
  if (horas > 0) return `${horas} h${minutos ? ` ${minutos} min` : ''}`
  if (minutos > 0) return `${minutos} min`
  return 'menos de 1 min'
}
