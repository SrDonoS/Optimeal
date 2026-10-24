// 🔮 Predicción de raciones (Casino)
// Reservas confirmadas + historial → raciones estimadas, con sus factores.
// La estimación siempre se distingue del dato confirmado, y si faltan datos
// se muestra "Datos insuficientes" en vez de inventar un número.

import { CircleCheck, Equal, History, Minus, Plus, Ruler, Sparkles, TriangleAlert } from 'lucide-react'
import EncabezadoCasino from '../../components/casino/EncabezadoCasino'
import EtiquetaDato from '../../components/casino/EtiquetaDato'
import MiniMenu from '../../components/estudiantes/MiniMenu'
import Boton from '../../components/ui/Boton'
import Tarjeta from '../../components/ui/Tarjeta'
import { useCasino } from '../../hooks/useCasino'
import { fechaCorta } from '../../utils/fechas'
import { SEMANAS_MINIMAS } from '../../utils/prediccion'

const n = (v) => Math.abs(v).toLocaleString('es-CL')
const conSigno = (v) => (v > 0 ? `+${n(v)}` : v < 0 ? `−${n(v)}` : '0')

export default function Prediccion() {
  const { est, fecha, cambiarFecha, ahora, demanda, prediccion } = useCasino()
  const historialSuficiente = est.semanasEnPiloto >= SEMANAS_MINIMAS

  return (
    <div className="animate-aparecer space-y-6">
      <EncabezadoCasino
        titulo="Predicción de raciones"
        descripcion="Cuántas raciones cocinar, combinando las reservas confirmadas con el historial del casino."
        est={est}
        fecha={fecha}
        onCambiarFecha={cambiarFecha}
        ahora={ahora}
        abierta={demanda.abierta}
        acciones={
          <Boton to={`/casino/preparacion?fecha=${fecha}`} variante="secundario">
            Ver lista de preparación
          </Boton>
        }
      />

      {/* Resumen */}
      <div className="grid gap-4 md:grid-cols-3">
        <Tarjeta className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-tinta-suave">Reservas confirmadas</p>
            <EtiquetaDato tipo="confirmado" />
          </div>
          <p className="mt-3 text-4xl font-semibold text-verde-900">{n(prediccion.totalConfirmadas)}</p>
          <p className="mt-1 text-sm text-tinta-suave">{demanda.abierta ? 'hasta ahora (el plazo sigue abierto)' : 'lista definitiva'}</p>
        </Tarjeta>
        <Tarjeta className="border-dashed p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-tinta-suave">Raciones recomendadas</p>
            <EtiquetaDato tipo={prediccion.todosSuficientes ? 'estimacion' : 'insuficiente'} />
          </div>
          <p className="mt-3 text-4xl font-semibold text-laguna-800">{n(prediccion.totalRecomendadas)}</p>
          <p className="mt-1 text-sm text-tinta-suave">
            {prediccion.todosSuficientes
              ? `vs. ${n(est.racionesFijasAntes)} fijas antes de Optimeal`
              : 'algunos menús usan solo reservas confirmadas'}
          </p>
        </Tarjeta>
        <Tarjeta className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-tinta-suave">Historial disponible</p>
            {historialSuficiente ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-marfil-200 px-2.5 py-0.5 text-xs font-semibold text-tinta-suave">
                <History className="size-3.5" aria-hidden="true" /> Confianza {est.semanasEnPiloto >= 6 ? 'alta' : 'media'}
              </span>
            ) : (
              <EtiquetaDato tipo="insuficiente" />
            )}
          </div>
          <p className="mt-3 text-4xl font-semibold text-tinta">
            {est.semanasEnPiloto} <span className="text-xl">{est.semanasEnPiloto === 1 ? 'semana' : 'semanas'}</span>
          </p>
          <p className="mt-1 text-sm text-tinta-suave">mínimo para estimar: {SEMANAS_MINIMAS} semanas</p>
        </Tarjeta>
      </div>

      {/* Fórmula */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white p-4 text-sm ring-1 ring-marfil-300">
        <span className="mr-1 font-bold">Cómo se calcula:</span>
        <Pieza tipo="confirmado">Reservas confirmadas</Pieza>
        <Plus className="size-4 text-tinta-suave" aria-label="más" />
        <Pieza tipo="estimado">Reservas por llegar</Pieza>
        <Minus className="size-4 text-tinta-suave" aria-label="menos" />
        <Pieza tipo="estimado">No retiran (historial)</Pieza>
        <Plus className="size-4 text-tinta-suave" aria-label="más" />
        <Pieza tipo="regla">Margen de seguridad</Pieza>
        <Equal className="size-4 text-tinta-suave" aria-label="igual a" />
        <Pieza tipo="estimado" fuerte>
          Raciones recomendadas
        </Pieza>
      </div>

      {/* Un bloque por menú */}
      <div className="space-y-5">
        {prediccion.menus.map((p) => (
          <TarjetaPrediccion key={p.menu.id} p={p} />
        ))}
      </div>

      <details className="rounded-2xl bg-marfil-200/60 p-4 text-sm text-tinta-suave">
        <summary className="cursor-pointer font-semibold text-tinta">¿Por qué no es simplemente “cocinar lo reservado”?</summary>
        <p className="mt-2">
          Después del cierre, las reservas son la base exacta. Pero el historial muestra que algunos estudiantes reservan y
          no retiran (por ejemplo, porque faltaron a clases). Restamos esa cantidad y sumamos un pequeño margen de
          seguridad. Antes del cierre, además, estimamos cuántas reservas faltan por llegar según el ritmo habitual de
          los días anteriores. Si no hay suficientes semanas de historial, no estimamos: usamos solo lo confirmado.
        </p>
      </details>
    </div>
  )
}

