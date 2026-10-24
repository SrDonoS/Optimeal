// 🧑‍🍳 Todo lo que necesitan las pantallas del casino, en un solo lugar:
// la fecha elegida (en la URL), el establecimiento activo, la hora,
// la demanda del día y la predicción de raciones.

import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAhora } from '../context/RelojContext'
import { useReservas } from '../context/ReservasContext'
import { useSesion } from '../context/SesionContext'
import { demandaDelDia } from '../data/demanda'
import { buscarEstablecimiento } from '../data/establecimientos'
import { aISO, diaHabil, esFechaHabil } from '../utils/fechas'
import { predecirDia } from '../utils/prediccion'

export function useCasino() {
  const [params, setParams] = useSearchParams()
  const ahora = useAhora()
  const { reservas } = useReservas()
  const { establecimientoActivoId } = useSesion()
  const est = buscarEstablecimiento(establecimientoActivoId)

  // Por defecto: hoy (o el próximo día hábil si es fin de semana)
  const fechaParam = params.get('fecha')
  const fecha = esFechaHabil(fechaParam) ? fechaParam : aISO(diaHabil(ahora))
  const cambiarFecha = (iso) => setParams({ fecha: iso }, { replace: true })

  // Se recalcula cada minuto (o al instante si cambia una reserva o el colegio)
  const minuto = Math.floor(ahora.getTime() / 60_000)
  const demanda = useMemo(
    () => demandaDelDia(est, fecha, new Date(minuto * 60_000), reservas),
    [est, fecha, minuto, reservas],
  )
  const prediccion = useMemo(() => predecirDia(est, demanda), [est, demanda])

  return { est, fecha, cambiarFecha, ahora, demanda, prediccion, reservas }
}
