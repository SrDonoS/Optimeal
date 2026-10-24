// Encabezado común de las pantallas del casino:
// título, establecimiento, navegador de fechas y estado del plazo.

import { ChevronLeft, ChevronRight, CircleCheck, Clock, School } from 'lucide-react'
import { HORA_CIERRE_TEXTO, SEMANAS_RESERVABLES } from '../../data/config'
import {
  aISO,
  capitalizar,
  diaHabil,
  diasHabilesDeSemana,
  fechaLarga,
  fechaRelativa,
  lunesDe,
  sumarDias,
  textoRestante,
  cierreDe,
} from '../../utils/fechas'
import Encabezado from '../ui/Encabezado'

export default function EncabezadoCasino({ titulo, descripcion, est, fecha, onCambiarFecha, ahora, abierta, acciones }) {
  // Días que se pueden consultar: esta semana y las siguientes reservables
  const lunes = lunesDe(ahora)
  const dias = Array.from({ length: SEMANAS_RESERVABLES }, (_, s) => diasHabilesDeSemana(sumarDias(lunes, 7 * s))).flat()
  const i = dias.indexOf(fecha)
  const hoy = aISO(diaHabil(ahora))
  const relativa = fechaRelativa(fecha, ahora)

  return (
    <div className="space-y-5">
      <Encabezado titulo={titulo} descripcion={descripcion} acciones={acciones}>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-medium ring-1 ring-marfil-300">
          <School className="size-4 text-verde-700" aria-hidden="true" />
          <strong className="font-semibold">{est.casino}</strong>
          <span className="text-tinta-suave">· {est.nombre}</span>
        </p>
      </Encabezado>

      <div className="flex flex-col gap-3 rounded-2xl border border-marfil-300/80 bg-marfil-50 p-3 shadow-suave sm:flex-row sm:items-center sm:justify-between">
        {/* Navegador de fechas */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onCambiarFecha(dias[i - 1])}
            disabled={i <= 0}
            className="grid size-10 cursor-pointer place-items-center rounded-xl border border-marfil-300 bg-white hover:border-marfil-400 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Día anterior"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="min-w-0 flex-1 px-1 text-center sm:min-w-56">
            <p className="text-xs font-semibold tracking-wider text-tinta-suave uppercase">
              {['hoy', 'mañana', 'ayer'].includes(relativa) ? relativa : 'Fecha'}
            </p>
            <p className="font-bold">{capitalizar(fechaLarga(fecha))}</p>
          </div>
          <button
            type="button"
            onClick={() => onCambiarFecha(dias[i + 1])}
            disabled={i === -1 || i >= dias.length - 1}
            className="grid size-10 cursor-pointer place-items-center rounded-xl border border-marfil-300 bg-white hover:border-marfil-400 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Día siguiente"
          >
            <ChevronRight className="size-4" />
          </button>
          {fecha !== hoy && (
            <button
              type="button"
              onClick={() => onCambiarFecha(hoy)}
              className="h-10 cursor-pointer rounded-xl px-3 text-sm font-semibold text-verde-700 hover:bg-verde-50"
            >
              Hoy
            </button>
          )}
        </div>

        {/* Estado del plazo de reservas */}
        {abierta ? (
          <p className="flex items-center gap-2 rounded-xl bg-miel-50 px-3 py-2 text-sm text-miel-800 ring-1 ring-miel-100">
            <Clock className="size-4 shrink-0" aria-hidden="true" />
            <span>
              <strong className="font-semibold">Reservas abiertas</strong> · cierran en{' '}
              {textoRestante(cierreDe(fecha) - ahora)}. Los números pueden subir.
            </span>
          </p>
        ) : (
          <p className="flex items-center gap-2 rounded-xl bg-verde-50 px-3 py-2 text-sm text-verde-900 ring-1 ring-verde-200">
            <CircleCheck className="size-4 shrink-0" aria-hidden="true" />
            <span>
              <strong className="font-semibold">Reservas cerradas</strong> a las {HORA_CIERRE_TEXTO} · lista
              definitiva
            </span>
          </p>
        )}
      </div>
    </div>
  )
}
