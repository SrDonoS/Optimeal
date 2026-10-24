// 🔮 Predicción de raciones (modelo simple y explicable)
//
//   Raciones recomendadas = Reservas confirmadas
//                         + Reservas que aún pueden llegar (si el plazo sigue abierto)
//                         − Estudiantes que reservan y no retiran (según historial)
//                         + Margen de seguridad (2 %, mínimo 2 raciones)
//
// Si no hay suficiente historial, NO estimamos: mostramos "Datos insuficientes"
// y usamos solo las reservas confirmadas.

import { avanceReservas, historialMenu } from '../data/demanda'

export const SEMANAS_MINIMAS = 3
export const MARGEN_SEGURIDAD = 0.02

const promedio = (lista) => (lista.length ? lista.reduce((s, x) => s + x, 0) / lista.length : 0)

export function predecirMenu(est, fecha, demandaMenu, abierta, horasParaCierre) {
  const { menu, confirmadas } = demandaMenu
  const historial = historialMenu(est, menu, fecha)

  // ¿Tenemos datos suficientes?
  let motivo = null
  if (menu.nuevo) {
    motivo = 'Plato nuevo: todavía no sabemos cuántos estudiantes lo eligen ni cuántos lo retiran.'
  } else if (historial.length < SEMANAS_MINIMAS) {
    motivo = `Este casino lleva ${est.semanasEnPiloto} ${est.semanasEnPiloto === 1 ? 'semana' : 'semanas'} en el piloto. Se necesitan al menos ${SEMANAS_MINIMAS} semanas de historial.`
  }

  if (motivo) {
    return { menu, suficiente: false, motivo, confirmadas, historial, recomendadas: null, abierta }
  }

  // Reservas que aún pueden llegar antes del cierre (según el ritmo habitual)
  const avance = avanceReservas(horasParaCierre)
  const porLlegar = abierta ? Math.max(0, Math.round(confirmadas / avance - confirmadas)) : 0

  // Tasa histórica de "reservó pero no retiró"
  const tasa = promedio(historial.map((h) => h.noRetiro / h.reservas))
  const esperadas = confirmadas + porLlegar
  const noRetiro = Math.round(esperadas * tasa)
  const margen = Math.max(2, Math.round((esperadas - noRetiro) * MARGEN_SEGURIDAD))
  const recomendadas = esperadas - noRetiro + margen

  // Qué tan bien le fue al casino con este método en el pasado
  const sobrantePromedio = promedio(historial.map((h) => h.sobrantes))

  return {
    menu,
    suficiente: true,
    confirmadas,
    historial,
    abierta,
    porLlegar,
    tasaNoRetiro: tasa,
    noRetiro,
    margen,
    recomendadas,
    confianza: historial.length >= 6 ? 'Alta' : 'Media',
    sobrantePromedio,
    factores: [
      { etiqueta: 'Reservas confirmadas', detalle: 'Dato real del sistema', valor: confirmadas, tipo: 'confirmado' },
      ...(abierta
        ? [{ etiqueta: 'Reservas que aún pueden llegar', detalle: 'Según el ritmo habitual antes del cierre', valor: porLlegar, tipo: 'estimado' }]
        : []),
      {
        etiqueta: 'No retiran su almuerzo',
        detalle: `Promedio de las últimas ${historial.length} semanas: ${(tasa * 100).toFixed(1).replace('.', ',')} %`,
        valor: -noRetiro,
        tipo: 'estimado',
      },
      { etiqueta: 'Margen de seguridad', detalle: `${MARGEN_SEGURIDAD * 100} % (mínimo 2 raciones)`, valor: margen, tipo: 'regla' },
    ],
  }
}

// Predicción de todos los menús del día
export function predecirDia(est, demanda) {
  const menus = demanda.menus.map((m) => predecirMenu(est, demanda.fecha, m, demanda.abierta, demanda.horasParaCierre))
  const todosSuficientes = menus.every((m) => m.suficiente)
  return {
    menus,
    todosSuficientes,
    totalConfirmadas: menus.reduce((s, m) => s + m.confirmadas, 0),
    // Si algún menú no tiene datos suficientes, para ese menú usamos solo lo confirmado
    totalRecomendadas: menus.reduce((s, m) => s + (m.suficiente ? m.recomendadas : m.confirmadas), 0),
  }
}
