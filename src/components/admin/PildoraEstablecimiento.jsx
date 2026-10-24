// Muestra qué establecimiento se está viendo (los datos de cada uno van separados).

import { School } from 'lucide-react'

export default function PildoraEstablecimiento({ est }) {
  return (
    <p className="mt-3 inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium ring-1 ring-marfil-300">
      <School className="size-4 text-verde-700" aria-hidden="true" />
      <span className="text-tinta-suave">Datos de:</span>
      <strong className="font-semibold">{est.nombre}</strong>
      <span className="text-tinta-suave">· {est.casino}</span>
    </p>
  )
}
