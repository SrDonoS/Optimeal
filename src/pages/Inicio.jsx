// 🏠 Pantalla de Inicio y acceso
// Muestra la marca, el mensaje principal y los accesos a las 3 áreas.

import {
  ArrowRight,
  CalendarCheck,
  Check,
  ChefHat,
  Clock,
  RotateCcw,
  Sprout,
  TrendingDown,
} from 'lucide-react'
import Boton from '../components/ui/Boton'
import Insignia from '../components/ui/Insignia'
import Tarjeta from '../components/ui/Tarjeta'
import Logo from '../components/Logo'
import Plato from '../components/ilustraciones/Plato'
import { useSesion } from '../context/SesionContext'
import { LISTA_AREAS, TONOS } from '../data/areas'
import { resumenPiloto } from '../data/desperdicio'
import { ESTABLECIMIENTOS } from '../data/establecimientos'
import { pesosCorto, porcentaje } from '../utils/formato'
import { borrarTodo } from '../utils/storage'

const PASOS = [
  {
    icono: CalendarCheck,
    titulo: 'El estudiante reserva',
    texto: 'Elige su menú para una fecha y confirma antes de la hora de cierre. Recibe un QR para retirar.',
  },
  {
    icono: ChefHat,
    titulo: 'El casino sabe cuánto cocinar',
    texto: 'Reservas confirmadas + historial = raciones justas, con su lista de preparación lista.',
  },
  {
    icono: Sprout,
    titulo: 'Administración mide el impacto',
    texto: 'Kilos desperdiciados, costos y avance hacia la meta, separados por colegio.',
  },
]

const racionesTotales = ESTABLECIMIENTOS.reduce((s, e) => s + e.racionesDiariasPromedio, 0)

// Las cifras salen de los mismos datos ficticios que usan los paneles
const PILOTO = resumenPiloto()
const REDUCCION = PILOTO.reduccion != null ? `−${porcentaje(PILOTO.reduccion)}` : '—'

const CIFRAS = [
  { valor: ESTABLECIMIENTOS.length, etiqueta: 'colegios en el piloto' },
  { valor: racionesTotales.toLocaleString('es-CL'), etiqueta: 'raciones diarias' },
  { valor: REDUCCION, etiqueta: 'kilos desperdiciados' },
  { valor: pesosCorto(PILOTO.ahorroMensual), etiqueta: 'ahorro mensual estimado' },
]

