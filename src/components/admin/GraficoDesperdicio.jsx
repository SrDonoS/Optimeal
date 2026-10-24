// 📉 Evolución de los kilos desperdiciados (promedio por día de cada semana).
//
// - Terracota: semanas medidas ANTES de Optimeal (línea base).
// - Verde: semanas con Optimeal. La semana en curso se ve más clara.
// - Línea punteada: la meta de reducción.
// - Un punto amarillo bajo la columna avisa que esa semana tiene registros faltantes.

import { Table2 } from 'lucide-react'
import { desdeISO, fechaCorta } from '../../utils/fechas'
import { kilos } from '../../utils/formato'

const ALTO = 200
const COLOR = { antes: '#AD5C1B', piloto: '#53A06D' } // paleta validada (daltonismo)

// '21/9' en el eje (corto) y 'lun 21 sept' en tooltips y tabla
const etiquetaEje = (iso) => `${desdeISO(iso).getDate()}/${desdeISO(iso).getMonth() + 1}`
const etiquetaSemana = (iso) => fechaCorta(iso)

function escala(maximo) {
  const paso = maximo > 60 ? 20 : maximo > 30 ? 10 : 5
  const tope = Math.ceil((maximo * 1.1) / paso) * paso
  const marcas = []
  for (let v = 0; v <= tope; v += paso) marcas.push(v)
  return { tope, marcas }
}

