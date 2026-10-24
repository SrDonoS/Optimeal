// 🎬 Franja que avisa cuando la app está usando una hora simulada.

import { Clapperboard, RotateCcw } from 'lucide-react'
import { useAhora, useReloj } from '../../context/RelojContext'
import { fechaCorta, horaConSegundos, aISO } from '../../utils/fechas'

export default function BannerHoraSimulada() {
  const { simulada, volverHoraReal } = useReloj()
  const ahora = useAhora()
  if (!simulada) return null

  return (
    <div data-no-imprimir className="border-b border-miel-100 bg-miel-50">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 text-sm text-miel-800 sm:px-6 lg:px-10">
        <Clapperboard className="size-4 shrink-0" aria-hidden="true" />
        <p>
          <strong className="font-semibold">Hora simulada:</strong> {fechaCorta(aISO(ahora))} ·{' '}
          <span className="font-mono tabular-nums">{horaConSegundos(ahora)}</span>
          <span className="hidden sm:inline"> — la app se comporta como si fuera esta hora.</span>
        </p>
        <button
          type="button"
          onClick={volverHoraReal}
          className="ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 font-semibold underline decoration-miel-400 decoration-2 underline-offset-4 hover:bg-miel-100"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Volver a la hora real
        </button>
      </div>
    </div>
  )
}
