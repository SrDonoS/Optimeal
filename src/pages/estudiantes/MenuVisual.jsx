// 🍽️ Menú visual y reserva
// El estudiante elige una fecha, revisa los menús y selecciona uno.
// Luego "Reservar almuerzo" lo lleva a confirmar antes del cierre.

import { ArrowRight, CalendarClock, CircleCheck, Lock, QrCode, Pencil } from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SelectorFecha from '../../components/estudiantes/SelectorFecha'
import TarjetaMenu from '../../components/estudiantes/TarjetaMenu'
import Boton from '../../components/ui/Boton'
import Encabezado from '../../components/ui/Encabezado'
import { useAhora } from '../../context/RelojContext'
import { useMisReservas } from '../../context/ReservasContext'
import { HORA_CIERRE_TEXTO } from '../../data/config'
import { buscarMenu, menusDelDia } from '../../data/menus'
import {
  capitalizar,
  cierreDe,
  esFechaHabil,
  estaAbierta,
  fechaLarga,
  fechaRelativa,
  primerDiaAbierto,
  textoRestante,
} from '../../utils/fechas'

export default function MenuVisual() {
  const ahora = useAhora()
  const [params, setParams] = useSearchParams()
  const { mias } = useMisReservas()

  const fechaParam = params.get('fecha')
  const fecha = esFechaHabil(fechaParam) ? fechaParam : primerDiaAbierto(ahora)
  const cambiarFecha = (iso) => setParams({ fecha: iso }, { replace: true })

  const activas = mias.filter((r) => r.estado === 'confirmada')
  const fechasReservadas = new Set(activas.map((r) => r.fecha))
  const reservaDelDia = activas.find((r) => r.fecha === fecha)

  return (
    <div className="animate-aparecer space-y-6">
      <Encabezado
        antetitulo="Paso 1 de 3 · Elige tu almuerzo"
        titulo="Menú y reserva"
        descripcion={`Elige una fecha, revisa los menús y reserva tu almuerzo antes de las ${HORA_CIERRE_TEXTO} de ese día.`}
      />

      <SelectorFecha fecha={fecha} onCambiar={cambiarFecha} ahora={ahora} fechasReservadas={fechasReservadas} />

      {/* key={fecha}: al cambiar de día, la selección parte de nuevo */}
      <MenusDelDia key={fecha} fecha={fecha} ahora={ahora} reserva={reservaDelDia} onIrAFecha={cambiarFecha} />
    </div>
  )
}

function MenusDelDia({ fecha, ahora, reserva, onIrAFecha }) {
  const navigate = useNavigate()
  const grilla = useRef(null)
  const menus = menusDelDia(fecha)
  const abierta = estaAbierta(fecha, ahora)
  const restante = cierreDe(fecha) - ahora
  const menuReservado = reserva ? buscarMenu(reserva.menuId) : null

  // Por defecto, aparece seleccionado el menú que ya reservaste
  const [seleccion, setSeleccion] = useState(reserva?.menuId ?? null)
  const menuSeleccionado = menus.find((m) => m.id === seleccion)
  const esCambio = Boolean(reserva) && seleccion !== reserva.menuId

  const reservar = () => {
    const query = new URLSearchParams({ fecha, menu: seleccion })
    navigate(`confirmar?${query}`)
  }

  const irAModificar = () => {
    grilla.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* Estado del día */}
      <h2 className="sr-only">Menús del {fechaLarga(fecha)}</h2>
      <EstadoDelDia
        fecha={fecha}
        ahora={ahora}
        abierta={abierta}
        restante={restante}
        reserva={reserva}
        menuReservado={menuReservado}
        onModificar={irAModificar}
        onIrAFecha={onIrAFecha}
        navigate={navigate}
      />

      {/* Tarjetas de menú */}
      <div ref={grilla} className="grid scroll-mt-24 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {menus.map((menu) => (
          <TarjetaMenu
            key={menu.id}
            menu={menu}
            seleccionado={seleccion === menu.id}
            reservado={menuReservado?.id === menu.id}
            deshabilitado={!abierta}
            onSeleccionar={setSeleccion}
          />
        ))}
      </div>

      {/* Barra de acción */}
      <div className="sticky bottom-4 z-20">
        <div className="flex items-center gap-3 rounded-2xl border border-marfil-300 bg-white/95 p-2.5 pl-4 shadow-flotante backdrop-blur sm:p-3 sm:pl-5">
          <div className="min-w-0 flex-1 text-sm" aria-live="polite">
            {!abierta ? (
              <p className="flex items-center gap-2 font-semibold text-tinta-suave">
                <Lock className="size-4 shrink-0" aria-hidden="true" />
                <span>
                  Plazo cerrado<span className="hidden sm:inline">: ya no se puede reservar para este día</span>
                </span>
              </p>
            ) : menuSeleccionado ? (
              <>
                <p className="text-xs font-semibold tracking-wide text-tinta-suave uppercase">
                  {esCambio ? 'Cambiar a' : reserva ? 'Tu reserva actual' : 'Seleccionado · falta confirmar'}
                </p>
                <p className="truncate font-bold">
                  {menuSeleccionado.nombre}
                  <span className="hidden font-semibold text-tinta-suave sm:inline"> · {capitalizar(fechaRelativa(fecha, ahora))}</span>
                </p>
              </>
            ) : (
              <p className="font-semibold text-tinta-suave">
                Elige un menú <span className="hidden sm:inline">para continuar</span> 👆
              </p>
            )}
          </div>
          {abierta && reserva && !esCambio ? (
            <Boton variante="suave" icono={CircleCheck} disabled>
              Ya reservado
            </Boton>
          ) : (
            <Boton iconoDerecha={ArrowRight} onClick={reservar} disabled={!abierta || !seleccion}>
              {esCambio ? 'Cambiar reserva' : 'Reservar almuerzo'}
            </Boton>
          )}
        </div>
      </div>
    </>
  )
}

