// Indicador de pasos de la reserva: 1 Elegir · 2 Confirmar · 3 Retirar con QR

import { Check } from 'lucide-react'

export default function PasosReserva({ actual }) {
  const pasos = ['Elegir menú', 'Confirmar', 'Retirar con QR']
  return (
    <ol className="flex flex-wrap items-center gap-2 text-sm" aria-label="Pasos de la reserva">
      {pasos.map((p, i) => {
        const n = i + 1
        const hecho = actual > n
        const activo = actual === n
        return (
          <li key={p} className="flex items-center gap-2">
            <span
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 font-semibold ${
                activo ? 'bg-verde-600 text-white' : hecho ? 'bg-verde-100 text-verde-800' : 'bg-marfil-200 text-tinta-suave'
              }`}
              aria-current={activo ? 'step' : undefined}
            >
              {hecho ? <Check className="size-4" aria-hidden="true" /> : <span aria-hidden="true">{n}</span>}
              {p}
            </span>
            {n < pasos.length && <span className="h-px w-4 bg-marfil-400 sm:w-8" aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}
