// Ventana de diálogo (modal) accesible, usando el elemento nativo <dialog>.
// El navegador se encarga de atrapar el foco y de cerrar con Escape.

import { useEffect, useId, useRef } from 'react'

export default function Dialogo({ abierto, onCerrar, titulo, icono: Icono, tono = 'verde', children, acciones }) {
  const ref = useRef(null)
  const tituloId = useId()

  useEffect(() => {
    const dialogo = ref.current
    if (!dialogo) return
    if (abierto && !dialogo.open) dialogo.showModal()
    if (!abierto && dialogo.open) dialogo.close()
  }, [abierto])

  const colorIcono = tono === 'arcilla' ? 'bg-arcilla-50 text-arcilla-700' : 'bg-verde-100 text-verde-700'

  return (
    <dialog
      ref={ref}
      aria-labelledby={tituloId}
      onClose={onCerrar}
      onClick={(e) => e.target === ref.current && onCerrar()}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border border-marfil-300 bg-marfil-50 p-0 text-tinta shadow-flotante backdrop:bg-tinta/40 backdrop:backdrop-blur-[2px] open:animate-aparecer"
    >
      <div className="p-6 sm:p-7">
        {Icono && (
          <span className={`grid size-12 place-items-center rounded-2xl ${colorIcono}`}>
            <Icono className="size-6" aria-hidden="true" />
          </span>
        )}
        <h2 id={tituloId} className="mt-4 text-xl font-bold">
          {titulo}
        </h2>
        <div className="mt-2 text-tinta-suave">{children}</div>
        {acciones && <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{acciones}</div>}
      </div>
    </dialog>
  )
}
