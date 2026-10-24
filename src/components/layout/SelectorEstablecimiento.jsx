// 🏫 Selector del establecimiento activo (Casino y Administración).
// Cambiarlo hace que los paneles muestren SOLO los datos de ese colegio.

import { ChevronDown, School } from 'lucide-react'
import { useSesion } from '../../context/SesionContext'
import { ESTABLECIMIENTOS } from '../../data/establecimientos'

export default function SelectorEstablecimiento() {
  const { establecimientoActivoId, setEstablecimientoActivoId } = useSesion()

  return (
    <div className="relative">
      <label htmlFor="establecimiento-activo" className="sr-only">
        Establecimiento activo
      </label>
      <School
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-verde-700"
        aria-hidden="true"
      />
      <select
        id="establecimiento-activo"
        value={establecimientoActivoId}
        onChange={(e) => setEstablecimientoActivoId(e.target.value)}
        className="h-10 max-w-[11rem] cursor-pointer appearance-none truncate rounded-xl border border-marfil-300 bg-white pr-9 pl-9 text-sm font-semibold text-tinta shadow-suave outline-none hover:border-marfil-400 focus:border-verde-500 focus:ring-4 focus:ring-verde-100 sm:max-w-none"
      >
        {ESTABLECIMIENTOS.map((e) => (
          <option key={e.id} value={e.id}>
            {e.nombre} · {e.comuna}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-tinta-suave"
        aria-hidden="true"
      />
    </div>
  )
}
