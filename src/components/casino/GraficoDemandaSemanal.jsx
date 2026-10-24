// 📊 Gráfico de demanda de la semana: reservas confirmadas por día y por menú.
//
// - Columnas apiladas por tipo de menú (colores validados para daltonismo).
// - En los días con reservas abiertas, un contorno punteado muestra cuántas
//   reservas se ESTIMAN al cierre (para no confundir estimación con dato real).
// - Una línea de referencia (y su valor en la leyenda) muestra cuánto se cocinaba ANTES de Optimeal.
// - Pasa el mouse (o navega con Tab) sobre una columna para ver el detalle.

import { Table2 } from 'lucide-react'
import { TIPOS_MENU } from '../../data/menus'
import { capitalizar, diaSemanaCorto, desdeISO, fechaLarga } from '../../utils/fechas'

const TIPOS = ['tradicional', 'vegetariano', 'liviano'] // orden fijo (de abajo hacia arriba)
const ALTO = 220 // alto del área del gráfico, en px
const ANCHO_BARRA = 24

const n = (v) => v.toLocaleString('es-CL')

// Escala "redonda" para el eje Y
function escala(maximo) {
  const paso = maximo > 600 ? 200 : maximo > 250 ? 100 : 50
  const tope = Math.ceil((maximo * 1.08) / paso) * paso
  const marcas = []
  for (let v = 0; v <= tope; v += paso) marcas.push(v)
  return { tope, marcas }
}

