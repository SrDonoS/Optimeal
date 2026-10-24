// 🏛️ Datos del área administrativa para el establecimiento activo:
// semanas (kilos, costos, datos faltantes), indicadores y meta de reducción.

import { useMemo } from 'react'
import { useRegistros } from '../context/RegistrosContext'
import { useAhora } from '../context/RelojContext'
import { useSesion } from '../context/SesionContext'
import { indicadores, resumenSemanas } from '../data/desperdicio'
import { buscarEstablecimiento } from '../data/establecimientos'
import { SEMANAS_MINIMAS } from '../utils/prediccion'

export function useAdmin() {
  const { establecimientoActivoId } = useSesion()
  const { registros, guardarRegistro, metaDe, cambiarMeta } = useRegistros()
  const ahora = useAhora(60_000) // basta con actualizar cada minuto
  const est = buscarEstablecimiento(establecimientoActivoId)

  const dia = Math.floor(ahora.getTime() / 3_600_000) // se recalcula cada hora o al cambiar datos
  const semanas = useMemo(() => resumenSemanas(est, new Date(dia * 3_600_000), registros), [est, dia, registros])
  const kpi = useMemo(() => indicadores(est, semanas), [est, semanas])
  const meta = metaDe(est.id)
  const metaMedible = est.semanasEnPiloto >= SEMANAS_MINIMAS && kpi.reduccion != null

  return { est, ahora, registros, guardarRegistro, semanas, kpi, meta, cambiarMeta, metaMedible }
}
