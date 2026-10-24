// 🎬 Controles de demo: "adelantan el reloj" para mostrar en vivo
// cómo se ve una reserva justo antes y justo después del cierre.

import { Clapperboard } from 'lucide-react'
import { useReloj } from '../../context/RelojContext'
import { cierreDe } from '../../utils/fechas'

export default function ControlesDemo({ fecha }) {
  const { simularHora, volverHoraReal, simulada } = useReloj()
  const cierre = cierreDe(fecha).getTime()

  const opciones = [
    { etiqueta: 'Faltan 10 segundos', accion: () => simularHora(new Date(cierre - 10_000)) },
    { etiqueta: 'Faltan 45 minutos', accion: () => simularHora(new Date(cierre - 45 * 60_000)) },
    { etiqueta: 'Plazo cerrado', accion: () => simularHora(new Date(cierre + 60_000)) },
  ]

  return (
    <section
      aria-label="Controles de demostración"
      className="rounded-2xl border-2 border-dashed border-marfil-300 bg-marfil-50/60 p-4"
    >
      <p className="flex items-center gap-2 text-sm font-bold text-tinta">
        <Clapperboard className="size-4 text-miel-600" aria-hidden="true" />
        Controles de demo
        <span className="font-normal text-tinta-suave">· solo en el prototipo</span>
      </p>
      <p className="mt-1 text-sm text-tinta-suave">Simula la hora para mostrar el antes y el después del cierre.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {opciones.map((o) => (
          <button
            key={o.etiqueta}
            type="button"
            onClick={o.accion}
            className="h-9 cursor-pointer rounded-xl border border-marfil-300 bg-white px-3 text-sm font-semibold hover:border-miel-400 hover:bg-miel-50"
          >
            {o.etiqueta}
          </button>
        ))}
        <button
          type="button"
          onClick={volverHoraReal}
          disabled={!simulada}
          className="h-9 cursor-pointer rounded-xl px-3 text-sm font-semibold text-verde-700 hover:bg-verde-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Volver a la hora real
        </button>
      </div>
    </section>
  )
}
