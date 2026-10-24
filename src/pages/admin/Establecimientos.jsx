// 🏫 Gestión de establecimientos (Administración)
// Lista de colegios y casinos, cada uno con SUS propios datos, y el selector
// del establecimiento activo (el que ven los paneles de Casino y Administración).

import { CircleCheck, MapPin, PiggyBank, School, Users, UtensilsCrossed } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import EtiquetaDato from '../../components/casino/EtiquetaDato'
import Boton from '../../components/ui/Boton'
import Encabezado from '../../components/ui/Encabezado'
import Insignia from '../../components/ui/Insignia'
import { useAvisos } from '../../context/AvisosContext'
import { useRegistros } from '../../context/RegistrosContext'
import { useSesion } from '../../context/SesionContext'
import { indicadores, resumenSemanas } from '../../data/desperdicio'
import { CONCESIONARIA, ESTABLECIMIENTOS } from '../../data/establecimientos'
import { kilos, numero, pesosCorto, porcentaje } from '../../utils/formato'
import { SEMANAS_MINIMAS } from '../../utils/prediccion'

export default function Establecimientos() {
  const { establecimientoActivoId, setEstablecimientoActivoId } = useSesion()
  const { registros } = useRegistros()
  const { avisar } = useAvisos()
  const navigate = useNavigate()

  // Indicadores calculados por separado para cada colegio
  const filas = useMemo(() => {
    const ahora = new Date()
    return ESTABLECIMIENTOS.map((est) => {
      const kpi = indicadores(est, resumenSemanas(est, ahora, registros))
      return { est, kpi, suficiente: est.semanasEnPiloto >= SEMANAS_MINIMAS }
    })
  }, [registros])

  const activar = (est, irA) => {
    setEstablecimientoActivoId(est.id)
    avisar(`Ahora estás viendo ${est.nombre}`)
    if (irA) navigate(irA)
  }

  return (
    <div className="animate-aparecer space-y-6">
      <Encabezado
        titulo="Establecimientos"
        descripcion={`Colegios y casinos atendidos por ${CONCESIONARIA.nombre}. Cada uno tiene sus propios datos: elige cuál ver en los paneles.`}
      />

      <div className="grid gap-5 md:grid-cols-2">
        {filas.map(({ est, kpi, suficiente }) => {
          const activo = est.id === establecimientoActivoId
          return (
            <article
              key={est.id}
              className={`flex flex-col rounded-3xl border bg-marfil-50 p-5 shadow-suave sm:p-6 ${
                activo ? 'border-verde-400 ring-2 ring-verde-300' : 'border-marfil-300/80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-laguna-100 text-laguna-800">
                    <School className="size-6" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold">{est.nombre}</h2>
                    <p className="flex items-center gap-1 text-sm text-tinta-suave">
                      <MapPin className="size-3.5" aria-hidden="true" /> {est.comuna}, {est.region}
                    </p>
                    <p className="flex items-center gap-1 text-sm text-tinta-suave">
                      <UtensilsCrossed className="size-3.5" aria-hidden="true" /> {est.casino}
                    </p>
                  </div>
                </div>
                {activo && (
                  <Insignia tono="verde" icono={CircleCheck}>
                    Activo
                  </Insignia>
                )}
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Dato icono={Users} etiqueta="Matrícula" valor={numero(est.matricula)} />
                <Dato etiqueta="Raciones/día" valor={numero(est.racionesDiariasPromedio)} />
                <Dato etiqueta="En el piloto" valor={`${est.semanasEnPiloto} sem.`} />
                <Dato etiqueta="Ahorro" valor={pesosCorto(kpi.ahorroPesos)} />
              </dl>

              <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-marfil-300">
                {suficiente ? (
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm text-tinta-suave">Desperdicio</p>
                    <p className="text-sm">
                      <strong className="text-lg text-verde-800">−{porcentaje(kpi.reduccion)}</strong>{' '}
                      <span className="text-tinta-suave">
                        ({kilos(kpi.base.kgDia)} → {kilos(kpi.kgDiaActual)} por día)
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-tinta-suave">Desperdicio</p>
                    <EtiquetaDato tipo="insuficiente" texto="Historial insuficiente" />
                  </div>
                )}
                {kpi.faltantes > 0 && (
                  <p className="mt-2 text-xs font-semibold text-miel-800">⚠️ {kpi.faltantes} registros de desperdicio pendientes</p>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {activo ? (
                  <Boton tamano="sm" variante="suave" icono={CircleCheck} disabled>
                    Establecimiento activo
                  </Boton>
                ) : (
                  <Boton tamano="sm" onClick={() => activar(est)}>
                    Usar como activo
                  </Boton>
                )}
                <Boton tamano="sm" variante="secundario" icono={PiggyBank} onClick={() => activar(est, '/admin/ahorro')}>
                  Ver ahorro
                </Boton>
              </div>
            </article>
          )
        })}
      </div>

      {/* Comparación rápida */}
      <section className="rounded-3xl border border-marfil-300/80 bg-marfil-50 p-5 shadow-suave sm:p-6">
        <h2 className="text-lg font-bold">Comparación del piloto</h2>
        <p className="text-sm text-tinta-suave">Cada fila usa solo los datos de su propio establecimiento. Cifras ficticias.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[36rem] text-sm">
            <thead>
              <tr className="border-b border-marfil-300 text-left text-xs text-tinta-suave uppercase">
                <th className="py-2 pr-3 font-semibold">Establecimiento</th>
                <th className="px-3 py-2 text-right font-semibold">Reducción</th>
                <th className="px-3 py-2 text-right font-semibold">Kg/día ahora</th>
                <th className="px-3 py-2 text-right font-semibold">Ahorro</th>
                <th className="py-2 pl-3 text-right font-semibold">Registros pendientes</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {filas.map(({ est, kpi, suficiente }) => (
                <tr key={est.id} className="border-b border-marfil-200">
                  <td className="py-2.5 pr-3 font-semibold">{est.nombre}</td>
                  <td className="px-3 py-2.5 text-right">{suficiente ? `−${porcentaje(kpi.reduccion)}` : <Insignia tono="miel">Datos insuficientes</Insignia>}</td>
                  <td className="px-3 py-2.5 text-right">{kpi.kgDiaActual != null ? kilos(kpi.kgDiaActual) : '—'}</td>
                  <td className="px-3 py-2.5 text-right">{pesosCorto(kpi.ahorroPesos)}</td>
                  <td className="py-2.5 pl-3 text-right">{kpi.faltantes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function Dato({ icono: Icono, etiqueta, valor }) {
  return (
    <div className="rounded-xl bg-marfil-200/60 px-3 py-2">
      <dt className="flex items-center gap-1 text-xs font-semibold text-tinta-suave">
        {Icono && <Icono className="size-3" aria-hidden="true" />}
        {etiqueta}
      </dt>
      <dd className="mt-0.5 font-bold">{valor}</dd>
    </div>
  )
}