function Pieza({ tipo, fuerte, children }) {
  const clases = {
    confirmado: 'bg-verde-50 text-verde-900 ring-1 ring-verde-200',
    estimado: 'bg-laguna-50 text-laguna-800 border border-dashed border-laguna-600/60',
    regla: 'bg-marfil-200 text-tinta',
  }[tipo]
  return <span className={`rounded-lg px-2.5 py-1 ${fuerte ? 'font-bold' : 'font-medium'} ${clases}`}>{children}</span>
}

const ICONO_FACTOR = { confirmado: CircleCheck, estimado: Sparkles, regla: Ruler }
const COLOR_FACTOR = { confirmado: 'text-verde-600', estimado: 'text-laguna-600', regla: 'text-tinta-suave' }

function TarjetaPrediccion({ p }) {
  if (!p.suficiente) return <TarjetaInsuficiente p={p} />

  const maximo = Math.max(p.confirmadas, p.recomendadas)
  const ultimas = p.historial.slice(0, 4)

  return (
    <Tarjeta className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <MiniMenu menu={p.menu} />
        <EtiquetaDato tipo="estimacion" />
      </div>

      {/* Comparación visual: confirmado (sólido) vs estimado (punteado) */}
      <div className="mt-5 space-y-2.5" aria-hidden="true">
        <Barra etiqueta="Confirmadas" valor={p.confirmadas} maximo={maximo} />
        <Barra etiqueta="Recomendadas" valor={p.recomendadas} maximo={maximo} estimada />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        {/* Factores explicativos */}
        <div>
          <h3 className="text-sm font-bold">Factores de la estimación</h3>
          <ul className="mt-2 divide-y divide-marfil-200">
            {p.factores.map((f) => {
              const Icono = ICONO_FACTOR[f.tipo]
              return (
                <li key={f.etiqueta} className="flex items-start gap-3 py-2.5">
                  <Icono className={`mt-0.5 size-4 shrink-0 ${COLOR_FACTOR[f.tipo]}`} aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{f.etiqueta}</p>
                    <p className="text-xs text-tinta-suave">{f.detalle}</p>
                  </div>
                  <span className="text-sm font-bold tabular-nums">
                    {f.tipo === 'confirmado' ? n(f.valor) : conSigno(f.valor)}
                  </span>
                </li>
              )
            })}
            <li className="flex items-center gap-3 py-3">
              <Equal className="size-4 shrink-0 text-laguna-600" aria-hidden="true" />
              <p className="flex-1 font-bold">Raciones recomendadas</p>
              <span className="rounded-lg border border-dashed border-laguna-600/60 bg-laguna-50 px-2.5 py-0.5 text-lg font-bold text-laguna-800 tabular-nums">
                {n(p.recomendadas)}
              </span>
            </li>
          </ul>
        </div>

        {/* Datos históricos */}
        <div>
          <h3 className="flex flex-wrap items-center gap-2 text-sm font-bold">
            Datos históricos disponibles
            <span className="font-normal text-tinta-suave">
              · {p.historial.length} semanas · confianza {p.confianza.toLowerCase()}
            </span>
          </h3>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Últimas veces que se sirvió {p.menu.nombre}</caption>
              <thead>
                <tr className="border-b border-marfil-300 text-left text-xs text-tinta-suave">
                  <th className="py-2 pr-2 font-semibold">Fecha</th>
                  <th className="px-2 py-2 text-right font-semibold">Reservas</th>
                  <th className="px-2 py-2 text-right font-semibold">Servidas</th>
                  <th className="py-2 pl-2 text-right font-semibold">No retiró</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {ultimas.map((h) => (
                  <tr key={h.fecha} className="border-b border-marfil-200">
                    <td className="py-2 pr-2">{fechaCorta(h.fecha)}</td>
                    <td className="px-2 py-2 text-right">{n(h.reservas)}</td>
                    <td className="px-2 py-2 text-right">{n(h.servidas)}</td>
                    <td className="py-2 pl-2 text-right text-tinta-suave">
                      {n(h.noRetiro)} ({Math.round((h.noRetiro / h.reservas) * 100)} %)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-tinta-suave">
            Sobrante promedio en estas semanas: <strong className="text-tinta">{p.sobrantePromedio.toFixed(1).replace('.', ',')} raciones</strong> por día.
          </p>
        </div>
      </div>
    </Tarjeta>
  )
}

function Barra({ etiqueta, valor, maximo, estimada = false }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-xs font-semibold text-tinta-suave">{etiqueta}</span>
      <div className="h-4 flex-1">
        <div
          className={`h-4 rounded-r-[4px] ${estimada ? 'border-[1.5px] border-dashed border-laguna-600 bg-laguna-50' : 'bg-verde-600'}`}
          style={{ width: `${(valor / maximo) * 100}%` }}
        />
      </div>
      <span className="w-12 shrink-0 text-right text-sm font-bold tabular-nums">{n(valor)}</span>
    </div>
  )
}

function TarjetaInsuficiente({ p }) {
  const avance = Math.min(p.historial.length / SEMANAS_MINIMAS, 1)
  return (
    <Tarjeta className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <MiniMenu menu={p.menu} />
        <EtiquetaDato tipo="insuficiente" />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        <div className="flex gap-3 rounded-2xl border border-miel-100 bg-miel-50 p-4 text-sm text-miel-800">
          <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-bold">No hay datos suficientes para estimar</p>
            <p className="mt-1">{p.motivo}</p>
            <p className="mt-2">
              Mientras tanto, prepara según las <strong>{n(p.confirmadas)} reservas confirmadas</strong>
              {p.abierta ? ' (hasta ahora: el plazo sigue abierto)' : ''} y registra los sobrantes reales. Así el
              sistema aprende para las próximas semanas. 🌱
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4 ring-1 ring-marfil-300">
          <p className="text-sm font-bold">Historial de este menú</p>
          <p className="mt-1 text-sm text-tinta-suave">
            {p.historial.length} de {SEMANAS_MINIMAS} semanas necesarias
          </p>
          <div
            className="mt-3 h-2.5 rounded-full bg-miel-100"
            role="meter"
            aria-valuemin={0}
            aria-valuemax={SEMANAS_MINIMAS}
            aria-valuenow={p.historial.length}
            aria-label="Semanas de historial disponibles"
          >
            <div className="h-2.5 rounded-full bg-miel-400" style={{ width: `${avance * 100}%` }} />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-sm text-tinta-suave">Reservas confirmadas</span>
            <span className="flex items-center gap-2">
              <span className="text-2xl font-semibold">{n(p.confirmadas)}</span>
              <EtiquetaDato tipo="confirmado" texto="Confirmado" />
            </span>
          </div>
          <p className="mt-1 text-right text-sm text-tinta-suave">Estimación: —</p>
        </div>
      </div>
    </Tarjeta>
  )
}
