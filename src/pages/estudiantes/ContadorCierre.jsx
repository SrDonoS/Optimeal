// ⏳ Contador de cierre y confirmación
// Muestra la fecha, el menú elegido, el tiempo restante y la hora límite.
// Si el plazo ya cerró, muestra una segunda vista sin opción de reservar.

import { ArrowLeft, ArrowRight, CalendarDays, Check, CircleCheck, Clock, Lock, MapPin, QrCode, TriangleAlert } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import CuentaRegresiva from '../../components/estudiantes/CuentaRegresiva'
import PasosReserva from '../../components/estudiantes/PasosReserva'
import Plato from '../../components/ilustraciones/Plato'
import ControlesDemo from '../../components/reloj/ControlesDemo'
import Boton from '../../components/ui/Boton'
import Encabezado from '../../components/ui/Encabezado'
import Tarjeta from '../../components/ui/Tarjeta'
import { useAvisos } from '../../context/AvisosContext'
import { useAhora } from '../../context/RelojContext'
import { useMisReservas } from '../../context/ReservasContext'
import { HORA_CIERRE_TEXTO, HORARIO_RETIRO } from '../../data/config'
import { buscarEstablecimiento } from '../../data/establecimientos'
import { buscarMenu, TIPOS_MENU } from '../../data/menus'
import { capitalizar, cierreDe, fechaLarga, primerDiaAbierto } from '../../utils/fechas'

