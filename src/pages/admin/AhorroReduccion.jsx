// 💚 Ahorro y reducción (Administración)
// Costos estimados vs. reales, diferencia, ahorro frente a "antes de Optimeal",
// kilos desperdiciados y su evolución, y la meta de reducción con su avance.
// Los ejemplos ficticios y los datos faltantes se marcan siempre.

import { CircleAlert, FileClock, FlaskConical, NotebookPen, Target, TrendingDown } from 'lucide-react'
import GraficoDesperdicio from '../../components/admin/GraficoDesperdicio'
import PildoraEstablecimiento from '../../components/admin/PildoraEstablecimiento'
import EtiquetaDato from '../../components/casino/EtiquetaDato'
import Boton from '../../components/ui/Boton'
import Encabezado from '../../components/ui/Encabezado'
import Insignia from '../../components/ui/Insignia'
import Tarjeta from '../../components/ui/Tarjeta'
import { OPCIONES_META } from '../../context/RegistrosContext'
import { useAdmin } from '../../hooks/useAdmin'
import { desdeISO, mesCorto } from '../../utils/fechas'
import { kilos, numero, pesos, pesosCorto, porcentaje } from '../../utils/formato'
import { SEMANAS_MINIMAS } from '../../utils/prediccion'

const semanaTexto = (iso) => `${desdeISO(iso).getDate()} ${mesCorto(iso)}`

