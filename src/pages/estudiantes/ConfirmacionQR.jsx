// ✅ Confirmación y código QR de retiro
// Muestra la reserva confirmada con un QR (ilustrativo, pero escaneable:
// al leerlo con el celular aparecen los datos de la reserva).

import { CalendarDays, Check, Clock, HandPlatter, ListChecks, Lock, MapPin, Pencil, ScanLine, Ticket, UtensilsCrossed } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Link, useSearchParams } from 'react-router-dom'
import MiniMenu from '../../components/estudiantes/MiniMenu'
import PasosReserva from '../../components/estudiantes/PasosReserva'
import Boton from '../../components/ui/Boton'
import Encabezado from '../../components/ui/Encabezado'
import Insignia from '../../components/ui/Insignia'
import Tarjeta from '../../components/ui/Tarjeta'
import { useAhora } from '../../context/RelojContext'
import { ESTADOS, estadoReserva, useMisReservas } from '../../context/ReservasContext'
import { HORA_CIERRE_TEXTO, HORARIO_RETIRO } from '../../data/config'
import { buscarEstablecimiento } from '../../data/establecimientos'
import { buscarMenu } from '../../data/menus'
import { aISO, capitalizar, fechaCorta, fechaLarga, fechaRelativa } from '../../utils/fechas'