export default function Inicio() {
  const { sesiones } = useSesion()

  const reiniciarDemo = () => {
    borrarTodo()
    window.location.assign('/')
  }

  return (
    <div className="min-h-dvh overflow-x-clip">
      <button
        type="button"
        onClick={() => irASeccion('contenido')}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:shadow-flotante"
      >
        Saltar al contenido
      </button>

      {/* Barra superior */}
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <Logo />
        <nav aria-label="Secciones" className="flex items-center gap-1 sm:gap-2">
          {/* Con HashRouter, los "#ancla" se usan para rutas; por eso
              desplazamos a la sección con JavaScript. */}
          <button
            type="button"
            onClick={() => irASeccion('como-funciona')}
            className="hidden cursor-pointer rounded-xl px-3 py-2 text-sm font-semibold text-tinta-suave hover:bg-marfil-200 hover:text-tinta sm:inline-block"
          >
            Cómo funciona
          </button>
          <button
            type="button"
            onClick={() => irASeccion('areas')}
            className="hidden cursor-pointer rounded-xl px-3 py-2 text-sm font-semibold text-tinta-suave hover:bg-marfil-200 hover:text-tinta sm:inline-block"
          >
            Áreas
          </button>
          <Insignia tono="miel" className="ml-1">
            Prototipo · Demo Day
          </Insignia>
        </nav>
      </header>

      <main id="contenido" tabIndex={-1} className="outline-none">
        {/* HERO */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-6 pb-16 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8 lg:pt-12 lg:pb-24">
          <div className="animate-aparecer">
            <Insignia tono="verde" icono={Sprout}>
              Casinos escolares de Chile
            </Insignia>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] font-semibold tracking-tight text-verde-900 sm:text-6xl lg:text-[3.4rem] xl:text-[3.9rem]">
              Planifica mejor.
              <span className="block text-verde-600 italic lg:whitespace-nowrap">Desperdicia menos.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-tinta-suave">
              <strong className="font-semibold text-tinta">Optimeal</strong> permite que los
              estudiantes reserven su almuerzo con anticipación. Así, el casino conoce la demanda
              exacta, cocina las raciones justas y cuida su presupuesto.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Boton to="/login/estudiantes" tamano="lg" iconoDerecha={ArrowRight}>
                Reservar mi almuerzo
              </Boton>
              <Boton variante="secundario" tamano="lg" onClick={() => irASeccion('areas')}>
                Explorar las áreas
              </Boton>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-tinta-suave">
              {['Reserva en 3 pasos', 'Raciones justas', 'Ahorro medible'].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check className="size-4 text-verde-600" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <VisualHero />
        </section>

        {/* ÁREAS */}
        <section id="areas" tabIndex={-1} className="scroll-mt-6 outline-none border-y border-marfil-300/70 bg-marfil-50/70">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-verde-900 sm:text-4xl">
                Elige tu área
              </h2>
              <p className="mt-3 text-lg text-tinta-suave">
                Una plataforma, tres miradas. Cada área tiene su propio acceso.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {LISTA_AREAS.map((area) => {
                const tono = TONOS[area.tono]
                const sesion = sesiones[area.id]
                const Icono = area.icono
                return (
                  <Tarjeta
                    key={area.id}
                    as="article"
                    className="flex flex-col p-6 transition-shadow hover:shadow-flotante sm:p-7"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className={`grid size-13 place-items-center rounded-2xl ${tono.icono}`}>
                        <Icono className="size-6" aria-hidden="true" />
                      </span>
                      {sesion && (
                        <Insignia tono="verde">
                          <span className="size-1.5 rounded-full bg-verde-500" aria-hidden="true" />
                          Sesión activa
                        </Insignia>
                      )}
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-tinta">{area.nombre}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-tinta-suave">{area.resumen}</p>
                    <ul className="mt-5 space-y-2.5 text-[15px]">
                      {area.beneficios.map((b) => (
                        <li key={b} className="flex gap-2.5">
                          <Check className={`mt-0.5 size-4 shrink-0 ${tono.texto}`} aria-hidden="true" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-7">
                      {sesion ? (
                        <Boton to={area.ruta} bloque iconoDerecha={ArrowRight}>
                          Continuar como {sesion.nombre.split(' ')[0]}
                        </Boton>
                      ) : (
                        <Boton to={`/login/${area.id}`} bloque variante="secundario" iconoDerecha={ArrowRight}>
                          Ingresar
                        </Boton>
                      )}
                    </div>
                  </Tarjeta>
                )
              })}
            </div>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section id="como-funciona" tabIndex={-1} className="outline-none mx-auto max-w-6xl scroll-mt-6 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-verde-900 sm:text-4xl">
            Cómo funciona
          </h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
            {PASOS.map((paso, i) => {
              const Icono = paso.icono
              return (
                <li key={paso.titulo} className="relative">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-2xl bg-verde-600 text-white shadow-boton">
                      <Icono className="size-5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-bold tracking-wider text-verde-700 uppercase">
                      Paso {i + 1}
                    </span>
                    {i < PASOS.length - 1 && (
                      <span className="ml-2 hidden h-px flex-1 border-t-2 border-dashed border-verde-200 md:block" aria-hidden="true" />
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-tinta">{paso.titulo}</h3>
                  <p className="mt-1.5 leading-relaxed text-tinta-suave">{paso.texto}</p>
                </li>
              )
            })}
          </ol>

          {/* Cifras del piloto (ficticias) */}
          <div className="mt-14 rounded-3xl bg-verde-800 p-6 text-marfil-50 shadow-flotante sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-display text-xl font-semibold">Piloto Optimeal · Sabores del Sur</p>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-marfil-100 ring-1 ring-white/20">
                Cifras de ejemplo (ficticias)
              </span>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">
              {CIFRAS.map((c) => (
                <div key={c.etiqueta}>
                  <dt className="text-sm text-verde-100">{c.etiqueta}</dt>
                  <dd className="mt-1 font-display text-3xl font-semibold sm:text-4xl">{c.valor}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <footer className="border-t border-marfil-300/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-tinta-suave sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Logo tamano="sm" />
            <span>Prototipo para Demo Day · Todos los datos son ficticios.</span>
          </div>
          <Boton variante="fantasma" tamano="sm" icono={RotateCcw} onClick={reiniciarDemo}>
            Reiniciar demo
          </Boton>
        </div>
      </footer>
    </div>
  )
}

function irASeccion(id) {
  const seccion = document.getElementById(id)
  seccion?.scrollIntoView({ behavior: 'smooth' })
  seccion?.focus({ preventScroll: true })
}

// Composición visual del hero: plato ilustrado + tarjetas flotantes
function VisualHero() {
  return (
    <div className="relative mx-auto w-full max-w-md animate-aparecer [animation-delay:120ms] lg:max-w-none">
      <div className="relative aspect-square rounded-[2.5rem] bg-linear-to-br from-verde-100 via-marfil-50 to-miel-50 ring-1 ring-marfil-300/80">
        <div
          className="absolute inset-0 rounded-[2.5rem] opacity-50 [background-image:radial-gradient(var(--color-verde-200)_1px,transparent_1px)] [background-size:22px_22px]"
          aria-hidden="true"
        />
        <Plato
          variante="guiso"
          className="absolute inset-[16%] animate-flotar drop-shadow-sm"
          titulo="Ilustración de un plato con arroz, guiso y ensalada"
        />

        {/* Tarjeta: reservas */}
        <div className="absolute top-[7%] -left-2 rounded-2xl bg-white/95 p-3.5 shadow-flotante ring-1 ring-marfil-300/70 sm:-left-6 sm:p-4">
          <p className="text-xs font-semibold text-tinta-suave">Reservas para hoy</p>
          <p className="mt-0.5 font-display text-3xl font-semibold text-verde-800">412</p>
          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-miel-800">
            <Clock className="size-3.5" aria-hidden="true" /> Cierre 10:00 h
          </p>
        </div>

        {/* Tarjeta: menú */}
        <div className="absolute top-[10%] -right-1 rounded-full bg-verde-700 px-3.5 py-2 text-xs font-semibold text-white shadow-flotante sm:-right-4">
          Menú del día · Pollo arvejado
        </div>

        {/* Tarjeta: desperdicio */}
        <div className="absolute -right-1 bottom-[8%] flex items-center gap-3 rounded-2xl bg-white/95 p-3.5 shadow-flotante ring-1 ring-marfil-300/70 sm:-right-6 sm:p-4">
          <span className="grid size-10 place-items-center rounded-xl bg-verde-100 text-verde-700">
            <TrendingDown className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold text-tinta-suave">Desperdicio vs. antes</p>
            <p className="font-display text-2xl font-semibold text-verde-800">{REDUCCION}</p>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-tinta-suave">Vista de ejemplo con datos ficticios</p>
    </div>
  )
}
