// 🔑 Login SIMULADO
// Pide correo y contraseña como un login real, pero cualquier dato con
// formato válido te deja entrar. Ideal para mostrar el flujo en la demo.

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Info,
  Lock,
  Mail,
  School,
  Wand2,
} from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import Boton from '../components/ui/Boton'
import Campo from '../components/ui/Campo'
import Logo from '../components/Logo'
import Plato from '../components/ilustraciones/Plato'
import { useSesion } from '../context/SesionContext'
import { AREAS, LISTA_AREAS } from '../data/areas'
import { ESTABLECIMIENTOS } from '../data/establecimientos'
import { pareceCorreo } from '../utils/texto'

// Color del panel izquierdo según el área
const PANEL = {
  estudiantes: 'bg-verde-800',
  casino: 'bg-miel-800',
  admin: 'bg-laguna-800',
}

const ETIQUETA_TAB = {
  estudiantes: 'Estudiante',
  casino: 'Casino',
  admin: 'Administración',
}

export default function Login() {
  const { area: areaId } = useParams()
  const area = AREAS[areaId]

  if (!area) return <Navigate to="/" replace />

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      <PanelMarca area={area} />

      <main className="flex flex-col px-4 py-6 sm:px-8 lg:px-12">
        {/* Encabezado móvil */}
        <div className="flex items-center justify-between lg:justify-end">
          <Link to="/" className="rounded-xl lg:hidden" aria-label="Optimeal, volver al inicio">
            <Logo tamano="sm" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-tinta-suave hover:bg-marfil-200 hover:text-tinta"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Volver al inicio
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          {/* Selector de área */}
          <nav aria-label="Elegir área" className="grid grid-cols-3 gap-1 rounded-2xl bg-marfil-200 p-1">
            {LISTA_AREAS.map((a) => (
              <NavLink
                key={a.id}
                to={`/login/${a.id}`}
                replace
                className={({ isActive }) =>
                  `rounded-xl px-2 py-2.5 text-center text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-white text-verde-800 shadow-suave'
                      : 'text-tinta-suave hover:bg-marfil-100 hover:text-tinta'
                  }`
                }
              >
                {ETIQUETA_TAB[a.id]}
              </NavLink>
            ))}
          </nav>

          {/* key={area.id}: al cambiar de área, el formulario parte limpio */}
          <FormularioLogin key={area.id} area={area} />
        </div>
      </main>
    </div>
  )
}

