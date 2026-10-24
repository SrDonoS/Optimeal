// 🗓️ Mis reservas: modificar y cancelar
// Dentro del plazo se puede modificar o cancelar (con confirmación).
// Después del cierre, las acciones aparecen deshabilitadas y se explica por qué.

import { CalendarPlus, Info, Lock, Pencil, QrCode, Trash2, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import MiniMenu from '../../components/estudiantes/MiniMenu'
import Boton from '../../components/ui/Boton'
import Dialogo from '../../components/ui/Dialogo'
import Encabezado from '../../components/ui/Encabezado'
import Insignia from '../../components/ui/Insignia'
import Tarjeta from '../../components/ui/Tarjeta'
import { useAvisos } from '../../context/AvisosContext'
import { useAhora } from '../../context/RelojContext'
import { ESTADOS, estadoReserva, useMisReservas } from '../../context/ReservasContext'
import { HORA_CIERRE_TEXTO } from '../../data/config'
import { buscarEstablecimiento } from '../../data/establecimientos'
import { buscarMenu } from '../../data/menus'
import {
  capitalizar,
  cierreDe,
  desdeISO,
  diaSemanaCorto,
  fechaLarga,
  fechaRelativa,
  mesCorto,
  textoRestante,
} from '../../utils/fechas'

export default function MisReservas() {
  const ahora = useAhora()
  const navigate = useNavigate()
  const { avisar } = useAvisos()
  const { mias, cancelar } = useMisReservas()
  const [params] = useSearchParams()
  const destacar = params.get('destacar')

  const conEstado = mias.map((r) => ({ ...r, estadoActual: estadoReserva(r, ahora) }))
  const proximas = conEstado.filter((r) => r.estadoActual === 'confirmada' || r.estadoActual === 'cerrada')
  const historial = conEstado.filter((r) => r.estadoActual === 'retirada' || r.estadoActual === 'cancelada').reverse()

  const [pestana, setPestana] = useState(() =>
    destacar && historial.some((r) => r.id === destacar) ? 'historial' : 'proximas',
  )
  const [aCancelar, setACancelar] = useState(null)

  // Lleva la vista a la reserva destacada (al venir desde "Ver mi reserva")
  useEffect(() => {
    if (!destacar) return
    const t = setTimeout(
      () => document.getElementById(`reserva-${destacar}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      150,
    )
    return () => clearTimeout(t)
  }, [destacar])

  const confirmarCancelacion = () => {
    if (!aCancelar) return
    // Revisamos otra vez el plazo: pudo cerrar mientras el diálogo estaba abierto
    if (estadoReserva(aCancelar, ahora) !== 'confirmada') {
      avisar('El plazo cerró: ya no se puede cancelar esta reserva.', 'arcilla')
    } else {
      cancelar(aCancelar.id)
      avisar('Reserva cancelada. ¡Gracias por avisar a tiempo! 🌱', 'neutro')
    }
    setACancelar(null)
  }

  const lista = pestana === 'proximas' ? proximas : historial

  return (
    <div className="animate-aparecer space-y-6">
      <Encabezado
        antetitulo="Gestiona tus almuerzos"
        titulo="Mis reservas"
        descripcion="Revisa tus reservas, modifícalas o cancélalas mientras el plazo esté abierto."
        acciones={
          <Boton to="/estudiantes/menu" icono={CalendarPlus}>
            Nueva reserva
          </Boton>
        }
      />

      <p className="flex items-start gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-tinta-suave ring-1 ring-marfil-300">
        <Info className="mt-0.5 size-4 shrink-0 text-verde-600" aria-hidden="true" />
        <span>
          Puedes <strong className="text-tinta">modificar o cancelar</strong> cada reserva hasta las{' '}
          <strong className="text-tinta">{HORA_CIERRE_TEXTO}</strong> del día del almuerzo. Después, el casino ya
          está cocinando tu ración.
        </span>
      </p>

      {/* Pestañas */}
      <div role="tablist" aria-label="Tipo de reservas" className="inline-flex gap-1 rounded-2xl bg-marfil-200 p-1">
        {[
          { id: 'proximas', etiqueta: 'Próximas', total: proximas.length },
          { id: 'historial', etiqueta: 'Historial', total: historial.length },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={pestana === t.id}
            aria-controls="lista-reservas"
            onClick={() => setPestana(t.id)}
            className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              pestana === t.id ? 'bg-white text-verde-800 shadow-suave' : 'text-tinta-suave hover:text-tinta'
            }`}
          >
            {t.etiqueta}
            <span className="ml-1.5 rounded-full bg-marfil-100 px-1.5 text-xs text-tinta-suave">{t.total}</span>
          </button>
        ))}
      </div>

      <div id="lista-reservas" role="tabpanel" className="space-y-3">
        {lista.length === 0 ? (
          <Tarjeta className="p-8 text-center">
            <p className="font-bold">
              {pestana === 'proximas' ? 'No tienes reservas próximas' : 'Aún no hay reservas en tu historial'}
            </p>
            <p className="mt-1 text-sm text-tinta-suave">
              {pestana === 'proximas' ? 'Reserva tu almuerzo para los próximos días.' : 'Aquí verás tus almuerzos pasados.'}
            </p>
            {pestana === 'proximas' && (
              <Boton to="/estudiantes/menu" className="mt-5" icono={CalendarPlus}>
                Reservar almuerzo
              </Boton>
            )}
          </Tarjeta>
        ) : (
          lista.map((r) => (
            <FilaReserva
              key={r.id}
              reserva={r}
              ahora={ahora}
              destacada={r.id === destacar}
              onVerQR={() => navigate(`/estudiantes/qr?id=${r.id}`)}
              onModificar={() => navigate(`/estudiantes/menu?fecha=${r.fecha}`)}
              onCancelar={() => setACancelar(r)}
            />
          ))
        )}
      </div>

      {/* Confirmación antes de cancelar */}
      <Dialogo
        abierto={Boolean(aCancelar)}
        onCerrar={() => setACancelar(null)}
        titulo="¿Cancelar tu reserva?"
        icono={Trash2}
        tono="arcilla"
        acciones={
          <>
            <Boton variante="secundario" onClick={() => setACancelar(null)}>
              No, mantener
            </Boton>
            <Boton variante="peligro" icono={XCircle} onClick={confirmarCancelacion}>
              Sí, cancelar reserva
            </Boton>
          </>
        }
      >
        {aCancelar && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-3 ring-1 ring-marfil-300">
              <MiniMenu menu={buscarMenu(aCancelar.menuId)} tamano="sm">
                {' · '}
                {capitalizar(fechaLarga(aCancelar.fecha))}
              </MiniMenu>
            </div>
            <p className="text-sm">
              Si cancelas, el casino cocinará una ración menos 🌱. Podrás volver a reservar hasta las{' '}
              {HORA_CIERRE_TEXTO} del {fechaLarga(aCancelar.fecha)}.
            </p>
          </div>
        )}
      </Dialogo>
    </div>
  )
}

