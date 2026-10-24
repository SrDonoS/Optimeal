// 📊 Panel de demanda diaria (Casino)
// Establecimiento, fecha, total de reservas y reservas por menú,
// gráfico de la semana y accesos a predicción, preparación y desperdicio.

import { ArrowRight, ClipboardList, NotebookPen, TrendingUp, XCircle } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import EncabezadoCasino from '../../components/casino/EncabezadoCasino'
import EtiquetaDato from '../../components/casino/EtiquetaDato'
import GraficoDemandaSemanal from '../../components/casino/GraficoDemandaSemanal'
import MiniMenu from '../../components/estudiantes/MiniMenu'
import Insignia from '../../components/ui/Insignia'
import Tarjeta from '../../components/ui/Tarjeta'
import { demandaDelDia } from '../../data/demanda'
import { TIPOS_MENU } from '../../data/menus'
import { useCasino } from '../../hooks/useCasino'
import { aISO, desdeISO, diaHabil, diasHabilesDeSemana, lunesDe } from '../../utils/fechas'
import { predecirDia } from '../../utils/prediccion'

const n = (v) => v.toLocaleString('es-CL')
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0)

export default function DemandaDiaria() {
  const { est, fecha, cambiarFecha, ahora, demanda, prediccion, reservas } = useCasino()
  const minuto = Math.floor(ahora.getTime() / 60_000)

  // Datos de toda la semana para el gráfico
  const semana = useMemo(() => {
    const momento = new Date(minuto * 60_000)
    return diasHabilesDeSemana(lunesDe(desdeISO(fecha))).map((f) => {
      const d = demandaDelDia(est, f, momento, reservas)
      const p = predecirDia(est, d)
      const porTipo = Object.fromEntries(d.menus.map((m) => [m.menu.tipo, m.confirmadas]))
      // Estimado al cierre = confirmadas + las que aún pueden llegar (solo si hay datos suficientes)
      const estimadoCierre =
        d.abierta && p.todosSuficientes ? p.menus.reduce((s, m) => s + m.confirmadas + m.porLlegar, 0) : null
      return { fecha: f, abierta: d.abierta, porTipo, total: d.total, estimadoCierre }
    })
  }, [est, fecha, minuto, reservas])

  const q = `?fecha=${fecha}`
  const ahorro = est.racionesFijasAntes - prediccion.totalRecomendadas
  // Solo comparamos si el número es definitivo o si pudimos estimarlo
  const comparable = !demanda.abierta || prediccion.todosSuficientes

  return (
    <div className="animate-aparecer space-y-6">
      <EncabezadoCasino
        titulo="Demanda diaria"
        descripcion="Reservas confirmadas por los estudiantes, por día y por menú."
        est={est}
        fecha={fecha}
        onCambiarFecha={cambiarFecha}
        ahora={ahora}
        abierta={demanda.abierta}
      />

      {/* Indicadores del día */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Indicador etiqueta="Reservas confirmadas" etiquetaDato={<EtiquetaDato tipo="confirmado" />}>
          <p className="text-4xl font-semibold text-verde-900">{n(demanda.total)}</p>
          <p className="mt-1 text-sm text-tinta-suave">
            {pct(demanda.total, est.matricula)} % de los {n(est.matricula)} estudiantes
          </p>
        </Indicador>

        <Indicador
          etiqueta="Raciones recomendadas"
          etiquetaDato={<EtiquetaDato tipo={prediccion.todosSuficientes ? 'estimacion' : 'insuficiente'} />}
        >
          <p className="text-4xl font-semibold text-laguna-800">{n(prediccion.totalRecomendadas)}</p>
          {!prediccion.todosSuficientes && (
            <p className="mt-1 text-sm text-tinta-suave">Hay menús sin historial: para ellos se usan solo las reservas.</p>
          )}
          <Link to={`/casino/prediccion${q}`} className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-verde-700 hover:underline">
            Ver cómo se calcula <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </Indicador>

        <Indicador etiqueta="Antes de Optimeal" etiquetaDato={<Insignia tono="neutro">Referencia</Insignia>}>
          <p className="text-4xl font-semibold text-tinta">{n(est.racionesFijasAntes)}</p>
          <p className="mt-1 text-sm text-tinta-suave">
            raciones fijas al día ·{' '}
            {!comparable ? (
              'sin estimación aún'
            ) : ahorro > 0 ? (
              <strong className="text-verde-700">hoy {n(ahorro)} menos ({pct(ahorro, est.racionesFijasAntes)} %)</strong>
            ) : (
              'sin diferencia'
            )}
          </p>
        </Indicador>

        <Indicador etiqueta="Cancelaciones a tiempo" etiquetaDato={<EtiquetaDato tipo="confirmado" />}>
          <p className="text-4xl font-semibold text-tinta">{n(demanda.canceladas)}</p>
          <p className="mt-1 text-sm text-tinta-suave">raciones que no se cocinarán</p>
        </Indicador>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        {/* Gráfico semanal */}
        <Tarjeta className="min-w-0 p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold">Demanda de la semana</h2>
              <p className="text-sm text-tinta-suave">Reservas confirmadas por día y por menú. Toca un día para verlo.</p>
            </div>
            <EnVivo app={demanda.app} />
          </div>
          <GraficoDemandaSemanal
            semana={semana}
            fechaSeleccionada={fecha}
            onSeleccionar={cambiarFecha}
            referencia={est.racionesFijasAntes}
            hoy={aISO(diaHabil(ahora))}
          />
        </Tarjeta>

        {/* Reservas por menú del día */}
        <Tarjeta className="p-5 sm:p-6">
          <h2 className="text-lg font-bold">Reservas por menú</h2>
          <p className="text-sm text-tinta-suave">Del día seleccionado, ordenadas como en la carta.</p>
          <ul className="mt-5 space-y-5">
            {demanda.menus.map((m) => {
              const tipo = TIPOS_MENU[m.menu.tipo]
              const ancho = demanda.total ? (m.confirmadas / Math.max(...demanda.menus.map((x) => x.confirmadas))) * 100 : 0
              return (
                <li key={m.menu.id}>
                  <div className="flex items-start justify-between gap-3">
                    <MiniMenu menu={m.menu} tamano="sm" />
                    <div className="shrink-0 text-right">
                      <p className="text-xl font-semibold">{n(m.confirmadas)}</p>
                      <p className="text-xs text-tinta-suave">{pct(m.confirmadas, demanda.total)} %</p>
                    </div>
                  </div>
                  <div className="mt-2 h-3 rounded-[4px] bg-marfil-200" aria-hidden="true">
                    <div className="h-3 rounded-r-[4px]" style={{ width: `${ancho}%`, background: tipo.color }} />
                  </div>
                  {m.app > 0 && (
                    <p className="mt-1 text-xs text-tinta-suave">Incluye {m.app} reserva{m.app > 1 ? 's' : ''} hecha{m.app > 1 ? 's' : ''} desde la app 🔴</p>
                  )}
                </li>
              )
            })}
          </ul>
          {demanda.canceladas > 0 && (
            <p className="mt-5 flex items-center gap-2 border-t border-marfil-300 pt-4 text-sm text-tinta-suave">
              <XCircle className="size-4 shrink-0" aria-hidden="true" />
              {n(demanda.canceladas)} cancelaciones antes del cierre (ya descontadas).
            </p>
          )}
        </Tarjeta>
      </div>

      {/* Accesos rápidos */}
      <section aria-label="Accesos rápidos" className="grid gap-4 md:grid-cols-3">
        <Acceso
          to={`/casino/prediccion${q}`}
          icono={TrendingUp}
          titulo="Predicción de raciones"
          texto="Cuántas raciones cocinar y por qué."
        />
        <Acceso
          to={`/casino/preparacion${q}`}
          icono={ClipboardList}
          titulo="Lista de preparación"
          texto="Ingredientes y cantidades del día, lista para imprimir."
        />
        <Acceso
          to="/admin/desperdicio"
          icono={NotebookPen}
          titulo="Registro de desperdicio"
          texto="Anota los sobrantes reales al final del servicio."
          nota="Área administrativa"
        />
      </section>
    </div>
  )
}

function Indicador({ etiqueta, etiquetaDato, children }) {
  return (
    <Tarjeta className="flex flex-col p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-tinta-suave">{etiqueta}</p>
        {etiquetaDato}
      </div>
      {children}
    </Tarjeta>
  )
}

function EnVivo({ app }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold ring-1 ring-marfil-300">
      <span className="relative flex size-2" aria-hidden="true">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-verde-400 opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-verde-500" />
      </span>
      En vivo · {app} desde la app
    </span>
  )
}

function Acceso({ to, icono: Icono, titulo, texto, nota }) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-4 rounded-3xl border border-marfil-300/80 bg-marfil-50 p-5 shadow-suave transition-shadow hover:shadow-flotante"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-miel-100 text-miel-800">
        <Icono className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1 font-bold">
          {titulo}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
        <span className="mt-0.5 block text-sm text-tinta-suave">{texto}</span>
        {nota && <span className="mt-2 inline-block text-xs font-semibold text-tinta-suave">{nota}</span>}
      </span>
    </Link>
  )
}