export default function ConfirmacionQR() {
  const [params] = useSearchParams()
  const ahora = useAhora()
  const { mias } = useMisReservas()
  const hoy = aISO(ahora)

  const proximas = mias.filter((r) => r.estado === 'confirmada' && r.fecha >= hoy)
  const id = params.get('id')
  const reserva = id ? mias.find((r) => r.id === id) : proximas[0]
  const esNueva = params.get('nueva') === '1'

  if (!reserva) return <SinReservas />

  const menu = buscarMenu(reserva.menuId)
  const estado = estadoReserva(reserva, ahora)
  const editable = estado === 'confirmada'
  const usable = estado === 'confirmada' || estado === 'cerrada'
  const colegio = buscarEstablecimiento(reserva.establecimientoId)

  // Lo que verá quien escanee el QR con su celular
  const textoQR = [
    `OPTIMEAL ${reserva.codigo}`,
    reserva.nombre,
    `${fechaCorta(reserva.fecha)} · ${menu?.nombre}`,
    colegio.nombre,
  ].join('\n')

  return (
    <div className="animate-aparecer space-y-6">
      {esNueva && usable ? (
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <span className="grid size-16 shrink-0 animate-aparecer place-items-center rounded-full bg-verde-600 text-white shadow-boton">
            <Check className="size-9" strokeWidth={3} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-verde-700">Paso 3 de 3 · ¡Listo!</p>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-verde-900 sm:text-4xl">
              {reserva.modificada ? '¡Reserva modificada!' : '¡Reserva confirmada!'}
            </h1>
            <p className="mt-1 text-tinta-suave">
              Tu almuerzo {fechaRelativa(reserva.fecha, ahora) === 'hoy' ? 'de hoy' : `del ${fechaLarga(reserva.fecha)}`} está
              reservado. Gracias por ayudar a no desperdiciar comida 🌱
            </p>
          </div>
        </div>
      ) : (
        <Encabezado
          antetitulo="Tu almuerzo, listo para retirar"
          titulo="Mi código QR"
          descripcion="Presenta este código en el casino para retirar tu almuerzo."
        />
      )}

      {esNueva && usable && <PasosReserva actual={3} />}

      <Tarjeta className="grid gap-6 p-5 sm:p-7 md:grid-cols-[minmax(0,17rem)_1fr] md:gap-8">
        {/* QR */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-[17rem] rounded-3xl bg-white p-5 ring-1 ring-marfil-300">
            <QRCodeSVG
              value={textoQR}
              size={512}
              level="Q"
              fgColor="#1E2A23"
              bgColor="#FFFFFF"
              marginSize={0}
              imageSettings={{ src: '/favicon.svg', height: 72, width: 72, excavate: true }}
              className={`h-auto w-full ${usable ? '' : 'opacity-20 blur-[2px]'}`}
              title={`Código QR de la reserva ${reserva.codigo}`}
            />
            {!usable && (
              <div className="absolute inset-0 grid place-items-center p-6 text-center">
                <p className="rounded-2xl bg-white/95 px-4 py-3 text-sm font-bold shadow-suave ring-1 ring-marfil-300">
                  {estado === 'cancelada' ? 'Reserva cancelada' : 'Almuerzo ya retirado'}
                </p>
              </div>
            )}
          </div>
          <p className="mt-3 font-mono text-lg font-bold tracking-[0.2em]">{reserva.codigo}</p>
          <p className="text-xs text-tinta-suave">QR ilustrativo · prototipo</p>
        </div>

        {/* Detalles */}
        <div className="flex min-w-0 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <Insignia tono={ESTADOS[estado].tono}>{ESTADOS[estado].etiqueta}</Insignia>
            {reserva.modificada && <Insignia tono="neutro">Modificada</Insignia>}
          </div>
          <div className="mt-4">
            <MiniMenu menu={menu} />
          </div>

          <dl className="mt-5 grid gap-4 text-[15px] sm:grid-cols-2">
            <Dato icono={CalendarDays} etiqueta="Fecha">
              {capitalizar(fechaLarga(reserva.fecha))}
            </Dato>
            <Dato icono={Clock} etiqueta="Horario de retiro">
              {HORARIO_RETIRO} h
            </Dato>
            <Dato icono={MapPin} etiqueta="Lugar">
              {colegio.casino} · {colegio.nombre}
            </Dato>
            <Dato icono={UtensilsCrossed} etiqueta="Incluye">
              {menu?.acompanamientos.join(' · ')} · {menu?.postre}
            </Dato>
          </dl>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Boton to={`/estudiantes/reservas?destacar=${reserva.id}`} icono={Ticket}>
              Ver mi reserva
            </Boton>
            {editable ? (
              <Boton to={`/estudiantes/menu?fecha=${reserva.fecha}`} variante="secundario" icono={Pencil}>
                Modificar reserva
              </Boton>
            ) : (
              usable && (
                <Boton variante="secundario" icono={Lock} disabled aria-describedby="motivo-modificar">
                  Modificar reserva
                </Boton>
              )
            )}
          </div>
          {editable ? (
            <p className="mt-3 text-sm text-tinta-suave">
              Puedes modificarla o cancelarla hasta las {HORA_CIERRE_TEXTO} del {fechaCorta(reserva.fecha)}.
            </p>
          ) : (
            usable && (
              <p id="motivo-modificar" className="mt-3 flex items-start gap-2 text-sm text-tinta-suave">
                <Lock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                Ya no se puede modificar: el plazo cerró a las {HORA_CIERRE_TEXTO} y el casino está preparando tu
                ración.
              </p>
            )
          )}
        </div>
      </Tarjeta>

      {/* Cómo retirar */}
      <Tarjeta className="p-6 sm:p-7">
        <h2 className="text-lg font-bold">¿Cómo retiro mi almuerzo?</h2>
        <ol className="mt-5 grid gap-5 sm:grid-cols-3">
          {[
            { icono: Clock, titulo: 'Ve al casino', texto: `Horario ${HORARIO_RETIRO} h, en ${colegio.casino}.` },
            { icono: ScanLine, titulo: 'Muestra tu QR', texto: 'Desde tu celular o impreso. El personal lo escanea en la caja.' },
            { icono: HandPlatter, titulo: '¡Retira tu bandeja!', texto: 'El sistema marca tu almuerzo como entregado. Así de simple.' },
          ].map((p, i) => (
            <li key={p.titulo} className="flex gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-verde-100 text-verde-700">
                <p.icono className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold">
                  {i + 1}. {p.titulo}
                </p>
                <p className="mt-0.5 text-sm text-tinta-suave">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </Tarjeta>

      {/* Otras reservas próximas */}
      {proximas.filter((r) => r.id !== reserva.id).length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-tinta-suave">Otras reservas próximas</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {proximas
              .filter((r) => r.id !== reserva.id)
              .map((r) => (
                <Link
                  key={r.id}
                  to={`/estudiantes/qr?id=${r.id}`}
                  className="rounded-xl bg-white px-3 py-2 text-sm font-semibold ring-1 ring-marfil-300 hover:ring-verde-300"
                >
                  {capitalizar(fechaRelativa(r.fecha, ahora))} · {buscarMenu(r.menuId)?.nombre}
                </Link>
              ))}
          </div>
        </section>
      )}
    </div>
  )
}

function Dato({ icono: Icono, etiqueta, children }) {
  return (
    <div className="flex gap-3">
      <Icono className="mt-0.5 size-5 shrink-0 text-verde-600" aria-hidden="true" />
      <div className="min-w-0">
        <dt className="text-xs font-bold tracking-wider text-tinta-suave uppercase">{etiqueta}</dt>
        <dd className="mt-0.5">{children}</dd>
      </div>
    </div>
  )
}

function SinReservas() {
  return (
    <Tarjeta className="mx-auto max-w-lg animate-aparecer p-8 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-verde-100 text-verde-700">
        <ListChecks className="size-7" aria-hidden="true" />
      </span>
      <h1 className="mt-4 text-xl font-bold">Aún no tienes almuerzos reservados</h1>
      <p className="mt-2 text-tinta-suave">Cuando reserves, aquí aparecerá tu código QR para retirar.</p>
      <Boton to="/estudiantes/menu" className="mt-6" icono={UtensilsCrossed}>
        Reservar almuerzo
      </Boton>
    </Tarjeta>
  )
}
