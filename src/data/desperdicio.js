// 🗑️ Desperdicio, costos y ahorro (datos FICTICIOS + registros reales de la app)
//
// - Cada día y menú del piloto tiene un "registro de desperdicio" ficticio
//   (kilos sobrantes, raciones preparadas y servidas). Algunos días faltan a
//   propósito, para mostrar cómo se ven los DATOS FALTANTES.
// - Los registros que guardes en "Registro de desperdicio" reemplazan al
//   ficticio de ese mismo día y menú.
// - La "línea base" es cómo era ANTES de Optimeal (raciones fijas cada día).

import { aISO, diasHabilesDeSemana, lunesDe, sumarDias } from '../utils/fechas'
import { azar, margenPreparacion, reservasFinales, semanaDelPiloto, tasaNoRetiro, variacion } from './demanda'
import { ESTABLECIMIENTOS } from './establecimientos'
import { menusDelDia } from './menus'

export const KG_POR_RACION = 0.38 // peso de una ración completa que no se sirvió
export const KG_RESTOS_POR_SERVIDA = 0.08 // restos que quedan en cada bandeja servida
export const SEMANAS_LINEA_BASE = 2 // semanas medidas antes de empezar el piloto

const OBSERVACIONES = [
  'Lluvia: faltaron varios estudiantes',
  'Actividad deportiva antes del almuerzo',
  'Muy buena aceptación del plato',
  'Se acabó el postre antes de terminar el turno',
  'Salida pedagógica de un curso',
]

const redondear1 = (x) => Math.round(x * 10) / 10

// Lo que la predicción habría recomendado (mismo método que el panel del casino)
function estimadasDe(reservas) {
  const esperadas = reservas - Math.round(reservas * 0.05)
  return esperadas + Math.max(2, Math.round(esperadas * 0.02))
}

// Valores "reales" de un día y menú del piloto (los conoce la simulación)
export function realDelDia(est, fecha, menu) {
  const reservas = reservasFinales(est, fecha, menu)
  const servidas = reservas - Math.round(reservas * tasaNoRetiro(est, fecha, menu.tipo))
  const preparadas = servidas + Math.max(1, Math.round(reservas * margenPreparacion(est, fecha, menu.tipo)))
  const restos = servidas * KG_RESTOS_POR_SERVIDA * variacion(`restos|${est.id}|${fecha}|${menu.tipo}`, 0.25)
  const kilos = redondear1((preparadas - servidas) * KG_POR_RACION + restos)
  return { reservas, servidas, preparadas, estimadas: estimadasDe(reservas), kilos }
}

// Registro ficticio de un día y menú (o null si "no se registró": dato faltante)
export function registroFicticio(est, fecha, menu) {
  if (semanaDelPiloto(est, fecha) < 0) return null
  if (azar(`falta|${est.id}|${fecha}|${menu.tipo}`) < 0.07) return null
  const real = realDelDia(est, fecha, menu)
  // A veces el casino solo anotó los kilos (preparadas/servidas son opcionales)
  const soloKilos = azar(`solokg|${est.id}|${fecha}|${menu.tipo}`) < 0.12
  const conNota = azar(`obs|${est.id}|${fecha}|${menu.tipo}`) < 0.12
  return {
    id: `ficticio|${est.id}|${fecha}|${menu.tipo}`,
    establecimientoId: est.id,
    fecha,
    menuId: menu.id,
    preparadas: soloKilos ? null : real.preparadas,
    servidas: soloKilos ? null : real.servidas,
    estimadas: real.estimadas,
    kilos: real.kilos,
    observaciones: conNota ? OBSERVACIONES[Math.floor(azar(`obs2|${est.id}|${fecha}`) * OBSERVACIONES.length)] : '',
    origen: 'ficticio',
  }
}

// Cómo era un día ANTES de Optimeal
export function lineaBase(est) {
  const servidas = Math.round(est.racionesDiariasPromedio * 0.95)
  const sobrantes = est.racionesFijasAntes - servidas
  const kgDia = redondear1(sobrantes * KG_POR_RACION + servidas * KG_RESTOS_POR_SERVIDA)
  return { preparadas: est.racionesFijasAntes, servidas, kgDia, costoDia: est.racionesFijasAntes * est.costoRacion }
}

// Registros de un día: los guardados en la app reemplazan a los ficticios
export function registrosDelDia(est, fecha, registrosApp, hoyISO) {
  return menusDelDia(fecha).map((menu) => {
    const propio = [...registrosApp]
      .reverse()
      .find((r) => r.establecimientoId === est.id && r.fecha === fecha && r.menuId === menu.id)
    if (propio) return { menu, registro: propio }
    return { menu, registro: fecha < hoyISO ? registroFicticio(est, fecha, menu) : null }
  })
}

// Cuántas semanas mostrar: la línea base + todo el piloto (incluida la semana actual)
export const semanasAMostrar = (est) => est.semanasEnPiloto + 1 + SEMANAS_LINEA_BASE

