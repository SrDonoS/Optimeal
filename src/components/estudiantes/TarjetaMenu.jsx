// 🍽️ Tarjeta de un menú: ilustración, plato, ingredientes y acompañamientos.

import { Apple, Check, CircleCheck, Salad, Wheat } from 'lucide-react'
import { TIPOS_MENU } from '../../data/menus'
import Plato from '../ilustraciones/Plato'
import Boton from '../ui/Boton'

// Ícono según el tipo de acompañamiento
function iconoAcompanamiento(texto) {
  if (/ensalada/i.test(texto)) return Salad
  return Wheat
}

export default function TarjetaMenu({ menu, seleccionado, reservado, deshabilitado, onSeleccionar }) {
  const tipo = TIPOS_MENU[menu.tipo]

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-3xl border bg-marfil-50 transition-all duration-200 ${
        seleccionado
          ? 'border-verde-500 shadow-flotante ring-2 ring-verde-500'
          : 'border-marfil-300/80 shadow-suave hover:shadow-flotante'
      }`}
    >
      {/* Ilustración */}
      <div className={`relative grid aspect-[4/3] place-items-center ${tipo.fondo}`}>
        <Plato ilustracion={menu.ilustracion} className="size-[72%] drop-shadow-sm" titulo={`Ilustración: ${menu.nombre}`} />
        <span className="absolute top-3 left-3 flex gap-1.5">
          <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-bold text-tinta ring-1 ring-marfil-300">
            <span aria-hidden="true">{tipo.emoji}</span> {tipo.nombre}
          </span>
          {menu.nuevo && (
            <span className="rounded-full bg-verde-700 px-2.5 py-0.5 text-xs font-bold text-white">✨ Nuevo</span>
          )}
        </span>
        {reservado ? (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-verde-600 px-2.5 py-1 text-xs font-bold text-white shadow-suave">
            <CircleCheck className="size-3.5" aria-hidden="true" /> Tu reserva
          </span>
        ) : (
          <span className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-tinta-suave ring-1 ring-marfil-300">
            ~{menu.calorias} kcal
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg leading-snug font-bold">{menu.nombre}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-tinta-suave">{menu.descripcion}</p>

        <p className="mt-4 text-xs font-bold tracking-wider text-tinta-suave uppercase">Ingredientes</p>
        <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Ingredientes">
          {menu.ingredientes.map((ing) => (
            <li key={ing} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium ring-1 ring-marfil-300">
              {ing}
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs font-bold tracking-wider text-tinta-suave uppercase">Acompañamientos</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {menu.acompanamientos.map((a) => {
            const Icono = iconoAcompanamiento(a)
            return (
              <li key={a} className="flex items-center gap-2">
                <Icono className="size-4 shrink-0 text-verde-600" aria-hidden="true" />
                {a}
              </li>
            )
          })}
          <li className="flex items-center gap-2">
            <Apple className="size-4 shrink-0 text-arcilla-500" aria-hidden="true" />
            Postre: {menu.postre}
          </li>
        </ul>

        <div className="mt-auto pt-5">
          <Boton
            variante={seleccionado ? 'suave' : 'secundario'}
            bloque
            icono={seleccionado ? Check : undefined}
            onClick={() => onSeleccionar(menu.id)}
            disabled={deshabilitado}
            aria-pressed={seleccionado}
            title={deshabilitado ? 'El plazo para reservar este día ya cerró' : undefined}
          >
            {seleccionado ? 'Menú seleccionado' : 'Seleccionar menú'}
          </Boton>
        </div>
      </div>
    </article>
  )
}
