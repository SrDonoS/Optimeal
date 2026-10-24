// 📋 Lista de preparación (Casino)
// Raciones recomendadas por menú + ingredientes y cantidades según la ficha técnica.
// Si falta la receta o el gramaje → "Cantidad por definir" (no inventamos números).

import { ChartColumn, FileWarning, Printer, TriangleAlert } from 'lucide-react'
import EncabezadoCasino from '../../components/casino/EncabezadoCasino'
import EtiquetaDato from '../../components/casino/EtiquetaDato'
import MiniMenu from '../../components/estudiantes/MiniMenu'
import Boton from '../../components/ui/Boton'
import Insignia from '../../components/ui/Insignia'
import Tarjeta from '../../components/ui/Tarjeta'
import { HORA_CIERRE_TEXTO } from '../../data/config'
import { recetaDe } from '../../data/recetas'
import { useCasino } from '../../hooks/useCasino'
import { capitalizar, fechaLarga } from '../../utils/fechas'

const n = (v) => v.toLocaleString('es-CL')
const decimal = (v) => v.toLocaleString('es-CL', { maximumFractionDigits: 1 })

// 150 g · 31,4 kg · 80 ml · 2,5 L · 412 unid.
function cantidad(valor, unidad) {
  if (unidad === 'g') return valor >= 1000 ? `${decimal(valor / 1000)} kg` : `${n(Math.round(valor))} g`
  if (unidad === 'ml') return valor >= 1000 ? `${decimal(valor / 1000)} L` : `${n(Math.round(valor))} ml`
  return `${n(Math.round(valor))} unid.`
}

const GRUPOS = [
  { id: 'plato', nombre: 'Plato principal' },
  { id: 'acomp', nombre: 'Acompañamientos' },
  { id: 'postre', nombre: 'Postre' },
]

