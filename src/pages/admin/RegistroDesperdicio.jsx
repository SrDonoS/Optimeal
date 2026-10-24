// 🗑️ Registro del desperdicio (Administración)
// Formulario: fecha, menú, raciones preparadas/servidas (opcionales), kilos
// sobrantes y observaciones. Compara lo ESTIMADO con lo OBSERVADO y, al
// guardar, muestra el dato ya incorporado al resumen de la semana.

import { CircleCheck, NotebookPen, PiggyBank, Plus, Save, Scale } from 'lucide-react'
import { useMemo, useState } from 'react'
import PildoraEstablecimiento from '../../components/admin/PildoraEstablecimiento'
import EtiquetaDato from '../../components/casino/EtiquetaDato'
import Boton from '../../components/ui/Boton'
import Campo from '../../components/ui/Campo'
import Encabezado from '../../components/ui/Encabezado'
import Insignia from '../../components/ui/Insignia'
import Tarjeta from '../../components/ui/Tarjeta'
import { useAvisos } from '../../context/AvisosContext'
import { useReservas } from '../../context/ReservasContext'
import { demandaDelDia } from '../../data/demanda'
import { KG_POR_RACION, KG_RESTOS_POR_SERVIDA, lineaBase, registrosDelDia } from '../../data/desperdicio'
import { TIPOS_MENU } from '../../data/menus'
import { useAdmin } from '../../hooks/useAdmin'
import { aISO, capitalizar, desdeISO, diasHabilesDeSemana, esFinDeSemana, fechaCorta, fechaRelativa, lunesDe, sumarDias } from '../../utils/fechas'
import { kilos as fKilos, leerDecimal, numero } from '../../utils/formato'
import { predecirDia } from '../../utils/prediccion'

const NOTAS_RAPIDAS = ['Lluvia: faltaron estudiantes', 'Actividad escolar', 'Plato poco aceptado', 'Se acabó antes de tiempo']

// Últimos días hábiles hasta hoy (para el selector de fecha)
function diasRecientes(ahora, cantidad = 10) {
  const dias = []
  let f = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
  while (dias.length < cantidad) {
    if (!esFinDeSemana(f)) dias.push(aISO(f))
    f = sumarDias(f, -1)
  }
  return dias
}