function FormularioLogin({ area }) {
  const { sesiones, iniciarSesion } = useSesion()
  const navigate = useNavigate()
  const location = useLocation()

  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [establecimientoId, setEstablecimientoId] = useState(ESTABLECIMIENTOS[0].id)
  const [verClave, setVerClave] = useState(false)
  const [errores, setErrores] = useState({})
  const [cargando, setCargando] = useState(false)
  const [avisoClave, setAvisoClave] = useState(false)

  const sesionActiva = sesiones[area.id]
  const destino = location.state?.desde?.startsWith(area.ruta) ? location.state.desde : area.ruta

  const usarDemo = () => {
    setCorreo(area.correoDemo)
    setClave('demo1234')
    setErrores({})
  }

  const enviar = (e) => {
    e.preventDefault()
    const nuevos = {}
    if (!correo.trim()) nuevos.correo = 'Escribe tu correo.'
    else if (!pareceCorreo(correo)) nuevos.correo = 'Ese correo no parece válido. Ejemplo: nombre@colegio.cl'
    if (!clave) nuevos.clave = 'Escribe una contraseña (cualquiera sirve 😉).'
    setErrores(nuevos)
    if (Object.keys(nuevos).length) return

    // Simulamos que "consultamos al servidor" por un momento
    setCargando(true)
    setTimeout(() => {
      iniciarSesion(area.id, {
        correo,
        establecimientoId: area.pideEstablecimiento ? establecimientoId : null,
      })
      navigate(destino, { replace: true })
    }, 650)
  }

  const etiquetaEstablecimiento = area.id === 'estudiantes' ? 'Tu colegio' : 'Casino donde trabajas'

  return (
    <div className="mt-8 animate-aparecer">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-verde-900 sm:text-4xl">
        Inicia sesión
      </h1>
      <p className="mt-2 text-tinta-suave">
        Ingresa al <strong className="font-semibold text-tinta">{area.titulo}</strong> con tu correo.
      </p>

      {sesionActiva && (
        <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-verde-200 bg-verde-50 p-4">
          <p className="text-sm text-verde-900">
            Ya tienes una sesión activa como <strong>{sesionActiva.nombre}</strong>.
          </p>
          <Boton to={area.ruta} tamano="sm" iconoDerecha={ArrowRight}>
            Continuar
          </Boton>
        </div>
      )}

      {/* Aviso de modo prototipo */}
      <div className="mt-6 rounded-2xl border border-miel-100 bg-miel-50 p-4">
        <div className="flex gap-3">
          <Info className="mt-0.5 size-5 shrink-0 text-miel-600" aria-hidden="true" />
          <div className="text-sm text-miel-800">
            <p className="font-semibold">Modo prototipo</p>
            <p className="mt-0.5">Cualquier correo y contraseña te dejan entrar.</p>
            <button
              type="button"
              onClick={usarDemo}
              className="mt-2 inline-flex cursor-pointer items-center gap-1.5 font-semibold text-miel-800 underline decoration-miel-400 decoration-2 underline-offset-4 hover:decoration-miel-800"
            >
              <Wand2 className="size-4" aria-hidden="true" />
              Usar cuenta de demostración
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={enviar} noValidate className="mt-6 space-y-5">
        <Campo
          etiqueta="Correo"
          type="email"
          icono={Mail}
          placeholder="nombre@colegio.cl"
          autoComplete="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          error={errores.correo}
        />

        <Campo
          etiqueta="Contraseña"
          type={verClave ? 'text' : 'password'}
          icono={Lock}
          placeholder="••••••••"
          autoComplete="current-password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          error={errores.clave}
          accesorio={
            <button
              type="button"
              onClick={() => setVerClave((v) => !v)}
              className="grid size-9 cursor-pointer place-items-center rounded-xl text-tinta-suave hover:bg-marfil-200 hover:text-tinta"
              aria-label={verClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              aria-pressed={verClave}
            >
              {verClave ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
            </button>
          }
        />

        {area.pideEstablecimiento && (
          <Campo
            etiqueta={etiquetaEstablecimiento}
            icono={School}
            value={establecimientoId}
            onChange={(e) => setEstablecimientoId(e.target.value)}
          >
            {ESTABLECIMIENTOS.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre} · {e.comuna}
              </option>
            ))}
          </Campo>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <label className="inline-flex cursor-pointer items-center gap-2 font-medium text-tinta">
            <input
              type="checkbox"
              defaultChecked
              className="size-4.5 cursor-pointer rounded accent-verde-600"
            />
            Recordarme
          </label>
          <button
            type="button"
            onClick={() => setAvisoClave(true)}
            className="cursor-pointer rounded-lg font-semibold text-verde-700 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        {avisoClave && (
          <p className="-mt-2 rounded-xl bg-marfil-200 px-3 py-2 text-sm text-tinta-suave" role="status">
            En el prototipo no hace falta: cualquier contraseña funciona 😉
          </p>
        )}

        <Boton type="submit" tamano="lg" bloque cargando={cargando}>
          {cargando ? 'Ingresando…' : 'Ingresar'}
        </Boton>
      </form>
    </div>
  )
}

// Panel izquierdo con la identidad del área (se oculta en móvil)
function PanelMarca({ area }) {
  const Icono = area.icono
  return (
    <aside
      className={`relative hidden overflow-hidden ${PANEL[area.id]} p-10 text-marfil-50 transition-colors duration-500 lg:flex lg:flex-col xl:p-14`}
    >
      {/* textura de puntos */}
      <div
        className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#fbf8f1_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />
      <Plato className="absolute -right-24 -bottom-24 size-[26rem] opacity-25" />

      <Link to="/" className="relative w-fit rounded-xl" aria-label="Optimeal, volver al inicio">
        <Logo claro />
      </Link>

      <div className="relative mt-auto mb-auto max-w-md pt-12">
        <span className="grid size-14 place-items-center rounded-2xl bg-white/12 ring-1 ring-white/20">
          <Icono className="size-7" aria-hidden="true" />
        </span>
        <p className="mt-6 text-sm font-semibold tracking-wider text-marfil-200 uppercase">{area.nombre}</p>
        <h2 className="mt-2 font-display text-4xl leading-tight font-semibold xl:text-5xl">{area.titulo}</h2>
        <p className="mt-4 text-lg leading-relaxed text-marfil-200">{area.resumen}</p>
        <ul className="mt-8 space-y-3">
          {area.beneficios.map((b) => (
            <li key={b} className="flex items-center gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/15">
                <Check className="size-3.5" aria-hidden="true" />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-sm text-marfil-200">Planifica mejor. Desperdicia menos.</p>
    </aside>
  )
}
