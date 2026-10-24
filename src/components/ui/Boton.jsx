// Botón reutilizable. Puede ser <button>, un enlace interno (prop `to`)
// o un enlace externo (prop `href`).
// Ejemplo: <Boton variante="secundario" icono={ArrowLeft} to="/">Volver</Boton>

import { LoaderCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const VARIANTES = {
  primario:
    'bg-verde-600 text-white shadow-boton hover:bg-verde-700 active:bg-verde-800',
  secundario:
    'bg-marfil-50 text-tinta border border-marfil-300 shadow-suave hover:bg-white hover:border-marfil-400',
  suave: 'bg-verde-50 text-verde-800 hover:bg-verde-100',
  fantasma: 'text-verde-700 hover:bg-verde-50',
  peligro: 'bg-arcilla-500 text-white hover:bg-arcilla-700',
  peligroSuave: 'text-arcilla-700 hover:bg-arcilla-50',
}

const TAMANOS = {
  sm: 'h-9 px-3.5 text-sm rounded-xl gap-1.5',
  md: 'h-11 px-5 text-[15px] rounded-2xl gap-2',
  lg: 'h-13 px-6 text-base rounded-2xl gap-2.5',
}

export default function Boton({
  children,
  variante = 'primario',
  tamano = 'md',
  icono: Icono,
  iconoDerecha: IconoDerecha,
  cargando = false,
  bloque = false,
  to,
  href,
  className = '',
  ...props
}) {
  const clases = [
    'inline-flex cursor-pointer items-center justify-center font-semibold whitespace-nowrap',
    'transition-colors duration-150 select-none',
    'disabled:cursor-not-allowed disabled:opacity-55',
    VARIANTES[variante],
    TAMANOS[tamano],
    bloque ? 'w-full' : '',
    className,
  ].join(' ')

  const contenido = (
    <>
      {cargando ? (
        <LoaderCircle className="size-[1.15em] animate-spin" aria-hidden="true" />
      ) : (
        Icono && <Icono className="size-[1.15em] shrink-0" aria-hidden="true" />
      )}
      {children}
      {IconoDerecha && !cargando && (
        <IconoDerecha className="size-[1.15em] shrink-0" aria-hidden="true" />
      )}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={clases} {...props}>
        {contenido}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={clases} {...props}>
        {contenido}
      </a>
    )
  }

  return (
    <button
      type="button"
      className={clases}
      disabled={cargando || props.disabled}
      aria-busy={cargando || undefined}
      {...props}
    >
      {contenido}
    </button>
  )
}
