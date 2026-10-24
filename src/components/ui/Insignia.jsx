// Pequeña etiqueta de estado. Ej: <Insignia tono="miel">Fase 2</Insignia>

const TONOS = {
  verde: 'bg-verde-50 text-verde-800 ring-verde-200',
  miel: 'bg-miel-50 text-miel-800 ring-miel-100',
  arcilla: 'bg-arcilla-50 text-arcilla-700 ring-arcilla-100',
  laguna: 'bg-laguna-50 text-laguna-800 ring-laguna-100',
  neutro: 'bg-marfil-200 text-tinta-suave ring-marfil-300',
}

export default function Insignia({ tono = 'verde', icono: Icono, className = '', children }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${TONOS[tono]} ${className}`}
    >
      {Icono && <Icono className="size-3.5" aria-hidden="true" />}
      {children}
    </span>
  )
}
