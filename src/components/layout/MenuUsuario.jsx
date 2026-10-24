// 👤 Menú del usuario: nombre, correo y "Cerrar sesión".

import { ChevronDown, House, LogOut } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSesion } from '../../context/SesionContext'
import { iniciales } from '../../utils/texto'

export default function MenuUsuario({ area }) {
  const { sesiones, cerrarSesion } = useSesion()
  const navigate = useNavigate()
  const [abierto, setAbierto] = useState(false)
  const contenedor = useRef(null)
  const sesion = sesiones[area.id]

  // Cerrar al hacer clic fuera o presionar Escape
  useEffect(() => {
    if (!abierto) return
    const clicFuera = (e) => !contenedor.current?.contains(e.target) && setAbierto(false)
    const escape = (e) => e.key === 'Escape' && setAbierto(false)
    document.addEventListener('mousedown', clicFuera)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('mousedown', clicFuera)
      document.removeEventListener('keydown', escape)
    }
  }, [abierto])

  if (!sesion) return null

  const salir = () => {
    cerrarSesion(area.id)
    navigate(`/login/${area.id}`, { replace: true })
  }

  return (
    <div ref={contenedor} className="relative">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-haspopup="menu"
        className="flex h-10 cursor-pointer items-center gap-2 rounded-xl py-1 pr-2 pl-1 hover:bg-marfil-200"
      >
        <span className="grid size-8 place-items-center rounded-lg bg-verde-600 text-xs font-bold text-white">
          {iniciales(sesion.nombre)}
        </span>
        <span className="hidden max-w-[9rem] truncate text-sm font-semibold md:block">{sesion.nombre}</span>
        <ChevronDown className="size-4 text-tinta-suave" aria-hidden="true" />
        <span className="sr-only">Menú de usuario</span>
      </button>

      {abierto && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 animate-aparecer rounded-2xl border border-marfil-300/80 bg-white p-2 shadow-flotante"
        >
          <div className="border-b border-marfil-200 px-3 pt-2 pb-3">
            <p className="text-sm font-bold">{sesion.nombre}</p>
            <p className="truncate text-xs text-tinta-suave">{sesion.correo}</p>
            <p className="mt-1 text-xs font-semibold text-verde-700">{area.titulo}</p>
          </div>
          <Link
            role="menuitem"
            to="/"
            className="mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-marfil-100"
          >
            <House className="size-4 text-tinta-suave" aria-hidden="true" />
            Ir al inicio
          </Link>
          <button
            role="menuitem"
            type="button"
            onClick={salir}
            className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-arcilla-700 hover:bg-arcilla-50"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