export default function ContadorCierre() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const ahora = useAhora()
  const { avisar } = useAvisos()
  const { mias, estudiante, reservar } = useMisReservas()

  const fecha = params.get('fecha')
  const menu = buscarMenu(params.get('menu'))

  // Enlace inválido (por ejemplo, si alguien escribió la URL a mano)
  if (!menu || menu.fecha !== fecha) {
    return (
      <Tarjeta className="mx-auto max-w-lg p-8 text-center">
        <p className="text-4xl" aria-hidden="true">🤔</p>
        <h1 className="mt-3 text-xl font-bold">No encontramos ese menú</h1>
        <p className="mt-2 text-tinta-suave">Vuelve al menú y elige tu almuerzo otra vez.</p>
        <Boton to="/estudiantes/menu" icono={ArrowLeft} className="mt-6">
          Volver al menú
        </Boton>
      </Tarjeta>
    )
  }

  const cierre = cierreDe(fecha)
  const restante = cierre - ahora
  const abierta = restante > 0
  const reservaActual = mias.find((r) => r.fecha === fecha && r.estado === 'confirmada')
  const menuActual = reservaActual ? buscarMenu(reservaActual.menuId) : null
  const esCambio = Boolean(reservaActual) && reservaActual.menuId !== menu.id
  const yaReservado = Boolean(reservaActual) && !esCambio
  const colegio = buscarEstablecimiento(estudiante?.establecimientoId)
  const tipo = TIPOS_MENU[menu.tipo]

  const confirmar = () => {
    if (!abierta) return
    const reserva = reservar({
      correo: estudiante.correo,
      nombre: estudiante.nombre,
      establecimientoId: estudiante.establecimientoId,
      fecha,
      menuId: menu.id,
    })
    avisar(esCambio ? 'Reserva modificada ✨' : '¡Reserva confirmada! 🎉')
    navigate(`/estudiantes/qr?id=${reserva.id}&nueva=1`)
  }

  return (
    <div className="animate-aparecer space-y-6">
      <Link
        to={`/estudiantes/menu?fecha=${fecha}`}
        className="inline-flex items-center gap-1.5 rounded-xl py-1 text-sm font-semibold text-tinta-suave hover:text-tinta"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Volver al menú
      </Link>

      <Encabezado
        antetitulo={abierta ? 'Paso 2 de 3 · Confirma antes del cierre' : `Reserva para el ${fechaLarga(fecha)}`}
        titulo={abierta ? (esCambio ? 'Confirma el cambio' : 'Confirma tu reserva') : 'Plazo cerrado'}
        descripcion={
          abierta
            ? `Tienes hasta las ${HORA_CIERRE_TEXTO} del ${fechaLarga(fecha)} para confirmar, modificar o cancelar.`
            : `Las reservas para el ${fechaLarga(fecha)} cerraron a las ${HORA_CIERRE_TEXTO}.`
        }
      />

      {abierta && <PasosReserva actual={2} />}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        {/* Resumen de la reserva */}
        <Tarjeta className="overflow-hidden">
          <div className={`grid aspect-[16/9] place-items-center ${tipo.fondo}`}>
            <Plato ilustracion={menu.ilustracion} className="h-[85%]" titulo={`Ilustración: ${menu.nombre}`} />
          </div>
          <div className="p-6">
            <p className="text-sm font-semibold text-tinta-suave">
              <span aria-hidden="true">{tipo.emoji}</span> Menú {tipo.nombre}
            </p>
            <h2 className="mt-1 text-2xl font-bold">{menu.nombre}</h2>
            <dl className="mt-5 space-y-3 text-[15px]">
              <Dato icono={CalendarDays} etiqueta="Fecha">
                {capitalizar(fechaLarga(fecha))}
              </Dato>
              <Dato icono={Check} etiqueta="Incluye">
                {menu.acompanamientos.join(' · ')} · Postre: {menu.postre}
              </Dato>
              <Dato icono={MapPin} etiqueta="Retiro">
                {colegio.casino}, {colegio.nombre} · {HORARIO_RETIRO} h
              </Dato>
            </dl>
            {esCambio && abierta && (
              <p className="mt-5 rounded-xl bg-miel-50 px-3 py-2 text-sm text-miel-800 ring-1 ring-miel-100">
                Reemplazará tu reserva actual: <strong>{menuActual?.nombre}</strong>.
              </p>
            )}
          </div>
        </Tarjeta>

        {/* Contador o vista de plazo cerrado */}
        <div className="min-w-0 space-y-4">
          {abierta ? (
            <Tarjeta className="p-6 sm:p-7">
              <p className="flex items-center gap-2 font-bold">
                <Clock className="size-5 text-verde-600" aria-hidden="true" />
                Tiempo restante para reservar
              </p>
              <div className="mt-4">
                <CuentaRegresiva ms={restante} />
              </div>
              <p className="mt-4 text-sm text-tinta-suave">
                Hora límite: <strong className="text-tinta">{HORA_CIERRE_TEXTO}</strong> · {fechaLarga(fecha)}
              </p>

              {restante <= 60 * 60_000 && (
                <p className="mt-4 flex items-center gap-2 rounded-xl bg-miel-50 px-3 py-2 text-sm font-semibold text-miel-800 ring-1 ring-miel-100">
                  <TriangleAlert className="size-4 shrink-0" aria-hidden="true" />
                  ¡Queda poco! Confirma antes de que cierre el plazo.
                </p>
              )}

              {yaReservado ? (
                <div className="mt-6 space-y-2">
                  <p className="flex items-center gap-2 font-semibold text-verde-800">
                    <CircleCheck className="size-5" aria-hidden="true" /> Este menú ya está reservado.
                  </p>
                  <Boton to={`/estudiantes/qr?id=${reservaActual.id}`} variante="secundario" bloque icono={QrCode}>
                    Ver mi reserva
                  </Boton>
                </div>
              ) : (
                <Boton tamano="lg" bloque className="mt-6" icono={Check} onClick={confirmar}>
                  {esCambio ? 'Confirmar cambio' : 'Confirmar reserva'}
                </Boton>
              )}
              <p className="mt-3 text-center text-xs text-tinta-suave">
                Podrás modificar o cancelar hasta la hora límite. Después, el casino cocina según las reservas
                confirmadas.
              </p>
            </Tarjeta>
          ) : (
            <Tarjeta className="p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-marfil-200 text-tinta-suave">
                  <Lock className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xl font-bold">El plazo de reserva cerró</p>
                  <p className="mt-1 text-tinta-suave">
                    Ya no es posible reservar, modificar ni cancelar para este día.
                  </p>
                </div>
              </div>
              <div className="mt-5 opacity-70">
                <CuentaRegresiva ms={0} />
              </div>
              <p className="mt-4 rounded-xl bg-marfil-200/70 px-3 py-2.5 text-sm text-tinta-suave">
                <strong className="text-tinta">¿Por qué?</strong> A las {HORA_CIERRE_TEXTO} el casino cierra la lista y
                empieza a cocinar solo las raciones reservadas. ¡Así se evita botar comida! 🌱
              </p>
              <div className="mt-6 flex flex-col gap-2">
                {reservaActual && (
                  <Boton to={`/estudiantes/qr?id=${reservaActual.id}`} icono={QrCode} bloque>
                    Ver el QR de tu reserva
                  </Boton>
                )}
                <Boton
                  to={`/estudiantes/menu?fecha=${primerDiaAbierto(ahora)}`}
                  variante={reservaActual ? 'secundario' : 'primario'}
                  iconoDerecha={ArrowRight}
                  bloque
                >
                  Ver próximo día disponible
                </Boton>
              </div>
            </Tarjeta>
          )}

          <ControlesDemo fecha={fecha} />
        </div>
      </div>
    </div>
  )
}

function Dato({ icono: Icono, etiqueta, children }) {
  return (
    <div className="flex gap-3">
      <Icono className="mt-0.5 size-5 shrink-0 text-verde-600" aria-hidden="true" />
      <div>
        <dt className="text-xs font-bold tracking-wider text-tinta-suave uppercase">{etiqueta}</dt>
        <dd className="mt-0.5">{children}</dd>
      </div>
    </div>
  )
}
