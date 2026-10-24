// 📅 Selector de fecha: muestra los días hábiles de una semana con su estado
// (reservado ✓, cerrado 🔒 o abierto).

import { ChevronLeft, ChevronRight, CircleCheck, Lock } from 'lucide-react'
import { SEMANAS_RESERVABLES } from '../../data/config'
import { aISO, desdeISO, diaSemanaCorto, diasHabilesDeSemana, estaAbierta, fechaLarga, lunesDe, mesCorto, sumarDias } from '../../utils/fechas'

export default function SelectorFecha({ fecha, onCambiar, ahora, fechasReservadas, semanasMax = SEMANAS_RESERVABLES }) {
  const lunesActual = lunesDe(ahora)
  const lunesVisible = lunesDe(desdeISO(fecha))
  const semana = Math.round((lunesVisible - lunesActual) / (7 * 86400000))
  const dias = diasHabilesDeSemana(lunesVisible)
  const hoy = aISO(ahora)

  const irASemana = (delta) => {
    const nuevoLunes = sumarDias(lunesVisible, delta * 7)
    const opciones = diasHabilesDeSemana(nuevoLunes)
    onCambiar(opciones.find((d) => estaAbierta(d, ahora)) ?? opciones[0])
  }

  const titulo = semana === 0 ? 'Esta semana' : semana === 1 ? 'Próxima semana' : `En ${semana} semanas`

  return (
    <div className="rounded-3xl border border-marfil-300/80 bg-marfil-50 p-4 shadow-suave sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold">{titulo}</p>
          <p className="text-xs text-tinta-suave">
            Semana del {desdeISO(dias[0]).getDate()} {mesCorto(dias[0])}
          </p>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => irASemana(-1)}
            disabled={semana <= 0}
            className="grid size-9 cursor-pointer place-items-center rounded-xl border border-marfil-300 bg-white hover:border-marfil-400 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Semana anterior"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => irASemana(1)}
            disabled={semana >= semanasMax - 1}
            className="grid size-9 cursor-pointer place-items-center rounded-xl border border-marfil-300 bg-white hover:border-marfil-400 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Semana siguiente"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-1.5 sm:gap-2" role="group" aria-label="Elige una fecha">
        {dias.map((iso) => {
          const activo = iso === fecha
          const abierta = estaAbierta(iso, ahora)
          const reservado = fechasReservadas.has(iso)
          const estado = reservado ? 'tienes reserva' : abierta ? 'reservas abiertas' : 'reservas cerradas'
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onCambiar(iso)}
              aria-pressed={activo}
              aria-label={`${fechaLarga(iso)}${iso === hoy ? ' (hoy)' : ''}, ${estado}`}
              className={`relative flex cursor-pointer flex-col items-center rounded-2xl px-1 py-2.5 transition-colors sm:py-3 ${
                activo
                  ? 'bg-verde-600 text-white shadow-boton'
                  : abierta
                    ? 'bg-white ring-1 ring-marfil-300 hover:ring-verde-300'
                    : 'bg-marfil-200/70 text-tinta-suave hover:bg-marfil-200'
              }`}
            >
              <span className={`text-xs font-semibold uppercase ${activo ? 'text-verde-100' : ''}`}>
                {diaSemanaCorto(iso)}
              </span>
              <span className="font-display text-2xl leading-tight font-semibold">{desdeISO(iso).getDate()}</span>
              <span className="mt-0.5 flex h-4 items-center" aria-hidden="true">
                {reservado ? (
                  <CircleCheck className={`size-4 ${activo ? 'text-white' : 'text-verde-600'}`} />
                ) : !abierta ? (
                  <Lock className="size-3.5 opacity-70" />
                ) : (
                  <span className={`size-1.5 rounded-full ${activo ? 'bg-white' : 'bg-verde-400'}`} />
                )}
              </span>
              {iso === hoy && (
                <span
                  className={`absolute -top-2 rounded-full px-1.5 text-[10px] font-bold uppercase ${
                    activo ? 'bg-white text-verde-700' : 'bg-miel-100 text-miel-800'
                  }`}
                >
                  Hoy
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-tinta-suave" aria-hidden="true">
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-verde-400" /> Abierto
        </span>
        <span className="flex items-center gap-1">
          <CircleCheck className="size-3.5 text-verde-600" /> Reservado
        </span>
        <span className="flex items-center gap-1">
          <Lock className="size-3" /> Cerrado
        </span>
      </div>
    </div>
  )
}
