// 🔐 Sesión SIMULADA
// No hay seguridad real: cualquier correo con formato válido y cualquier
// contraseña permiten entrar. Guardamos una sesión por área, así durante la
// demo puedes saltar entre Estudiantes, Casino y Administración sin volver
// a iniciar sesión.

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { ESTABLECIMIENTOS } from '../data/establecimientos'
import { guardar, leer } from '../utils/storage'
import { nombreDesdeCorreo } from '../utils/texto'

const SesionContext = createContext(null)

export function SesionProvider({ children }) {
  // { estudiantes: {...}, casino: {...}, admin: {...} }
  const [sesiones, setSesiones] = useState(() => {
    // Solo aceptamos sesiones con el formato correcto (por si quedó algo raro guardado)
    const guardadas = leer('sesiones', {})
    if (!guardadas || typeof guardadas !== 'object' || Array.isArray(guardadas)) return {}
    return Object.fromEntries(
      Object.entries(guardadas).filter(
        ([, s]) => s && typeof s.correo === 'string' && typeof s.nombre === 'string',
      ),
    )
  })

  // Establecimiento activo para los paneles de Casino y Administración
  const [establecimientoActivoId, setEstablecimientoActivoIdState] = useState(() =>
    leer('establecimientoActivo', ESTABLECIMIENTOS[0].id),
  )

  const setEstablecimientoActivoId = useCallback((id) => {
    setEstablecimientoActivoIdState(id)
    guardar('establecimientoActivo', id)
  }, [])

  const iniciarSesion = useCallback(
    (area, { correo, establecimientoId }) => {
      const sesion = {
        correo: correo.trim().toLowerCase(),
        nombre: nombreDesdeCorreo(correo.trim()),
        establecimientoId: establecimientoId ?? null,
        inicio: new Date().toISOString(),
      }
      setSesiones((prev) => {
        const nuevas = { ...prev, [area]: sesion }
        guardar('sesiones', nuevas)
        return nuevas
      })
      // El personal del casino entra directo a su establecimiento
      if (establecimientoId && area === 'casino') setEstablecimientoActivoId(establecimientoId)
    },
    [setEstablecimientoActivoId],
  )

  const cerrarSesion = useCallback((area) => {
    setSesiones((prev) => {
      const nuevas = { ...prev }
      delete nuevas[area]
      guardar('sesiones', nuevas)
      return nuevas
    })
  }, [])

  const valor = useMemo(
    () => ({
      sesiones,
      iniciarSesion,
      cerrarSesion,
      establecimientoActivoId,
      setEstablecimientoActivoId,
    }),
    [sesiones, iniciarSesion, cerrarSesion, establecimientoActivoId, setEstablecimientoActivoId],
  )

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>
}

export function useSesion() {
  const ctx = useContext(SesionContext)
  if (!ctx) throw new Error('useSesion debe usarse dentro de <SesionProvider>')
  return ctx
}
