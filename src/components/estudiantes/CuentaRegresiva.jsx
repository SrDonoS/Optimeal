// ⏳ Cuenta regresiva hasta el cierre de reservas.
// Cambia de color a medida que se acerca la hora límite.

import { partesTiempo, textoRestante } from '../../utils/fechas'

const pad = (n) => String(n).padStart(2, '0')

export default function CuentaRegresiva({ ms }) {
  const cerrado = ms <= 0
  const { dias, horas, minutos, segundos } = partesTiempo(ms)

  const tono = cerrado
    ? 'bg-marfil-200 text-tinta-suave'
    : ms <= 5 * 60_000
      ? 'bg-arcilla-50 text-arcilla-700 ring-1 ring-arcilla-100'
      : ms <= 60 * 60_000
        ? 'bg-miel-50 text-miel-800 ring-1 ring-miel-100'
        : 'bg-white text-verde-800 ring-1 ring-marfil-300'

  const bloques = [
    { valor: dias, etiqueta: dias === 1 ? 'día' : 'días' },
    { valor: horas, etiqueta: 'horas' },
    { valor: minutos, etiqueta: 'min' },
    { valor: segundos, etiqueta: 'seg' },
  ]

  return (
    <div role="timer" aria-label={cerrado ? 'Plazo cerrado' : `Faltan ${textoRestante(ms)}`}>
      <div className="grid grid-cols-4 gap-2 sm:gap-3" aria-hidden="true">
        {bloques.map((b) => (
          <div key={b.etiqueta} className={`rounded-2xl px-1 py-3 text-center transition-colors sm:py-4 ${tono}`}>
            <p className="font-display text-3xl leading-none font-semibold tabular-nums sm:text-[2.5rem]">{pad(b.valor)}</p>
            <p className="mt-1.5 text-xs font-semibold uppercase opacity-80">{b.etiqueta}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