export default function GraficoDesperdicio({ semanas, metaKgDia }) {
  const visibles = semanas.filter((s) => s.tipo !== 'sin-piloto')
  const maximo = Math.max(metaKgDia ?? 0, ...visibles.map((s) => s.kgDia ?? 0))
  const { tope, marcas } = escala(maximo)
  const alto = (v) => (v / tope) * ALTO

  // Rotulamos solo lo importante: la primera semana (antes) y la última con datos
  const conDatos = visibles.filter((s) => s.kgDia != null)
  const rotuladas = new Set([conDatos[0]?.lunes, conDatos.at(-1)?.lunes])

  return (
    <figure>
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-tinta-suave">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-[3px]" style={{ background: COLOR.antes }} aria-hidden="true" /> Antes de Optimeal
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-[3px]" style={{ background: COLOR.piloto }} aria-hidden="true" /> Con Optimeal
        </span>
        {metaKgDia != null && (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-4 border-t-2 border-dashed border-tinta" aria-hidden="true" /> Meta: {kilos(metaKgDia)}/día
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-miel-400" aria-hidden="true" /> Faltan registros
        </span>
      </div>

      <div className="flex">
        <div className="relative w-9 shrink-0" style={{ height: ALTO }} aria-hidden="true">
          {marcas.map((m) => (
            <span key={m} className="absolute right-2 translate-y-1/2 text-xs text-tinta-suave tabular-nums" style={{ bottom: alto(m) }}>
              {m}
            </span>
          ))}
        </div>
        <div className="relative flex-1" style={{ height: ALTO }}>
          {marcas.map((m) => (
            <div key={m} className="absolute inset-x-0 border-t border-marfil-300/80" style={{ bottom: alto(m) }} aria-hidden="true" />
          ))}
          {metaKgDia != null && (
            <div className="pointer-events-none absolute inset-x-0 z-10 border-t-2 border-dashed border-tinta/70" style={{ bottom: alto(metaKgDia) }} aria-hidden="true" />
          )}

          <div className="absolute inset-0 flex">
            {visibles.map((s, i) => {
              const lado = i < 2 ? 'left-0' : i > visibles.length - 3 ? 'right-0' : 'left-1/2 -translate-x-1/2'
              const color = COLOR[s.tipo]
              const texto =
                s.kgDia == null
                  ? `Semana del ${etiquetaSemana(s.lunes)}: sin datos`
                  : `Semana del ${etiquetaSemana(s.lunes)}: ${kilos(s.kgDia)} por día${s.faltantes ? `, faltan ${s.faltantes} registros` : ''}`
              return (
                <div
                  key={s.lunes}
                  tabIndex={0}
                  role="img"
                  aria-label={texto}
                  className="group relative flex min-w-0 flex-1 flex-col items-center justify-end rounded-t-lg outline-offset-0 hover:bg-marfil-200/50"
                >
                  {s.kgDia == null ? (
                    <span className="mb-2 text-[10px] font-semibold text-tinta-suave">Sin datos</span>
                  ) : (
                    <>
                      {rotuladas.has(s.lunes) && (
                        <span className="mb-1 text-[11px] font-bold text-tinta tabular-nums">{s.kgDia.toLocaleString('es-CL')}</span>
                      )}
                      <span
                        className="block w-[60%] max-w-6 rounded-t-[4px] transition-opacity group-hover:opacity-85"
                        style={{ height: alto(s.kgDia), background: color, opacity: s.enCurso ? 0.5 : 1 }}
                      />
                    </>
                  )}
                  {/* Tooltip */}
                  <span
                    className={`pointer-events-none absolute top-0 ${lado} z-20 hidden w-44 rounded-xl bg-white p-3 text-left text-xs shadow-flotante ring-1 ring-marfil-300 group-hover:block group-focus-visible:block`}
                  >
                    <span className="block font-bold">Semana del {etiquetaSemana(s.lunes)}</span>
                    <span className="mt-1 block text-tinta-suave">
                      {s.tipo === 'antes' ? 'Antes de Optimeal' : s.enCurso ? 'Con Optimeal · en curso' : 'Con Optimeal'}
                    </span>
                    <span className="mt-1.5 flex justify-between">
                      <span className="text-tinta-suave">Por día</span>
                      <strong className="tabular-nums">{s.kgDia == null ? '—' : kilos(s.kgDia)}</strong>
                    </span>
                    {s.faltantes > 0 && <span className="mt-1 block text-miel-800">⚠️ Faltan {s.faltantes} registros</span>}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Eje X */}
      <div className="ml-9 flex">
        {visibles.map((s, i) => (
          <div key={s.lunes} className="flex min-w-0 flex-1 flex-col items-center pt-1.5">
            {/* En celular, con muchas semanas, mostramos una etiqueta sí y otra no */}
            <span
              className={`text-[10px] whitespace-nowrap text-tinta-suave tabular-nums sm:text-xs ${
                i % 2 && visibles.length > 8 ? 'opacity-0 sm:opacity-100' : ''
              }`}
            >
              {etiquetaEje(s.lunes)}
            </span>
            <span className={`mt-0.5 size-1.5 rounded-full ${s.faltantes > 0 ? 'bg-miel-400' : 'bg-transparent'}`} aria-hidden="true" />
          </div>
        ))}
      </div>

      <details className="mt-3">
        <summary className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-verde-700 hover:bg-verde-50">
          <Table2 className="size-4" aria-hidden="true" /> Ver datos en tabla
        </summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Kilos desperdiciados por día, por semana</caption>
            <thead>
              <tr className="border-b border-marfil-300 text-left text-xs text-tinta-suave uppercase">
                <th className="py-2 pr-3 font-semibold">Semana del</th>
                <th className="px-3 py-2 font-semibold">Periodo</th>
                <th className="px-3 py-2 text-right font-semibold">Kg por día</th>
                <th className="py-2 pl-3 text-right font-semibold">Registros faltantes</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {visibles.map((s) => (
                <tr key={s.lunes} className="border-b border-marfil-200">
                  <td className="py-2 pr-3">{etiquetaSemana(s.lunes)}</td>
                  <td className="px-3 py-2">{s.tipo === 'antes' ? 'Antes de Optimeal' : s.enCurso ? 'Con Optimeal (en curso)' : 'Con Optimeal'}</td>
                  <td className="px-3 py-2 text-right">{s.kgDia == null ? 'Sin datos' : kilos(s.kgDia)}</td>
                  <td className="py-2 pl-3 text-right">{s.faltantes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  )
}
