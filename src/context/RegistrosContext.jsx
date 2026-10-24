// 🗑️ Registros de desperdicio guardados desde la app + metas de reducción
//
// Los registros ficticios se generan en src/data/desperdicio.js. Aquí solo
// guardamos lo que el usuario registra en "Registro de desperdicio" (y la meta
// de cada colegio), en el navegador.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { guardar, leer } from '../utils/storage'

const RegistrosContext = createContext(null)

export const META_POR_DEFECTO = 0.5 // reducir 50 % los kilos desperdiciados
export const OPCIONES_META = [0.3, 0.4, 0.5, 0.6]

const esRegistroValido = (r) => r && r.id && r.establecimientoId && r.fecha && r.menuId && typeof r.kilos === 'number'

export function RegistrosProvider({ children }) {
  const [registros, setRegistrosState] = useState(() => {
    const guardados = leer('registrosDesperdicio', [])
    return Array.isArray(guardados) ? guardados.filter(esRegistroValido) : []
  })
  const [metas, setMetasState] = useState(() => {
    const guardadas = leer('metas', {})
    return guardadas && typeof guardadas === 'object' && !Array.isArray(guardadas) ? guardadas : {}
  })
  const actuales = useRef(registros)

  // Sincroniza si otra pestaña guarda un registro
  useEffect(() => {
    const alCambiar = (e) => {
      if (e.key === 'optimeal:registrosDesperdicio') {
        const nuevos = leer('registrosDesperdicio', [])
        if (Array.isArray(nuevos)) {
          actuales.current = nuevos
          setRegistrosState(nuevos)
        }
      }
      if (e.key === 'optimeal:metas') setMetasState(leer('metas', {}))
    }
    window.addEventListener('storage', alCambiar)
    return () => window.removeEventListener('storage', alCambiar)
  }, [])

  // Guarda un registro. Si ya había uno para el mismo colegio, día y menú, lo reemplaza.
  const guardarRegistro = useCallback((datos) => {
    const registro = {
      ...datos,
      id: `app|${Date.now().toString(36)}|${Math.random().toString(36).slice(2, 6)}`,
      origen: 'app',
      creado: new Date().toISOString(),
    }
    const nuevos = [
      ...actuales.current.filter(
        (r) => !(r.establecimientoId === datos.establecimientoId && r.fecha === datos.fecha && r.menuId === datos.menuId),
      ),
      registro,
    ]
    actuales.current = nuevos
    setRegistrosState(nuevos)
    guardar('registrosDesperdicio', nuevos)
    return registro
  }, [])

  const metaDe = useCallback((estId) => metas[estId] ?? META_POR_DEFECTO, [metas])

  const cambiarMeta = useCallback((estId, valor) => {
    setMetasState((prev) => {
      const nuevas = { ...prev, [estId]: valor }
      guardar('metas', nuevas)
      return nuevas
    })
  }, [])

  const valor = useMemo(
    () => ({ registros, guardarRegistro, metaDe, cambiarMeta }),
    [registros, guardarRegistro, metaDe, cambiarMeta],
  )
  return <RegistrosContext.Provider value={valor}>{children}</RegistrosContext.Provider>
}

export function useRegistros() {
  const ctx = useContext(RegistrosContext)
  if (!ctx) throw new Error('useRegistros debe usarse dentro de <RegistrosProvider>')
  return ctx
}
