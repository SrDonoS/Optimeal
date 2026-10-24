// 🕒 Reloj de la app (con "hora simulada" para la demo)
//
// Toda la app pregunta la hora con useAhora() en vez de usar new Date().
// Así, en la presentación podemos "adelantar el reloj" y mostrar cómo se ve
// una reserva justo antes y justo después del cierre, sin esperar horas.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { guardar, leer } from '../utils/storage'

const RelojContext = createContext(null)

export function RelojProvider({ children }) {
  // Diferencia (en milisegundos) entre la hora simulada y la real. 0 = hora real.
  const [desfase, setDesfaseState] = useState(() => Number(leer('relojDesfase', 0)) || 0)

  const setDesfase = useCallback((ms) => {
    setDesfaseState(ms)
    guardar('relojDesfase', ms)
  }, [])

  const simularHora = useCallback((fecha) => setDesfase(fecha.getTime() - Date.now()), [setDesfase])
  const volverHoraReal = useCallback(() => setDesfase(0), [setDesfase])

  const valor = useMemo(
    () => ({ desfase, simularHora, volverHoraReal, simulada: desfase !== 0 }),
    [desfase, simularHora, volverHoraReal],
  )

  return <RelojContext.Provider value={valor}>{children}</RelojContext.Provider>
}

export function useReloj() {
  const ctx = useContext(RelojContext)
  if (!ctx) throw new Error('useReloj debe usarse dentro de <RelojProvider>')
  return ctx
}

// Devuelve la hora actual (real o simulada) y se actualiza sola cada segundo.
export function useAhora(intervaloMs = 1000) {
  const { desfase } = useReloj()
  const [, setTic] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTic((t) => t + 1), intervaloMs)
    return () => clearInterval(id)
  }, [intervaloMs])

  return new Date(Date.now() + desfase)
}
