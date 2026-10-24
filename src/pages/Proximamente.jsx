// 🚧 Vista temporal para las pantallas que aún no construimos.
// Muestra qué incluirá la pantalla y en qué fase llegará.

import { CircleDashed, Hammer, School } from 'lucide-react'
import Insignia from '../components/ui/Insignia'
import Tarjeta from '../components/ui/Tarjeta'
import { useSesion } from '../context/SesionContext'
import { TONOS } from '../data/areas'
import { buscarEstablecimiento } from '../data/establecimientos'

export default function Proximamente({ area, item }) {
  const { sesiones, establecimientoActivoId } = useSesion()
  const sesion = sesiones[area.id]
  const tono = TONOS[area.tono]
  const Icono = item.icono
  const establecimiento = buscarEstablecimiento(
    area.id === 'estudiantes' ? sesion?.establecimientoId : establecimientoActivoId,
  )

  return (
    <div className="animate-aparecer">
      {/* Encabezado de la pantalla */}
      <p className="text-sm font-semibold text-tinta-suave">
        ¡Hola, {sesion?.nombre.split(' ')[0]}! 👋
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-verde-900 sm:text-4xl">
        {item.etiqueta}
      </h1>
      <p className="mt-2 max-w-2xl text-tinta-suave">{item.descripcion}</p>

      <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-medium ring-1 ring-marfil-300">
        <School className="size-4 text-verde-700" aria-hidden="true" />
        <span className="text-tinta-suave">Datos de:</span>
        <strong className="font-semibold">{establecimiento.nombre}</strong>
      </p>

      <Tarjeta className="mt-8 grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <span className={`grid size-14 place-items-center rounded-2xl ${tono.icono}`}>
            <Icono className="size-7" aria-hidden="true" />
          </span>
          <Insignia tono="miel" icono={Hammer} className="mt-5">
            En construcción · Fase {item.fase}
          </Insignia>
          <h2 className="mt-3 text-xl font-bold">Esta pantalla llega en la Fase {item.fase}</h2>
          <p className="mt-2 text-tinta-suave">
            La estructura, la navegación y la sesión ya funcionan. Esto es lo que incluirá:
          </p>
          <ul className="mt-5 space-y-3">
            {item.incluye.map((texto) => (
              <li key={texto} className="flex gap-3 text-[15px]">
                <CircleDashed className={`mt-0.5 size-5 shrink-0 ${tono.texto}`} aria-hidden="true" />
                {texto}
              </li>
            ))}
          </ul>
        </div>

        {/* Boceto de cómo se verá (esqueleto) */}
        <div
          className="rounded-2xl border-2 border-dashed border-marfil-300 bg-marfil-100 p-5"
          aria-hidden="true"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 rounded-full bg-marfil-300" />
            <div className="h-8 w-24 rounded-xl bg-marfil-300/70" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-xl bg-white p-3 ring-1 ring-marfil-300/60">
                <div className="h-2.5 w-12 rounded-full bg-marfil-300" />
                <div className="mt-3 h-5 w-10 rounded-md bg-verde-100" />
              </div>
            ))}
          </div>
          <div className="mt-3 flex h-36 items-end gap-2 rounded-xl bg-white p-4 ring-1 ring-marfil-300/60">
            {[45, 70, 55, 90, 65, 80, 50].map((h, i) => (
              <div
                key={i}
                className="flex-1 animate-pulse rounded-t-md bg-verde-100"
                style={{ height: `${h}%`, animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-3 w-full rounded-full bg-marfil-300/70" />
            <div className="h-3 w-4/5 rounded-full bg-marfil-300/70" />
          </div>
        </div>
      </Tarjeta>
    </div>
  )
}