export default function ListaPreparacion() {
  const { est, fecha, cambiarFecha, ahora, demanda, prediccion } = useCasino()

  // Raciones a preparar por menú: la estimación si existe; si no, solo lo confirmado
  const menus = prediccion.menus.map((p) => {
    const receta = recetaDe(p.menu)
    const raciones = p.suficiente ? p.recomendadas : p.confirmadas
    const porDefinir = receta ? receta.filter((ing) => ing.porRacion == null).length : p.menu.ingredientes.length
    return { ...p, receta, raciones, porDefinir }
  })
  const totalRaciones = menus.reduce((s, m) => s + m.raciones, 0)
  const totalPorDefinir = menus.reduce((s, m) => s + m.porDefinir, 0)

  return (
    <div className="animate-aparecer space-y-6">
      {/* Encabezado solo para la versión impresa */}
      <div className="hidden print:block">
        <p className="text-sm">Optimeal · Lista de preparación</p>
        <h1 className="text-2xl font-bold">
          {est.casino} · {est.nombre}
        </h1>
        <p>
          {capitalizar(fechaLarga(fecha))} · {n(totalRaciones)} raciones · {demanda.abierta ? 'PRELIMINAR (reservas abiertas)' : 'Reservas cerradas'}
        </p>
      </div>

      <div data-no-imprimir>
        <EncabezadoCasino
          titulo="Lista de preparación"
          descripcion="Raciones e ingredientes necesarios para el día, según la predicción y las fichas técnicas."
          est={est}
          fecha={fecha}
          onCambiarFecha={cambiarFecha}
          ahora={ahora}
          abierta={demanda.abierta}
          acciones={
            <>
              <Boton to={`/casino/demanda?fecha=${fecha}`} variante="secundario" icono={ChartColumn}>
                Consultar demanda
              </Boton>
              <Boton icono={Printer} onClick={() => window.print()}>
                Imprimir lista
              </Boton>
            </>
          }
        />
      </div>

      {demanda.abierta && (
        <p className="flex items-start gap-2 rounded-2xl border border-miel-100 bg-miel-50 p-4 text-sm text-miel-800">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>
            <strong>Lista preliminar:</strong> las reservas de este día siguen abiertas hasta las {HORA_CIERRE_TEXTO}. Las
            cantidades pueden cambiar; imprímela después del cierre.
          </span>
        </p>
      )}

      {/* Resumen */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Resumen etiqueta="Raciones a preparar" valor={n(totalRaciones)} />
        <Resumen etiqueta="Menús del día" valor={menus.length} />
        <Resumen
          etiqueta="Cantidades por definir"
          valor={totalPorDefinir}
          alerta={totalPorDefinir > 0}
          nota={totalPorDefinir > 0 ? 'Faltan datos en algunas fichas técnicas' : 'Todas las fichas están completas'}
        />
      </div>

      {/* Un bloque por menú */}
      {menus.map((m) => (
        <Tarjeta key={m.menu.id} className="break-inside-avoid p-5 sm:p-6 print:shadow-none">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <MiniMenu menu={m.menu} />
            <div className="text-right">
              <p className="text-xs font-semibold tracking-wider text-tinta-suave uppercase">Raciones a preparar</p>
              <p className="text-3xl font-semibold">{n(m.raciones)}</p>
              {m.suficiente ? (
                <EtiquetaDato tipo="estimacion" texto="Estimación (predicción)" />
              ) : (
                <EtiquetaDato tipo="insuficiente" texto="Solo reservas confirmadas" />
              )}
            </div>
          </div>

          {m.receta ? (
            <TablaIngredientes receta={m.receta} raciones={m.raciones} />
          ) : (
            <>
              <p className="mt-5 flex items-start gap-2 rounded-xl bg-miel-50 px-3 py-2.5 text-sm text-miel-800 ring-1 ring-miel-100">
                <FileWarning className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>
                  <strong>Ficha técnica pendiente.</strong> Este plato es nuevo y aún no tiene gramajes por ración, así que
                  no calculamos cantidades.
                </span>
              </p>
              <TablaIngredientes
                receta={m.menu.ingredientes.map((nombre) => ({ nombre, porRacion: null, grupo: 'plato' }))}
                raciones={m.raciones}
              />
            </>
          )}
        </Tarjeta>
      ))}

      <p className="text-xs text-tinta-suave">
        Fichas técnicas y cantidades ficticias para el prototipo. Las cantidades se calculan como raciones × gramaje por
        ración.
      </p>
    </div>
  )
}

function TablaIngredientes({ receta, raciones }) {
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full min-w-[30rem] text-sm">
        <thead>
          <tr className="border-b border-marfil-300 text-left text-xs text-tinta-suave uppercase">
            <th className="w-8 py-2 font-semibold">
              <span className="sr-only">Listo</span>
            </th>
            <th className="py-2 pr-3 font-semibold">Ingrediente</th>
            <th className="w-32 px-3 py-2 text-right font-semibold">Por ración</th>
            <th className="w-32 py-2 pl-3 text-right font-semibold">Total</th>
          </tr>
        </thead>
        {GRUPOS.map((g) => {
          const items = receta.filter((ing) => ing.grupo === g.id)
          if (!items.length) return null
          return (
            <tbody key={g.id}>
              <tr>
                <th colSpan={4} scope="colgroup" className="pt-4 pb-1 text-left text-xs font-bold text-verde-700">
                  {g.nombre}
                </th>
              </tr>
              {items.map((ing) => (
                <tr key={ing.nombre} className="border-b border-marfil-200">
                  <td className="py-2">
                    <input
                      type="checkbox"
                      className="size-4 cursor-pointer rounded accent-verde-600"
                      aria-label={`Marcar ${ing.nombre} como listo`}
                    />
                  </td>
                  <td className="py-2 pr-3 font-medium">{ing.nombre}</td>
                  {ing.porRacion == null ? (
                    <td colSpan={2} className="py-2 pl-3 text-right">
                      <Insignia tono="miel">Cantidad por definir</Insignia>
                    </td>
                  ) : (
                    <>
                      <td className="px-3 py-2 text-right text-tinta-suave tabular-nums">{cantidad(ing.porRacion, ing.unidad)}</td>
                      <td className="py-2 pl-3 text-right font-bold tabular-nums">{cantidad(ing.porRacion * raciones, ing.unidad)}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          )
        })}
      </table>
    </div>
  )
}

function Resumen({ etiqueta, valor, nota, alerta = false }) {
  return (
    <div
      className={`rounded-3xl border p-5 shadow-suave print:shadow-none ${
        alerta ? 'border-miel-100 bg-miel-50 text-miel-800' : 'border-marfil-300/80 bg-marfil-50'
      }`}
    >
      <p className={`text-sm font-semibold ${alerta ? '' : 'text-tinta-suave'}`}>{etiqueta}</p>
      <p className="mt-2 text-3xl font-semibold">{valor}</p>
      {nota && <p className={`mt-1 text-sm ${alerta ? '' : 'text-tinta-suave'}`}>{nota}</p>}
    </div>
  )
}