export default function RegistroDesperdicio() {
  const { est, ahora, registros, guardarRegistro, semanas } = useAdmin()
  const { reservas } = useReservas()
  const { avisar } = useAvisos()
  const hoyISO = aISO(ahora)
  const dias = useMemo(() => diasRecientes(desdeISO(hoyISO)), [hoyISO])
  const minuto = Math.floor(ahora.getTime() / 60_000)

  const [fecha, setFecha] = useState(dias[0])
  const [tipo, setTipo] = useState('tradicional')
  const [preparadas, setPreparadas] = useState('')
  const [servidas, setServidas] = useState('')
  const [kilosTexto, setKilosTexto] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [errores, setErrores] = useState({})
  const [ultimo, setUltimo] = useState(null) // último registro guardado

  // Estimación y reservas del día elegido (mismos números que ve el casino)
  const prediccion = useMemo(
    () => predecirDia(est, demandaDelDia(est, fecha, new Date(minuto * 60_000), reservas)),
    [est, fecha, minuto, reservas],
  )
  const pMenu = prediccion.menus.find((m) => m.menu.tipo === tipo)
  const menu = pMenu.menu
  const existente = registrosDelDia(est, fecha, registros, hoyISO).find((x) => x.menu.id === menu.id)?.registro

  const prep = preparadas === '' ? null : Number(preparadas)
  const serv = servidas === '' ? null : Number(servidas)
  const kg = kilosTexto === '' ? null : leerDecimal(kilosTexto)

  const validar = () => {
    const e = {}
    const entero = (v) => Number.isInteger(v) && v >= 0 && v <= 5000
    if (prep != null && !entero(prep)) e.preparadas = 'Usa un número entero (ej: 180).'
    if (serv != null && !entero(serv)) e.servidas = 'Usa un número entero (ej: 172).'
    if (!e.preparadas && !e.servidas && prep != null && serv != null && serv > prep)
      e.servidas = 'No se pueden servir más raciones de las que se prepararon.'
    if (kg == null) e.kilos = 'Ingresa los kilos sobrantes (puede ser 0).'
    else if (Number.isNaN(kg) || kg < 0 || kg > 500) e.kilos = 'Ingresa un número entre 0 y 500 (ej: 12,5).'
    return e
  }

  const guardar = (ev) => {
    ev.preventDefault()
    const e = validar()
    setErrores(e)
    if (Object.keys(e).length) return
    const nuevo = guardarRegistro({
      establecimientoId: est.id,
      fecha,
      menuId: menu.id,
      preparadas: prep,
      servidas: serv,
      estimadas: pMenu.suficiente ? pMenu.recomendadas : null,
      kilos: Math.round(kg * 10) / 10,
      observaciones: observaciones.trim(),
    })
    setUltimo({ ...nuevo, menuNombre: menu.nombre })
    // Pasamos solo al siguiente menú del día que aún no tiene registro
    const pendientes = registrosDelDia(est, fecha, [...registros, nuevo], hoyISO).filter((x) => !x.registro)
    if (pendientes.length) setTipo(pendientes[0].menu.tipo)
    avisar('Registro guardado y sumado al resumen ✅')
    setPreparadas('')
    setServidas('')
    setKilosTexto('')
    setObservaciones('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Semana del día elegido para el resumen
  const lunesSemana = aISO(lunesDe(desdeISO(fecha)))
  const semana = semanas.find((s) => s.lunes === lunesSemana)
  const filas = diasHabilesDeSemana(desdeISO(lunesSemana))
    .filter((d) => d <= hoyISO)
    .flatMap((d) => registrosDelDia(est, d, registros, hoyISO).map((x) => ({ fecha: d, ...x })))

  return (
    <div className="animate-aparecer space-y-6">
      <Encabezado
        titulo="Registro de desperdicio"
        descripcion="Anota los sobrantes reales al final del servicio y compáralos con lo estimado."
      >
        <PildoraEstablecimiento est={est} />
      </Encabezado>

      {/* Vista posterior al guardar */}
      {ultimo && ultimo.establecimientoId === est.id && (
        <div className="flex animate-aparecer flex-col gap-4 rounded-3xl border border-verde-200 bg-verde-50 p-5 sm:flex-row sm:items-center">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-verde-600 text-white shadow-boton">
            <CircleCheck className="size-7" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1 text-verde-900">
            <p className="font-bold">¡Registro guardado!</p>
            <p className="text-sm">
              {TIPOS_MENU[ultimo.menuId.split(':')[1]].emoji} {ultimo.menuNombre} ·{' '}
              {fechaCorta(ultimo.fecha)} · <strong>{fKilos(ultimo.kilos)}</strong>. Ya se sumó al resumen de la semana (abajo) y a
              “Ahorro y reducción”.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Boton tamano="sm" variante="secundario" icono={Plus} onClick={() => setUltimo(null)}>
              Registrar otro
            </Boton>
            <Boton tamano="sm" to="/admin/ahorro" icono={PiggyBank}>
              Ver ahorro
            </Boton>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Formulario */}
        <Tarjeta as="form" onSubmit={guardar} noValidate className="space-y-5 p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <NotebookPen className="size-5 text-verde-600" aria-hidden="true" /> Nuevo registro
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Fecha" value={fecha} onChange={(e) => setFecha(e.target.value)}>
              {dias.map((d) => {
                const rel = fechaRelativa(d, ahora)
                return (
                  <option key={d} value={d}>
                    {['hoy', 'ayer'].includes(rel) ? `${capitalizar(rel)} · ` : ''}
                    {fechaCorta(d)}
                  </option>
                )
              })}
            </Campo>
            <Campo etiqueta="Menú" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              {prediccion.menus.map((m) => (
                <option key={m.menu.id} value={m.menu.tipo}>
                  {TIPOS_MENU[m.menu.tipo].emoji} {m.menu.nombre}
                </option>
              ))}
            </Campo>
          </div>

          {existente && (
            <p className="rounded-xl bg-marfil-200/70 px-3 py-2 text-sm text-tinta-suave">
              Este menú ya tiene un registro {existente.origen === 'ficticio' ? 'de ejemplo (ficticio)' : 'guardado en la app'} con{' '}
              <strong className="text-tinta">{fKilos(existente.kilos)}</strong>. Si guardas, se reemplaza.
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo
              etiqueta="Raciones preparadas (opcional)"
              type="number"
              inputMode="numeric"
              min="0"
              placeholder={pMenu.suficiente ? `Estimado: ${pMenu.recomendadas}` : 'Ej: 180'}
              value={preparadas}
              onChange={(e) => setPreparadas(e.target.value)}
              error={errores.preparadas}
            />
            <Campo
              etiqueta="Raciones servidas (opcional)"
              type="number"
              inputMode="numeric"
              min="0"
              placeholder={`Reservas: ${pMenu.confirmadas}`}
              value={servidas}
              onChange={(e) => setServidas(e.target.value)}
              error={errores.servidas}
            />
          </div>

          <Campo
            etiqueta="Kilos sobrantes"
            icono={Scale}
            inputMode="decimal"
            placeholder="Ej: 12,5"
            value={kilosTexto}
            onChange={(e) => setKilosTexto(e.target.value)}
            error={errores.kilos}
            ayuda="Pesa lo que sobró en ollas y bandejas. Usa coma para los decimales."
          />

          <div>
            <label htmlFor="observaciones" className="mb-1.5 block text-sm font-semibold">
              Observaciones (opcional)
            </label>
            <textarea
              id="observaciones"
              rows={3}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="¿Pasó algo especial hoy?"
              className="w-full rounded-2xl border border-marfil-300 bg-white px-4 py-3 text-[15px] outline-none placeholder:text-tinta-suave/60 hover:border-marfil-400 focus:border-verde-500 focus:ring-4 focus:ring-verde-100"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {NOTAS_RAPIDAS.map((nota) => (
                <button
                  key={nota}
                  type="button"
                  onClick={() => setObservaciones((o) => (o ? `${o}. ${nota}` : nota))}
                  className="cursor-pointer rounded-full bg-marfil-200 px-3 py-1 text-xs font-semibold text-tinta-suave hover:bg-verde-50 hover:text-verde-800"
                >
                  + {nota}
                </button>
              ))}
            </div>
          </div>

          <Boton type="submit" tamano="lg" bloque icono={Save}>
            Guardar registro
          </Boton>
        </Tarjeta>

        {/* Estimado vs. observado */}
        <Comparacion
          est={est}
          pMenu={pMenu}
          participacion={prediccion.totalConfirmadas ? pMenu.confirmadas / prediccion.totalConfirmadas : 1 / 3}
          prep={prep}
          serv={serv}
          kg={kg}
          fecha={fecha}
          hoyISO={hoyISO}
        />
      </div>

      {/* Resumen de la semana con el dato incorporado */}
      <Tarjeta className="p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Resumen de la semana del {fechaCorta(lunesSemana)}</h2>
            <p className="text-sm text-tinta-suave">Registros de {est.nombre}. Los nuevos aparecen marcados.</p>
          </div>
          {semana && semana.tipo === 'piloto' && (
            <div className="flex flex-wrap gap-2 text-sm">
              <Insignia tono="verde">{fKilos(semana.kilos)} registrados</Insignia>
              {semana.kgDia != null && <Insignia tono="neutro">{fKilos(semana.kgDia)} por día</Insignia>}
              {semana.faltantes > 0 && <Insignia tono="miel">{semana.faltantes} sin registro</Insignia>}
            </div>
          )}
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead>
              <tr className="border-b border-marfil-300 text-left text-xs text-tinta-suave uppercase">
                <th className="py-2 pr-3 font-semibold">Fecha</th>
                <th className="px-3 py-2 font-semibold">Menú</th>
                <th className="px-3 py-2 text-right font-semibold">Estimadas</th>
                <th className="px-3 py-2 text-right font-semibold">Preparadas</th>
                <th className="px-3 py-2 text-right font-semibold">Servidas</th>
                <th className="px-3 py-2 text-right font-semibold">Kilos</th>
                <th className="py-2 pl-3 font-semibold">Origen</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {filas.map(({ fecha: f, menu: m, registro: r }) => {
                const nuevo = r && ultimo && r.id === ultimo.id
                return (
                  <tr key={m.id} className={`border-b border-marfil-200 ${nuevo ? 'bg-verde-50' : ''}`}>
                    <td className="py-2 pr-3 whitespace-nowrap">{fechaCorta(f)}</td>
                    <td className="px-3 py-2">
                      <span aria-hidden="true">{TIPOS_MENU[m.tipo].emoji}</span> {m.nombre}
                      {r?.observaciones && <span className="block text-xs text-tinta-suave">“{r.observaciones}”</span>}
                    </td>
                    {r ? (
                      <>
                        <td className="px-3 py-2 text-right text-tinta-suave">{r.estimadas != null ? numero(r.estimadas) : '—'}</td>
                        <td className="px-3 py-2 text-right">{r.preparadas != null ? numero(r.preparadas) : <SinDato />}</td>
                        <td className="px-3 py-2 text-right">{r.servidas != null ? numero(r.servidas) : <SinDato />}</td>
                        <td className="px-3 py-2 text-right font-bold">{fKilos(r.kilos)}</td>
                        <td className="py-2 pl-3">
                          {nuevo ? (
                            <Insignia tono="verde">✨ Nuevo</Insignia>
                          ) : r.origen === 'app' ? (
                            <Insignia tono="laguna">Registrado en la app</Insignia>
                          ) : (
                            <Insignia tono="neutro">Ficticio</Insignia>
                          )}
                        </td>
                      </>
                    ) : (
                      <td colSpan={5} className="px-3 py-2 text-right">
                        <Insignia tono="miel">{f === hoyISO ? 'Pendiente de registrar' : 'Dato faltante: sin registro'}</Insignia>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Tarjeta>
    </div>
  )
}

const SinDato = () => <span className="text-xs text-tinta-suave">No registrado</span>

function Comparacion({ est, pMenu, participacion, prep, serv, kg, fecha, hoyISO }) {
  const base = lineaBase(est)
  // Referencia "antes de Optimeal" para este menú, según cuánto pesa en el día
  const kgAntesPorMenu = base.kgDia * participacion
  const esperado = prep != null && serv != null && prep >= serv ? (prep - serv) * KG_POR_RACION + serv * KG_RESTOS_POR_SERVIDA : null
  const diferenciaPrep = prep != null && pMenu.suficiente ? prep - pMenu.recomendadas : null
  const noRetiraron = serv != null ? pMenu.confirmadas - serv : null

  return (
    <Tarjeta className="p-5 sm:p-6">
      <h2 className="text-lg font-bold">Estimado vs. observado</h2>
      <p className="text-sm text-tinta-suave">
        {pMenu.menu.nombre} · {fechaCorta(fecha)}
        {fecha === hoyISO && pMenu.abierta ? ' · las reservas de hoy aún no cierran' : ''}
      </p>

      <dl className="mt-4 divide-y divide-marfil-200">
        <Fila
          etiqueta="Raciones estimadas"
          detalle="Predicción del panel del casino"
          valor={pMenu.suficiente ? numero(pMenu.recomendadas) : '—'}
          etiquetaDato={<EtiquetaDato tipo={pMenu.suficiente ? 'estimacion' : 'insuficiente'} />}
        />
        <Fila
          etiqueta="Raciones preparadas"
          detalle={
            diferenciaPrep == null
              ? 'Lo que ingreses en el formulario'
              : diferenciaPrep === 0
                ? 'Igual a lo estimado 👌'
                : `${diferenciaPrep > 0 ? '+' : '−'}${numero(Math.abs(diferenciaPrep))} ${diferenciaPrep > 0 ? 'sobre' : 'bajo'} lo estimado`
          }
          valor={prep != null ? numero(prep) : '—'}
          resalte={diferenciaPrep != null && diferenciaPrep > 0 ? 'miel' : null}
        />
        <Fila
          etiqueta="Reservas confirmadas"
          detalle="Estudiantes que reservaron"
          valor={numero(pMenu.confirmadas)}
          etiquetaDato={<EtiquetaDato tipo="confirmado" texto="Confirmado" />}
        />
        <Fila
          etiqueta="Raciones servidas"
          detalle={noRetiraron == null ? 'Lo que ingreses en el formulario' : noRetiraron > 0 ? `${numero(noRetiraron)} reservaron y no retiraron` : 'Todos retiraron su almuerzo 🎉'}
          valor={serv != null ? numero(serv) : '—'}
        />
        <Fila
          etiqueta="Kilos sobrantes"
          detalle={
            esperado != null
              ? `Según tus raciones se esperarían ~${fKilos(esperado)}`
              : `Antes de Optimeal: ~${fKilos(kgAntesPorMenu)} para un menú como este`
          }
          valor={kg != null && !Number.isNaN(kg) ? fKilos(kg) : '—'}
          resalte={esperado != null && kg != null && kg > esperado * 1.25 ? 'miel' : null}
        />
      </dl>

      {kg != null && !Number.isNaN(kg) && (
        <p
          className={`mt-4 rounded-xl px-3 py-2 text-sm ${
            kg <= kgAntesPorMenu ? 'bg-verde-50 text-verde-900 ring-1 ring-verde-200' : 'bg-miel-50 text-miel-800 ring-1 ring-miel-100'
          }`}
        >
          {kg <= kgAntesPorMenu
            ? `✅ ${fKilos(kgAntesPorMenu - kg)} menos que un día típico antes de Optimeal.`
            : '⚠️ Más que un día típico antes de Optimeal: vale la pena anotar qué pasó en observaciones.'}
        </p>
      )}

      <p className="mt-4 text-xs text-tinta-suave">
        Valores de referencia ficticios · 1 ración sin servir ≈ {KG_POR_RACION.toLocaleString('es-CL')} kg · restos por
        bandeja ≈ {KG_RESTOS_POR_SERVIDA.toLocaleString('es-CL')} kg
      </p>
    </Tarjeta>
  )
}

function Fila({ etiqueta, detalle, valor, etiquetaDato, resalte }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="min-w-0 flex-1">
        <dt className="flex flex-wrap items-center gap-2 text-sm font-semibold">
          {etiqueta} {etiquetaDato}
        </dt>
        <dd className={`text-xs ${resalte === 'miel' ? 'font-semibold text-miel-800' : 'text-tinta-suave'}`}>{detalle}</dd>
      </div>
      <dd className="text-xl font-semibold tabular-nums">{valor}</dd>
    </div>
  )
}