function FilaReserva({ reserva, ahora, destacada, onVerQR, onModificar, onCancelar }) {
  const menu = buscarMenu(reserva.menuId)
  const estado = reserva.estadoActual
  const meta = ESTADOS[estado]
  const editable = estado === 'confirmada'
  const esHoy = fechaRelativa(reserva.fecha, ahora) === 'hoy'
  const fecha = desdeISO(reserva.fecha)
  const colegio = buscarEstablecimiento(reserva.establecimientoId)
  const cuando = fechaRelativa(reserva.fecha, ahora)

  let detalle
  if (estado === 'confirmada') {
    detalle = (
      <p className="text-sm text-tinta-suave">
        Puedes modificar o cancelar hasta {cuando === 'hoy' || cuando === 'mañana' ? cuando : `el ${cuando}`} a las{' '}
        {HORA_CIERRE_TEXTO}{' '}
        <span className="font-semibold text-verde-700">(faltan {textoRestante(cierreDe(reserva.fecha) - ahora)})</span>
      </p>
    )
  } else if (estado === 'cerrada') {
    detalle = (
      <p className="flex items-start gap-1.5 text-sm text-tinta-suave">
        <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        <span>
          El plazo cerró a las {HORA_CIERRE_TEXTO}: el casino ya preparó tu ración, por eso no se puede modificar ni
          cancelar.
        </span>
      </p>
    )
  } else if (estado === 'retirada') {
    detalle = <p className="text-sm text-tinta-suave">Retirado en {colegio.casino}.</p>
  } else {
    detalle = <p className="text-sm text-tinta-suave">Cancelaste esta reserva a tiempo. ¡Gracias! 🌱</p>
  }

  const motivoBloqueo = 'El plazo para modificar o cancelar ya cerró'

  return (
    <article
      id={`reserva-${reserva.id}`}
      className={`flex scroll-mt-24 flex-col gap-4 rounded-3xl border bg-marfil-50 p-4 transition-shadow sm:flex-row sm:items-center sm:p-5 ${
        destacada ? 'border-verde-400 shadow-flotante ring-2 ring-verde-300' : 'border-marfil-300/80 shadow-suave'
      } ${estado === 'cancelada' || estado === 'retirada' ? 'opacity-85' : ''}`}
    >
      {/* Fecha */}
      <div
        className={`flex w-16 shrink-0 flex-col items-center rounded-2xl py-2 ${
          esHoy ? 'bg-verde-600 text-white' : 'bg-white ring-1 ring-marfil-300'
        }`}
      >
        <span className="text-xs font-bold uppercase">{esHoy ? 'Hoy' : diaSemanaCorto(reserva.fecha)}</span>
        <span className="font-display text-2xl leading-tight font-semibold">{fecha.getDate()}</span>
        <span className="text-xs">{mesCorto(reserva.fecha)}</span>
      </div>

      {/* Menú y estado */}
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Insignia tono={meta.tono}>{meta.etiqueta}</Insignia>
          {reserva.modificada && <Insignia tono="neutro">Modificada</Insignia>}
          <span className="font-mono text-xs text-tinta-suave">{reserva.codigo}</span>
        </div>
        <MiniMenu menu={menu} tamano="sm" />
        {detalle}
      </div>

      {/* Acciones */}
      {(estado === 'confirmada' || estado === 'cerrada') && (
        <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-stretch">
          <Boton tamano="sm" icono={QrCode} onClick={onVerQR}>
            Ver QR
          </Boton>
          <Boton
            tamano="sm"
            variante="secundario"
            icono={editable ? Pencil : Lock}
            onClick={onModificar}
            disabled={!editable}
            title={editable ? undefined : motivoBloqueo}
          >
            Modificar
          </Boton>
          <Boton
            tamano="sm"
            variante={editable ? 'peligroSuave' : 'fantasma'}
            icono={editable ? Trash2 : Lock}
            onClick={onCancelar}
            disabled={!editable}
            title={editable ? undefined : motivoBloqueo}
          >
            Cancelar
          </Boton>
        </div>
      )}
    </article>
  )
}