// Resumen por semana: kilos, registros faltantes y costos
export function resumenSemanas(est, ahora, registrosApp, cantidad = semanasAMostrar(est)) {
  const hoyISO = aISO(ahora)
  const lunesActual = lunesDe(ahora)
  const base = lineaBase(est)
  const semanas = []

  for (let k = cantidad - 1; k >= 0; k--) {
    const lunes = sumarDias(lunesActual, -7 * k)
    const lunesISO = aISO(lunes)
    const semanaPiloto = semanaDelPiloto(est, lunesISO)
    const dias = diasHabilesDeSemana(lunes).filter((d) => d <= hoyISO)
    const enCurso = k === 0

    // Antes del piloto: solo existe la línea base (y solo algunas semanas medidas)
    if (semanaPiloto < 0) {
      const medida = semanaPiloto >= -SEMANAS_LINEA_BASE
      semanas.push({
        lunes: lunesISO,
        tipo: medida ? 'antes' : 'sin-piloto',
        kgDia: medida ? redondear1(base.kgDia * variacion(`base|${est.id}|${lunesISO}`, 0.06)) : null,
        diasConDatos: medida ? 5 : 0,
        faltantes: 0,
        costoReal: medida ? base.costoDia * 5 : null,
        costoEstimado: null,
        preparadas: medida ? base.preparadas * 5 : null,
      })
      continue
    }

    let kilos = 0
    let registrados = 0
    let faltantes = 0
    let preparadasReales = 0
    let estimadas = 0
    let diasPiloto = 0
    for (const d of dias) {
      if (semanaDelPiloto(est, d) < 0) continue
      diasPiloto++
      for (const { menu, registro } of registrosDelDia(est, d, registrosApp, hoyISO)) {
        const real = realDelDia(est, d, menu)
        preparadasReales += real.preparadas
        estimadas += real.estimadas
        if (registro) {
          kilos += registro.kilos
          registrados++
        } else if (d < hoyISO) {
          faltantes++
        }
      }
    }
    const menusPorDia = 3
    const diasConDatos = registrados / menusPorDia
    // La factura real de algunas semanas aún no llega (dato faltante)
    const facturaPendiente = enCurso || azar(`factura|${est.id}|${lunesISO}`) < 0.2
    semanas.push({
      lunes: lunesISO,
      tipo: 'piloto',
      enCurso,
      kgDia: registrados ? redondear1(kilos / diasConDatos) : null,
      kilos: redondear1(kilos),
      diasConDatos,
      diasPiloto,
      faltantes,
      preparadas: preparadasReales,
      ahorroRaciones: base.preparadas * diasPiloto - preparadasReales,
      costoEstimado: estimadas * est.costoRacion,
      costoReal: facturaPendiente
        ? null
        : Math.round(preparadasReales * est.costoRacion * variacion(`precio|${est.id}|${lunesISO}`, 0.04)),
      facturaPendiente,
    })
  }
  return semanas
}

// Indicadores del periodo (solo semanas del piloto)
export function indicadores(est, semanas) {
  const base = lineaBase(est)
  const piloto = semanas.filter((s) => s.tipo === 'piloto')
  const completas = piloto.filter((s) => !s.enCurso)
  const conKg = piloto.filter((s) => s.kgDia != null)
  const conCostos = piloto.filter((s) => s.costoReal != null)

  const kilos = redondear1(piloto.reduce((s, x) => s + x.kilos, 0))
  // Desperdicio actual: promedio de las últimas 2 semanas con datos
  const recientes = conKg.slice(-2)
  const kgDiaActual = recientes.length ? recientes.reduce((s, x) => s + x.kgDia, 0) / recientes.length : null
  const reduccion = kgDiaActual != null ? 1 - kgDiaActual / base.kgDia : null

  return {
    base,
    semanasPiloto: piloto.length,
    semanasCompletas: completas.length,
    kilos,
    kgDiaActual,
    reduccion,
    faltantes: piloto.reduce((s, x) => s + x.faltantes, 0),
    // Semanas ya terminadas cuya factura aún no llega (la semana en curso no cuenta)
    facturasPendientes: completas.filter((s) => s.facturaPendiente).length,
    costoEstimado: conCostos.reduce((s, x) => s + x.costoEstimado, 0),
    costoReal: conCostos.reduce((s, x) => s + x.costoReal, 0),
    semanasConCostos: conCostos.length,
    ahorroRaciones: piloto.reduce((s, x) => s + x.ahorroRaciones, 0),
    ahorroPesos: piloto.reduce((s, x) => s + x.ahorroRaciones, 0) * est.costoRacion,
  }
}

// Cifras globales del piloto (para la portada): reducción de kilos y ahorro mensual
export function resumenPiloto(ahora = new Date()) {
  let base = 0
  let actual = 0
  let ahorro = 0
  let dias = 0
  for (const est of ESTABLECIMIENTOS) {
    const semanas = resumenSemanas(est, ahora, [])
    const kpi = indicadores(est, semanas)
    ahorro += kpi.ahorroPesos
    dias = Math.max(dias, semanas.reduce((s, x) => s + (x.diasPiloto ?? 0), 0))
    // Solo colegios con historial suficiente para medir la reducción
    if (est.semanasEnPiloto >= 3 && kpi.kgDiaActual != null) {
      base += kpi.base.kgDia
      actual += kpi.kgDiaActual
    }
  }
  const diasPorMes = 21
  return {
    reduccion: base ? 1 - actual / base : null,
    ahorroMensual: dias ? (ahorro / dias) * diasPorMes : 0,
  }
}
