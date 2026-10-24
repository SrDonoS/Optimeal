// 🏷️ Distingue claramente un DATO CONFIRMADO de una ESTIMACIÓN
// (y avisa cuando hay DATOS INSUFICIENTES para estimar).

import { CircleCheck, Sparkles, TriangleAlert } from 'lucide-react'

const TIPOS = {
  confirmado: {
    texto: 'Dato confirmado',
    icono: CircleCheck,
    clases: 'bg-verde-50 text-verde-800 ring-1 ring-inset ring-verde-200',
  },
  estimacion: {
    texto: 'Estimación',
    icono: Sparkles,
    clases: 'bg-laguna-50 text-laguna-800 border border-dashed border-laguna-600/60',
  },
  insuficiente: {
    texto: 'Datos insuficientes',
    icono: TriangleAlert,
    clases: 'bg-miel-50 text-miel-800 ring-1 ring-inset ring-miel-100',
  },
}

export default function EtiquetaDato({ tipo, texto, className = '' }) {
  const t = TIPOS[tipo]
  const Icono = t.icono
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${t.clases} ${className}`}
    >
      <Icono className="size-3.5" aria-hidden="true" />
      {texto ?? t.texto}
    </span>
  )
}
