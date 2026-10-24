// Resumen compacto de un menú (ilustración pequeña + nombre + tipo).

import { TIPOS_MENU } from '../../data/menus'
import Plato from '../ilustraciones/Plato'

export default function MiniMenu({ menu, tamano = 'md', children }) {
  if (!menu) return null
  const tipo = TIPOS_MENU[menu.tipo]
  const caja = tamano === 'sm' ? 'size-12 rounded-xl' : 'size-16 rounded-2xl'
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className={`grid shrink-0 place-items-center ${caja} ${tipo.fondo}`}>
        <Plato ilustracion={menu.ilustracion} className="size-[85%]" />
      </span>
      <div className="min-w-0">
        <p className="font-bold leading-snug">{menu.nombre}</p>
        <p className="text-sm text-tinta-suave">
          <span aria-hidden="true">{tipo.emoji}</span> {tipo.nombre}
          {children}
        </p>
      </div>
    </div>
  )
}
