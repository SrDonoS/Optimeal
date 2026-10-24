// 🧩 Estructura común de los 3 paneles:
//   - Menú lateral (en móvil se abre como cajón)
//   - Barra superior con establecimiento y menú de usuario
//   - <Outlet/>: aquí se dibuja la pantalla activa

import { ArrowLeftRight, Info, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useSesion } from '../../context/SesionContext'
import { FASE_ACTUAL, TONOS } from '../../data/areas'
import { buscarEstablecimiento, CONCESIONARIA } from '../../data/establecimientos'
import BannerHoraSimulada from '../reloj/BannerHoraSimulada'
import Insignia from '../ui/Insignia'
import Logo from '../Logo'
import MenuUsuario from './MenuUsuario'
import SelectorEstablecimiento from './SelectorEstablecimiento'

export default function PanelLayout({ area }) {
  const [cajonAbierto, setCajonAbierto] = useState(false)
  const { pathname } = useLocation()

  // Cerrar el cajón móvil al navegar
  useEffect(() => {
    setCajonAbierto(false)
  }, [pathname])

  // Cerrar con la tecla Escape
  useEffect(() => {
    if (!cajonAbierto) return
    const alPresionar = (e) => e.key === 'Escape' && setCajonAbierto(false)
    window.addEventListener('keydown', alPresionar)
    return () => window.removeEventListener('keydown', alPresionar)
  }, [cajonAbierto])

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[18.5rem_1fr]">
      {/* Menú lateral de escritorio */}
      <aside data-no-imprimir className="sticky top-0 hidden h-dvh border-r border-marfil-300/80 bg-marfil-50 lg:block">
        <ContenidoLateral area={area} />
      </aside>

      {/* Cajón móvil */}
      {cajonAbierto && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú de navegación">
          <button
            type="button"
            className="absolute inset-0 bg-tinta/30 backdrop-blur-[2px]"
            onClick={() => setCajonAbierto(false)}
            aria-label="Cerrar menú"
          />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-xs animate-aparecer bg-marfil-50 shadow-flotante">
            <button
              type="button"
              onClick={() => setCajonAbierto(false)}
              className="absolute top-5 right-4 grid size-9 cursor-pointer place-items-center rounded-xl text-tinta-suave hover:bg-marfil-200"
              aria-label="Cerrar menú"
            >
              <X className="size-5" />
            </button>
            <ContenidoLateral area={area} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-col">
        {/* Barra superior */}
        <header data-no-imprimir className="sticky top-0 z-30 border-b border-marfil-300/70 bg-marfil-100/85 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-10">
            <button
              type="button"
              onClick={() => setCajonAbierto(true)}
              className="grid size-10 cursor-pointer place-items-center rounded-xl text-tinta hover:bg-marfil-200 lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="size-5" />
            </button>
            <Link to="/" className="rounded-xl lg:hidden" aria-label="Optimeal, ir al inicio">
              <Logo tamano="sm" className="[&>span:last-child]:hidden sm:[&>span:last-child]:inline" />
            </Link>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <ContextoEstablecimiento area={area} />
              <MenuUsuario area={area} />
            </div>
          </div>
        </header>

        <BannerHoraSimulada />

        <main id="contenido" data-area-impresion className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// Estudiantes ven su colegio fijo; Casino y Administración pueden cambiarlo.
function ContextoEstablecimiento({ area }) {
  const { sesiones } = useSesion()
  if (area.id === 'estudiantes') {
    const colegio = buscarEstablecimiento(sesiones.estudiantes?.establecimientoId)
    return (
      <span className="hidden items-center rounded-full bg-marfil-200 px-3 py-1.5 text-sm font-semibold text-tinta-suave sm:inline-flex">
        {colegio.nombre}
      </span>
    )
  }
  return <SelectorEstablecimiento />
}

function ContenidoLateral({ area }) {
  const { sesiones, establecimientoActivoId } = useSesion()
  const tono = TONOS[area.tono]
  const Icono = area.icono

  const subtitulo =
    area.id === 'estudiantes'
      ? buscarEstablecimiento(sesiones.estudiantes?.establecimientoId).nombre
      : area.id === 'casino'
        ? buscarEstablecimiento(establecimientoActivoId).casino
        : CONCESIONARIA.nombre

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 py-5">
      <Link to="/" className="w-fit rounded-xl px-2" aria-label="Optimeal, ir al inicio">
        <Logo />
      </Link>

      {/* Tarjeta del área */}
      <div className={`mt-6 flex items-center gap-3 rounded-2xl border ${tono.borde} ${tono.suave} p-3`}>
        <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tono.icono}`}>
          <Icono className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-tinta">{area.titulo}</p>
          <p className="truncate text-xs text-tinta-suave">{subtitulo}</p>
        </div>
      </div>

      <nav aria-label={`Navegación ${area.titulo}`} className="mt-6">
        <p className="px-3 text-xs font-bold tracking-wider text-tinta-suave uppercase">Menú</p>
        <ul className="mt-2 space-y-1">
          {area.nav.map((item) => {
            const IconoItem = item.icono
            const pendiente = item.fase > FASE_ACTUAL
            return (
              <li key={item.ruta}>
                <NavLink
                  to={`${area.ruta}/${item.ruta}`}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-semibold transition-colors ${
                      isActive
                        ? 'bg-white text-verde-800 shadow-suave ring-1 ring-marfil-300/80'
                        : 'text-tinta-suave hover:bg-marfil-200 hover:text-tinta'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <IconoItem
                        className={`size-[18px] shrink-0 ${isActive ? 'text-verde-600' : ''}`}
                        aria-hidden="true"
                      />
                      <span className="flex-1">{item.etiqueta}</span>
                      {pendiente && <Insignia tono="neutro">Fase {item.fase}</Insignia>}
                    </>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-auto space-y-3 pt-8">
        <div className="rounded-2xl bg-marfil-200/70 p-3.5 text-xs leading-relaxed text-tinta-suave">
          <p className="flex items-center gap-1.5 font-bold text-tinta">
            <Info className="size-3.5" aria-hidden="true" /> Prototipo
          </p>
          <p className="mt-1">Todos los datos que ves son ficticios y se guardan solo en este navegador.</p>
        </div>
        <Link
          to="/"
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-tinta-suave hover:bg-marfil-200 hover:text-tinta"
        >
          <ArrowLeftRight className="size-4" aria-hidden="true" />
          Cambiar de área
        </Link>
      </div>
    </div>
  )
}
