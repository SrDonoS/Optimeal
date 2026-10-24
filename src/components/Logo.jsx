// Logo de Optimeal: un plato visto desde arriba con una hoja 🌿
// (dibujado en SVG, así se ve nítido en cualquier tamaño).

export function LogoMarca({ className = 'size-9', claro = false }) {
  const fondo = claro ? '#FBF8F1' : '#2F6B4F'
  const trazo = claro ? '#2F6B4F' : '#FBF8F1'
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="18" fill={fondo} />
      <circle cx="32" cy="32" r="19" fill="none" stroke={trazo} strokeWidth="4" />
      <path d="M24 39c0-9 6-15 17-16-1 11-7 17-16 17" fill={trazo} />
      <path
        d="M25 39c3-4 7-8 12-11"
        fill="none"
        stroke={fondo}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function Logo({ className = '', tamano = 'md', claro = false }) {
  const marca = tamano === 'lg' ? 'size-11' : tamano === 'sm' ? 'size-8' : 'size-9'
  const texto = tamano === 'lg' ? 'text-3xl' : tamano === 'sm' ? 'text-xl' : 'text-2xl'
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMarca className={marca} claro={claro} />
      <span
        className={`font-display font-semibold tracking-tight ${texto} ${claro ? 'text-marfil-50' : 'text-verde-800'}`}
      >
        Optimeal
      </span>
    </span>
  )
}