export default function GraficoDemandaSemanal({ semana, fechaSeleccionada, onSeleccionar, referencia, hoy }) {
  const maximo = Math.max(referencia ?? 0, ...semana.map((d) => Math.max(d.total, d.estimadoCierre ?? 0)))
  const { tope, marcas } = escala(maximo)
  const alto = (v) => (v / tope) * ALTO

  return (
    <figure>
      {/* Leyenda */}
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-tinta-suave">
        {TIPOS.map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5">
            <span className="size-3 rounded-[3px]" style={{ background: TIPOS_MENU[t].color }} aria-hidden="true" />
            {TIPOS_MENU[t].nombre}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-[3px] border-[1.5px] border-dashed border-tinta-suave/70" aria-hidden="true" />
          Estimado al cierre
        </span>
        {referencia && (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-4 border-t-2 border-dashed border-arcilla-500" aria-hidden="true" />
            Antes de Optimeal: {n(referencia)} raciones/día
          </span>
        )}
      </div>

      <div className="flex">
        {/* Eje Y */}
        <div className="relative w-10 shrink-0" style={{ height: ALTO }} aria-hidden="true">
          {marcas.map((m) => (
            <span
              key={m}
              className="absolute right-2 translate-y-1/2 text-xs text-tinta-suave tabular-nums"
              style={{ bottom: alto(m) }}
            >
              {m}
            </span>
          ))}
        </div>

        {/* Área del gráfico */}
        <div className="relative flex-1" style={{ height: ALTO }}>
          {/* Líneas guía */}
          {marcas.map((m) => (
            <div key={m} className="absolute inset-x-0 border-t border-marfil-300/80" style={{ bottom: alto(m) }} aria-hidden="true" />
          ))}

          {/* Referencia: raciones fijas antes de Optimeal */}
          {referencia && (
            <div className="pointer-events-none absolute inset-x-0 z-10" style={{ bottom: alto(referencia) }} aria-hidden="true">
              <div className="border-t-2 border-dashed border-arcilla-500/80" />
            </div>
          )}

          {/* Columnas */}
          <div className="absolute inset-0 flex">
            {semana.map((d, i) => {
              const seleccionada = d.fecha === fechaSeleccionada
              // El tooltip se alinea hacia adentro para no salirse del gráfico
              const lado = i < 2 ? 'left-0' : i > semana.length - 3 ? 'right-0' : 'left-1/2 -translate-x-1/2'
              const extra = d.estimadoCierre && d.estimadoCierre > d.total ? d.estimadoCierre - d.total : 0
              const visibles = TIPOS.filter((t) => d.porTipo[t] > 0)
              return (
                <button
                  key={d.fecha}
                  type="button"
                  onClick={() => onSeleccionar(d.fecha)}
                  aria-pressed={seleccionada}
                  aria-label={`${capitalizar(fechaLarga(d.fecha))}: ${n(d.total)} reservas confirmadas${extra ? `, se estiman ${n(d.estimadoCierre)} al cierre` : ''}`}
                  className={`group relative flex flex-1 cursor-pointer flex-col items-center justify-end rounded-t-xl transition-colors ${
                    seleccionada ? 'bg-verde-50/80' : 'hover:bg-marfil-200/50'
                  }`}
                >
                  {/* Etiqueta en la cima: total confirmado (días cerrados)
                      o total estimado al cierre (días abiertos) */}
                  {extra > 0 ? (
                    <>
                      <span className="mb-1 text-xs font-semibold text-tinta-suave tabular-nums">~{n(d.estimadoCierre)}</span>
                      <span
                        className="mb-[2px] block rounded-t-[4px] border-[1.5px] border-b-0 border-dashed border-tinta-suave/60"
                        style={{ width: ANCHO_BARRA, height: Math.max(alto(extra) - 2, 2) }}
                        aria-hidden="true"
                      />
                    </>
                  ) : (
                    <span className="mb-1 text-xs font-bold text-tinta tabular-nums">{n(d.total)}</span>
                  )}

                  {/* Segmentos apilados (2 px de separación) */}
                  <span className="flex flex-col-reverse gap-[2px]" style={{ width: ANCHO_BARRA }} aria-hidden="true">
                    {visibles.map((t, idx) => (
                      <span
                        key={t}
                        className={`block transition-opacity group-hover:opacity-85 ${idx === visibles.length - 1 ? 'rounded-t-[4px]' : ''}`}
                        style={{ height: Math.max(alto(d.porTipo[t]) - 2, 1), background: TIPOS_MENU[t].color }}
                      />
                    ))}
                  </span>

                  {/* Tooltip */}
                  <span
                    role="tooltip"
                    className={`pointer-events-none absolute top-0 ${lado} z-20 hidden w-48 rounded-xl bg-white p-3 text-left text-xs shadow-flotante ring-1 ring-marfil-300 group-hover:block group-focus-visible:block`}
                  >
                    <span className="block font-bold text-tinta">{capitalizar(fechaLarga(d.fecha))}</span>
                    {[...TIPOS].reverse().map((t) => (
                      <span key={t} className="mt-1.5 flex items-center gap-2 text-tinta-suave">
                        <span className="h-0.5 w-3 rounded" style={{ background: TIPOS_MENU[t].color }} />
                        <span className="flex-1">{TIPOS_MENU[t].nombre}</span>
                        <strong className="text-tinta tabular-nums">{n(d.porTipo[t])}</strong>
                      </span>
                    ))}
                    <span className="mt-2 flex justify-between border-t border-marfil-300 pt-2 text-tinta">
                      <span>Total confirmadas</span>
                      <strong className="tabular-nums">{n(d.total)}</strong>
                    </span>
                    {extra > 0 && (
                      <span className="mt-1 flex justify-between text-tinta-suave">
                        <span>Estimado al cierre</span>
                        <strong className="tabular-nums">~{n(d.estimadoCierre)}</strong>
                      </span>
                    )}
                    <span className="mt-1 block text-tinta-suave">{d.abierta ? '🕒 Reservas abiertas' : '🔒 Reservas cerradas'}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Eje X */}
      <div className="ml-10 flex">
        {semana.map((d) => {
          const seleccionada = d.fecha === fechaSeleccionada
          return (
            <div key={d.fecha} className="flex-1 pt-2 text-center">
              <span
                className={`inline-block rounded-lg px-1.5 py-0.5 text-xs whitespace-nowrap sm:px-2 ${
                  seleccionada ? 'bg-verde-600 font-bold text-white' : 'font-semibold text-tinta-suave'
                }`}
              >
                {diaSemanaCorto(d.fecha)} {desdeISO(d.fecha).getDate()}
              </span>
              {d.fecha === hoy && <span className="block text-[10px] font-bold text-miel-800 uppercase">Hoy</span>}
            </div>
          )
        })}
      </div>

      {/* Vista de tabla (accesible y útil para revisar los números) */}
      <details className="mt-4 group/tabla">
        <summary className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-verde-700 hover:bg-verde-50">
          <Table2 className="size-4" aria-hidden="true" /> Ver datos en tabla
        </summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Reservas confirmadas por día y por menú</caption>
            <thead>
              <tr className="border-b border-marfil-300 text-left text-xs text-tinta-suave uppercase">
                <th className="py-2 pr-3 font-semibold">Día</th>
                {TIPOS.map((t) => (
                  <th key={t} className="px-3 py-2 text-right font-semibold">
                    {TIPOS_MENU[t].nombre}
                  </th>
                ))}
                <th className="px-3 py-2 text-right font-semibold">Total</th>
                <th className="py-2 pl-3 text-right font-semibold">Al cierre (est.)</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {semana.map((d) => (
                <tr key={d.fecha} className="border-b border-marfil-200">
                  <td className="py-2 pr-3">{capitalizar(fechaLarga(d.fecha))}</td>
                  {TIPOS.map((t) => (
                    <td key={t} className="px-3 py-2 text-right">
                      {n(d.porTipo[t])}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right font-bold">{n(d.total)}</td>
                  <td className="py-2 pl-3 text-right text-tinta-suave">
                    {d.abierta ? (d.estimadoCierre ? `~${n(d.estimadoCierre)}` : 'Sin datos') : 'Cerrado'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  )
}