export default function AhorroReduccion() {
  const { est, semanas, kpi, meta, cambiarMeta, metaMedible } = useAdmin()
  const metaKgDia = kpi.base.kgDia * (1 - meta)
  const diferencia = kpi.costoReal - kpi.costoEstimado
  const avance = metaMedible ? Math.max(0, Math.min(kpi.reduccion / meta, 1)) : 0
  const filas = semanas.filter((s) => s.tipo !== 'sin-piloto')

  return (
    <div className="animate-aparecer space-y-6">
      <Encabezado
        titulo="Ahorro y reducción"
        descripcion="Cuánto se gasta y cuánta comida se pierde, comparado con lo estimado y con lo que pasaba antes de Optimeal."
      >
        <PildoraEstablecimiento est={est} />
      </Encabezado>

      <p className="flex items-start gap-2 rounded-2xl border border-laguna-100 bg-laguna-50 px-4 py-3 text-sm text-laguna-800">
        <FlaskConical className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>
          <strong>Ejemplo ficticio:</strong> montos y kilos inventados para la demo (costo por ración: {pesos(est.costoRacion)}).
          Los <strong>datos faltantes</strong> se marcan en amarillo y no se cuentan en los totales.
        </span>
      </p>

      {/* Indicadores */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Indicador etiqueta="Costo estimado" etiquetaDato={<EtiquetaDato tipo="estimacion" />}>
          <Valor>{kpi.semanasConCostos ? pesosCorto(kpi.costoEstimado) : '—'}</Valor>
          <Nota>Según la predicción · {kpi.semanasConCostos} semanas con factura</Nota>
        </Indicador>
        <Indicador etiqueta="Costo real" etiquetaDato={<EtiquetaDato tipo="confirmado" />}>
          <Valor>{kpi.semanasConCostos ? pesosCorto(kpi.costoReal) : '—'}</Valor>
          {kpi.facturasPendientes > 0 ? (
            <Nota alerta>
              Faltan facturas de {kpi.facturasPendientes} {kpi.facturasPendientes === 1 ? 'semana' : 'semanas'}
            </Nota>
          ) : (
            <Nota>Facturas al día (la semana en curso se factura al cerrar)</Nota>
          )}
        </Indicador>
        <Indicador etiqueta="Diferencia (real − estimado)">
          <Valor color={diferencia > 0 ? 'text-miel-800' : 'text-verde-800'}>
            {kpi.semanasConCostos ? `${diferencia > 0 ? '+' : ''}${pesosCorto(diferencia)}` : '—'}
          </Valor>
          <Nota>
            {!kpi.semanasConCostos
              ? 'Sin semanas con factura todavía'
              : diferencia > 0
                ? `${porcentaje(diferencia / kpi.costoEstimado)} más de lo estimado (se preparó de más)`
                : 'Se gastó igual o menos de lo estimado'}
          </Nota>
        </Indicador>
        <Indicador etiqueta="Ahorro vs. antes de Optimeal" destacado>
          <Valor color="text-verde-800">{pesosCorto(kpi.ahorroPesos)}</Valor>
          <Nota>{numero(kpi.ahorroRaciones)} raciones menos cocinadas en el piloto</Nota>
        </Indicador>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        {/* Evolución de los kilos (min-w-0: que el gráfico no ensanche la página en celular) */}
        <Tarjeta className="min-w-0 p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold">Kilos desperdiciados por día</h2>
              <p className="text-sm text-tinta-suave">Promedio de cada semana, antes y durante el piloto.</p>
            </div>
            <Insignia tono="verde" icono={TrendingDown}>
              {kilos(kpi.kilos)} registrados en el piloto
            </Insignia>
          </div>
          <GraficoDesperdicio semanas={semanas} metaKgDia={metaMedible ? metaKgDia : null} />
        </Tarjeta>

        {/* Meta de reducción */}
        <Tarjeta className="flex flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Target className="size-5 text-verde-600" aria-hidden="true" /> Meta de reducción
              </h2>
              <p className="text-sm text-tinta-suave">Kilos desperdiciados vs. antes de Optimeal.</p>
            </div>
            <label className="sr-only" htmlFor="meta">
              Meta de reducción
            </label>
            <select
              id="meta"
              value={meta}
              onChange={(e) => cambiarMeta(est.id, Number(e.target.value))}
              className="h-9 cursor-pointer rounded-xl border border-marfil-300 bg-white px-2 text-sm font-semibold outline-none focus:border-verde-500 focus:ring-4 focus:ring-verde-100"
            >
              {OPCIONES_META.map((m) => (
                <option key={m} value={m}>
                  Reducir {porcentaje(m)}
                </option>
              ))}
            </select>
          </div>

          {metaMedible ? (
            <>
              <p className="mt-6 text-sm font-semibold text-tinta-suave">Reducción actual</p>
              <p className="text-5xl font-semibold text-verde-800">
                −{porcentaje(kpi.reduccion)}
              </p>
              <p className="mt-1 text-sm text-tinta-suave">
                {avance >= 1 ? '¡Meta cumplida! 🎉' : `${porcentaje(avance)} del camino hacia la meta de −${porcentaje(meta)}`}
              </p>

              <div
                className="mt-4 h-4 rounded-full bg-verde-100"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(avance * 100)}
                aria-label="Avance hacia la meta de reducción"
              >
                <div className="h-4 rounded-full bg-verde-600 transition-all duration-500" style={{ width: `${avance * 100}%` }} />
              </div>

              <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
                <Dato etiqueta="Antes" valor={kilos(kpi.base.kgDia)} />
                <Dato etiqueta="Ahora" valor={kilos(kpi.kgDiaActual)} resaltado />
                <Dato etiqueta="Meta" valor={kilos(metaKgDia)} />
              </dl>
              <p className="mt-3 text-center text-xs text-tinta-suave">kilos por día · “Ahora” = promedio de las 2 últimas semanas</p>
            </>
          ) : (
            <div className="mt-6 flex flex-1 flex-col justify-center rounded-2xl border border-miel-100 bg-miel-50 p-4 text-sm text-miel-800">
              <EtiquetaDato tipo="insuficiente" className="self-start" />
              <p className="mt-2">
                {est.nombre} lleva {est.semanasEnPiloto} {est.semanasEnPiloto === 1 ? 'semana' : 'semanas'} en el piloto. Para medir el
                avance hacia la meta se necesitan al menos {SEMANAS_MINIMAS} semanas de registros.
              </p>
            </div>
          )}
        </Tarjeta>
      </div>

      {/* Costos por semana */}
      <Tarjeta className="p-5 sm:p-6">
        <h2 className="text-lg font-bold">Costos por semana</h2>
        <p className="text-sm text-tinta-suave">Costo estimado (según la predicción) vs. costo real (según facturas).</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead>
              <tr className="border-b border-marfil-300 text-left text-xs text-tinta-suave uppercase">
                <th className="py-2 pr-3 font-semibold">Semana del</th>
                <th className="px-3 py-2 text-right font-semibold">Raciones preparadas</th>
                <th className="px-3 py-2 text-right font-semibold">Costo estimado</th>
                <th className="px-3 py-2 text-right font-semibold">Costo real</th>
                <th className="py-2 pl-3 text-right font-semibold">Diferencia</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {[...filas].reverse().map((s) => {
                const dif = s.costoReal != null && s.costoEstimado != null ? s.costoReal - s.costoEstimado : null
                return (
                  <tr key={s.lunes} className="border-b border-marfil-200">
                    <td className="py-2.5 pr-3 whitespace-nowrap">
                      {semanaTexto(s.lunes)}
                      {s.tipo === 'antes' && <Insignia tono="arcilla" className="ml-2">Antes de Optimeal</Insignia>}
                      {s.enCurso && <Insignia tono="neutro" className="ml-2">En curso</Insignia>}
                    </td>
                    <td className="px-3 py-2.5 text-right">{s.preparadas != null ? numero(s.preparadas) : '—'}</td>
                    <td className="px-3 py-2.5 text-right text-tinta-suave">
                      {s.costoEstimado != null ? pesos(s.costoEstimado) : <span className="text-xs">Sin predicción</span>}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      {s.costoReal != null ? pesos(s.costoReal) : <Insignia tono="miel">{s.enCurso ? 'Semana en curso' : 'Factura pendiente'}</Insignia>}
                    </td>
                    <td className={`py-2.5 pl-3 text-right font-semibold ${dif > 0 ? 'text-miel-800' : dif < 0 ? 'text-verde-700' : ''}`}>
                      {dif == null ? '—' : `${dif > 0 ? '+' : dif < 0 ? '−' : ''}${pesos(Math.abs(dif))}`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Tarjeta>

      {/* Datos faltantes */}
      <Tarjeta className="p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <CircleAlert className="size-5 text-miel-600" aria-hidden="true" /> Datos faltantes
        </h2>
        <ul className="mt-3 space-y-3 text-sm">
          <li className="flex flex-wrap items-center gap-3">
            <NotebookPen className="size-4 shrink-0 text-tinta-suave" aria-hidden="true" />
            <span className="flex-1">
              <strong>{kpi.faltantes}</strong> registros de desperdicio sin completar (días y menús sin kilos anotados).
            </span>
            <Boton to="/admin/desperdicio" tamano="sm" variante="secundario">
              Completar registros
            </Boton>
          </li>
          <li className="flex items-center gap-3">
            <FileClock className="size-4 shrink-0 text-tinta-suave" aria-hidden="true" />
            <span className="flex-1">
              <strong>{kpi.facturasPendientes}</strong> {kpi.facturasPendientes === 1 ? 'semana terminada' : 'semanas terminadas'} sin
              costo real (factura pendiente). La semana en curso se factura al cerrar.
            </span>
          </li>
        </ul>
      </Tarjeta>
    </div>
  )
}

function Indicador({ etiqueta, etiquetaDato, destacado = false, children }) {
  return (
    <div
      className={`flex flex-col rounded-3xl border p-5 shadow-suave ${
        destacado ? 'border-verde-200 bg-verde-50' : 'border-marfil-300/80 bg-marfil-50'
      }`}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-tinta-suave">{etiqueta}</p>
        {etiquetaDato}
      </div>
      {children}
    </div>
  )
}

const Valor = ({ color = 'text-tinta', children }) => <p className={`text-3xl font-semibold ${color}`}>{children}</p>
const Nota = ({ alerta = false, children }) => (
  <p className={`mt-1 text-sm ${alerta ? 'font-semibold text-miel-800' : 'text-tinta-suave'}`}>{children}</p>
)

function Dato({ etiqueta, valor, resaltado = false }) {
  return (
    <div className={`rounded-xl px-2 py-2 ${resaltado ? 'bg-verde-50 ring-1 ring-verde-200' : 'bg-marfil-200/60'}`}>
      <dt className="text-xs font-semibold text-tinta-suave">{etiqueta}</dt>
      <dd className="mt-0.5 text-sm font-bold">{valor}</dd>
    </div>
  )
}
