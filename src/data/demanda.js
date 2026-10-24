// 📊 Demanda FICTICIA de cada casino (simulación para el prototipo)
//
// Como no tenemos cientos de estudiantes reales, generamos reservas
// "de mentira" que siempre dan el mismo resultado para el mismo colegio,
// día y menú (no cambian al recargar). Encima de eso sumamos las reservas
// REALES hechas desde el Panel Estudiantes de esta misma app. 🔴 En vivo.

import { aISO, cierreDe, desdeISO, estaAbierta, lunesDe, sumarDias } from '../utils/fechas'
import { menusDelDia } from './menus'

// Qué parte de los estudiantes elige cada tipo de menú
const PARTICIPACION = { tradicional: 0.48, vegetariano: 0.22, liviano: 0.3 }

// Asistencia según el día (1 = lunes … 5 = viernes)
const FACTOR_DIA = { 1: 1.03, 2: 1.0, 3: 1.01, 4: 0.99, 5: 0.93 }

// Algunos platos gustan más que otros 😋
const POPULARIDAD = {
  'Pastel de choclo': 1.14,
  'Tallarines con salsa boloñesa': 1.12,
  'Pollo arvejado con arroz': 1.05,
  'Croquetas de quinoa con arroz': 1.08,
  'Porotos con riendas': 0.88,
  'Lentejas con arroz': 0.9,
  'Merluza al vapor con quinoa': 0.92,
}

// Número pseudoaleatorio estable a partir de un texto (siempre el mismo resultado)
export function azar(texto) {
  let h = 2166136261
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 10000) / 10000 // 0 … 1
}
export const variacion = (texto, amplitud) => 1 + (azar(texto) - 0.5) * 2 * amplitud

// Reservas ficticias que tendrá un menú cuando cierre el plazo
export function reservasFinales(est, fecha, menu) {
  const dia = desdeISO(fecha).getDay()
  const valor =
    est.racionesDiariasPromedio *
    PARTICIPACION[menu.tipo] *
    (FACTOR_DIA[dia] ?? 1) *
    (POPULARIDAD[menu.nombre] ?? 1) *
    variacion(`${est.id}|${fecha}|${menu.tipo}`, 0.07)
  return Math.round(valor)
}

// Qué fracción de las reservas finales ya llegó, según las horas que faltan para el cierre.
// (Las reservas abren ~1 semana antes y se acumulan sobre todo el último día.)
export function avanceReservas(horasParaCierre) {
  if (horasParaCierre <= 0) return 1
  return 0.25 + 0.75 * Math.exp(-horasParaCierre / 51)
}

// Tasa de estudiantes que reservan pero no retiran (3 % a 7 %)
export const tasaNoRetiro = (est, fecha, tipo) => 0.03 + azar(`noretiro|${est.id}|${fecha}|${tipo}`) * 0.04

// Semana del piloto de una fecha (0 = primera semana; negativo = antes del piloto).
// El piloto de cada colegio empezó hace `semanasEnPiloto` semanas.
export function semanaDelPiloto(est, fecha) {
  const inicio = sumarDias(lunesDe(new Date()), -7 * est.semanasEnPiloto)
  return Math.floor((desdeISO(fecha) - inicio) / (7 * 86_400_000))
}

// Cuánto preparó de más el casino. Las primeras semanas desconfiaba de la
// predicción (~11 % extra); con el tiempo se fue ajustando (~2 %).
export function margenPreparacion(est, fecha, tipo) {
  const semana = Math.max(0, semanaDelPiloto(est, fecha))
  return (0.015 + 0.1 * Math.exp(-semana / 2.5)) * variacion(`prep|${est.id}|${fecha}|${tipo}`, 0.35)
}

// Demanda de un día en un establecimiento: reservas por menú (ficticias + app)
export function demandaDelDia(est, fecha, ahora, reservasApp = []) {
  const abierta = estaAbierta(fecha, ahora)
  const horas = (cierreDe(fecha) - ahora) / 3_600_000
  const avance = avanceReservas(horas)

  const menus = menusDelDia(fecha).map((menu) => {
    const final = reservasFinales(est, fecha, menu)
    const ficticias = Math.round(final * avance)
    const deLaApp = reservasApp.filter(
      (r) => r.establecimientoId === est.id && r.fecha === fecha && r.menuId === menu.id,
    )
    const app = deLaApp.filter((r) => r.estado === 'confirmada').length
    const canceladasApp = deLaApp.filter((r) => r.estado === 'cancelada').length
    const canceladas = Math.round(final * 0.03 * variacion(`cancel|${est.id}|${fecha}|${menu.tipo}`, 0.5) * avance)
    return {
      menu,
      confirmadas: ficticias + app,
      app,
      canceladas: canceladas + canceladasApp,
    }
  })

  const total = menus.reduce((s, m) => s + m.confirmadas, 0)
  return {
    fecha,
    abierta,
    horasParaCierre: horas,
    menus,
    total,
    app: menus.reduce((s, m) => s + m.app, 0),
    canceladas: menus.reduce((s, m) => s + m.canceladas, 0),
  }
}

// Historial: las últimas veces que este casino sirvió este mismo menú
// (mismo día de la semana y mismo tipo). Solo existe desde que el colegio
// entró al piloto, y un plato nuevo todavía no tiene historial.
export function historialMenu(est, menu, fecha, maxSemanas = 8) {
  if (menu.nuevo) return []
  const semanas = Math.min(maxSemanas, est.semanasEnPiloto)
  const registros = []
  for (let k = 1; k <= semanas; k++) {
    const f = aISO(sumarDias(desdeISO(fecha), -7 * k))
    const reservas = reservasFinales(est, f, menu)
    const noRetiro = Math.round(reservas * tasaNoRetiro(est, f, menu.tipo))
    const servidas = reservas - noRetiro
    const preparadas = servidas + Math.max(1, Math.round(reservas * margenPreparacion(est, f, menu.tipo)))
    registros.push({ fecha: f, reservas, preparadas, servidas, noRetiro, sobrantes: preparadas - servidas })
  }
  return registros
}