function EstadoDelDia({ fecha, ahora, abierta, restante, reserva, menuReservado, onModificar, onIrAFecha, navigate }) {
  const cuando = fechaRelativa(fecha, ahora)
  const cuandoTexto = cuando === 'hoy' || cuando === 'mañana' || cuando === 'ayer' ? cuando : `el ${fechaLarga(fecha)}`

  // Abierto y ya reservado
  if (abierta && reserva) {
    return (
      <Aviso tono="verde" icono={CircleCheck}>
        <p className="font-bold">Ya reservaste {menuReservado?.nombre} para este día.</p>
        <p className="mt-0.5">
          Puedes cambiarlo o cancelarlo hasta {cuandoTexto} a las {HORA_CIERRE_TEXTO} (faltan {textoRestante(restante)}).
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Boton tamano="sm" icono={QrCode} onClick={() => navigate(`/estudiantes/qr?id=${reserva.id}`)}>
            Ver mi reserva
          </Boton>
          <Boton tamano="sm" variante="secundario" icono={Pencil} onClick={onModificar}>
            Modificar reserva
          </Boton>
        </div>
      </Aviso>
    )
  }

  // Abierto sin reserva
  if (abierta) {
    return (
      <Aviso tono="neutro" icono={CalendarClock}>
        <p>
          <span className="font-bold">Reservas abiertas.</span> Cierran {cuandoTexto} a las {HORA_CIERRE_TEXTO}{' '}
          <span className="font-semibold text-verde-700">(faltan {textoRestante(restante)})</span>.
        </p>
      </Aviso>
    )
  }

  // Cerrado con reserva
  if (reserva) {
    return (
      <Aviso tono="miel" icono={Lock}>
        <p className="font-bold">Reservas cerradas para este día.</p>
        <p className="mt-0.5">
          Tu almuerzo <strong>{menuReservado?.nombre}</strong> está confirmado y el casino ya lo está preparando.
        </p>
        <div className="mt-3">
          <Boton tamano="sm" icono={QrCode} onClick={() => navigate(`/estudiantes/qr?id=${reserva.id}`)}>
            Ver mi código QR
          </Boton>
        </div>
      </Aviso>
    )
  }

  // Cerrado sin reserva
  return (
    <Aviso tono="cerrado" icono={Lock}>
      <p className="font-bold">Reservas cerradas para este día.</p>
      <p className="mt-0.5">
        Cerraron {cuandoTexto} a las {HORA_CIERRE_TEXTO}: a esa hora el casino cierra la lista y cocina solo las
        raciones reservadas.
      </p>
      <div className="mt-3">
        <Boton tamano="sm" variante="secundario" iconoDerecha={ArrowRight} onClick={() => onIrAFecha(primerDiaAbierto(ahora))}>
          Ir al próximo día disponible
        </Boton>
      </div>
    </Aviso>
  )
}

const TONOS_AVISO = {
  verde: 'border-verde-200 bg-verde-50 text-verde-900',
  miel: 'border-miel-100 bg-miel-50 text-miel-800',
  neutro: 'border-marfil-300 bg-white text-tinta',
  cerrado: 'border-marfil-300 bg-marfil-200/70 text-tinta',
}

function Aviso({ tono, icono: Icono, children }) {
  return (
    <div className={`flex gap-3 rounded-2xl border p-4 text-sm sm:text-[15px] ${TONOS_AVISO[tono]}`}>
      <Icono className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
