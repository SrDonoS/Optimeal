// Campo de formulario accesible: etiqueta + input + ayuda/error.
// Se conecta con aria-describedby para que los lectores de pantalla
// lean la ayuda y los errores.

import { ChevronDown } from 'lucide-react'
import { useId } from 'react'

export default function Campo({
  etiqueta,
  ayuda,
  error,
  icono: Icono,
  accesorio, // algo a la derecha del input (ej: botón "mostrar contraseña")
  id,
  className = '',
  children, // si se pasa, reemplaza al <input> (ej: un <select>)
  ...props
}) {
  const autoId = useId()
  const campoId = id ?? autoId
  const ayudaId = `${campoId}-ayuda`
  const errorId = `${campoId}-error`
  const describedBy = error ? errorId : ayuda ? ayudaId : undefined

  const clasesInput = [
    'h-12 w-full rounded-2xl border bg-white text-[15px] text-tinta placeholder:text-tinta-suave/60',
    'transition-colors outline-none',
    'focus:border-verde-500 focus:ring-4 focus:ring-verde-100',
    error ? 'border-arcilla-500' : 'border-marfil-300 hover:border-marfil-400',
    Icono ? 'pl-11' : 'pl-4',
    accesorio || children ? 'pr-12' : 'pr-4',
  ].join(' ')

  return (
    <div className={className}>
      <label htmlFor={campoId} className="mb-1.5 block text-sm font-semibold text-tinta">
        {etiqueta}
      </label>
      <div className="relative">
        {Icono && (
          <Icono
            className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-tinta-suave"
            aria-hidden="true"
          />
        )}
        {children ? (
          <select
            id={campoId}
            aria-describedby={describedBy}
            aria-invalid={error ? true : undefined}
            className={`${clasesInput} cursor-pointer appearance-none`}
            {...props}
          >
            {children}
          </select>
        ) : (
          <input
            id={campoId}
            aria-describedby={describedBy}
            aria-invalid={error ? true : undefined}
            className={clasesInput}
            {...props}
          />
        )}
        {accesorio && <div className="absolute top-1/2 right-2 -translate-y-1/2">{accesorio}</div>}
        {children && (
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-4 size-[18px] -translate-y-1/2 text-tinta-suave"
            aria-hidden="true"
          />
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-arcilla-700" role="alert">
          {error}
        </p>
      )}
      {ayuda && !error && (
        <p id={ayudaId} className="mt-1.5 text-sm text-tinta-suave">
          {ayuda}
        </p>
      )}
    </div>
  )
}
