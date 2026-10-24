// 🧾 Reservas de almuerzo
//
// Guarda todas las reservas en el navegador (localStorage). Cada reserva:
//   { id, codigo, correo, nombre, establecimientoId, fecha, menuId,
//     estado: 'confirmada' | 'cancelada', creada, actualizada }
//
// Además, la primera vez que entra un estudiante le creamos algunas
// reservas de ejemplo (pasadas y futuras) para que la demo tenga contenido.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { aISO, diaHabil, esFinDeSemana, estaAbierta } from '../utils/fechas'
import { guardar, leer } from '../utils/storage'
import { useSesion } from './SesionContext'

const ReservasContext = createContext(null)

// Estados que ve el estudiante (se calculan según la hora)
export const ESTADOS = {
  confirmada: { etiqueta: 'Confirmada', tono: 'verde' },
  cerrada: { etiqueta: 'Lista para retirar', tono: 'miel' },
  retirada: { etiqueta: 'Retirada', tono: 'neutro' },
  cancelada: { etiqueta: 'Cancelada', tono: 'arcilla' },
}

export function estadoReserva(reserva, ahora) {
  if (reserva.estado === 'cancelada') return 'cancelada'
  if (reserva.fecha < aISO(ahora)) return 'retirada'
  return estaAbierta(reserva.fecha, ahora) ? 'confirmada' : 'cerrada'
}

// ¿Se puede modificar o cancelar todavía?
export const esEditable = (reserva, ahora) => estadoReserva(reserva, ahora) === 'confirmada'

const LETRAS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
function nuevoCodigo() {
  let c = ''
  for (let i = 0; i < 5; i++) c += LETRAS[Math.floor(Math.random() * LETRAS.length)]
  return `OPT-${c}`
}
const nuevoId = () => `r_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`

// Reservas de ejemplo para un estudiante nuevo
function crearSemillas({ correo, nombre, establecimientoId }) {
  const hoy = new Date()
  const base = { correo, nombre, establecimientoId, creada: hoy.toISOString(), actualizada: hoy.toISOString() }
  const dia = (n) => aISO(diaHabil(hoy, n))
  const semillas = [
    { fecha: dia(-3), tipo: 'liviano', estado: 'cancelada' },
    { fecha: dia(-2), tipo: 'tradicional', estado: 'confirmada' },
    { fecha: dia(-1), tipo: 'vegetariano', estado: 'confirmada' },
    { fecha: dia(2), tipo: 'tradicional', estado: 'confirmada' },
  ]
  // Si hoy hay clases, también una reserva para hoy
  if (!esFinDeSemana(hoy)) semillas.push({ fecha: aISO(hoy), tipo: 'liviano', estado: 'confirmada' })

  return semillas.map((s) => ({
    ...base,
    id: nuevoId(),
    codigo: nuevoCodigo(),
    fecha: s.fecha,
    menuId: `${s.fecha}:${s.tipo}`,
    estado: s.estado,
  }))
}

export function ReservasProvider({ children }) {
  const { sesiones } = useSesion()
  const [reservas, setReservasState] = useState(() => {
    const guardadas = leer('reservas', [])
    return Array.isArray(guardadas) ? guardadas.filter((r) => r && r.id && r.fecha && r.menuId) : []
  })
  // Copia siempre al día de las reservas (para calcular cambios al instante)
  const actuales = useRef(reservas)

  // Aplica una nueva lista de reservas y la guarda en el navegador
  const aplicar = useCallback((nuevas) => {
    actuales.current = nuevas
    setReservasState(nuevas)
    guardar('reservas', nuevas)
  }, [])

  // 🔄 Si otra pestaña cambia las reservas (ej: un estudiante reserva mientras
  // el casino mira la demanda), actualizamos esta pestaña al instante.
  useEffect(() => {
    const alCambiar = (e) => {
      if (e.key !== 'optimeal:reservas') return
      const nuevas = leer('reservas', [])
      if (Array.isArray(nuevas)) {
        actuales.current = nuevas
        setReservasState(nuevas)
      }
    }
    window.addEventListener('storage', alCambiar)
    return () => window.removeEventListener('storage', alCambiar)
  }, [])

  // Semillas para el estudiante que acaba de entrar (solo la primera vez)
  const estudiante = sesiones.estudiantes
  useEffect(() => {
    if (!estudiante) return
    if (actuales.current.some((r) => r.correo === estudiante.correo)) return
    aplicar([...actuales.current, ...crearSemillas(estudiante)])
  }, [estudiante, aplicar])

  // Crea una reserva o, si ya existía una activa ese día, la modifica.
  // Devuelve la reserva resultante.
  const reservar = useCallback(
    ({ correo, nombre, establecimientoId, fecha, menuId }) => {
      const ahoraISO = new Date().toISOString()
      const lista = actuales.current
      const existente = lista.find((r) => r.correo === correo && r.fecha === fecha && r.estado === 'confirmada')
      if (existente) {
        const modificada = { ...existente, menuId, actualizada: ahoraISO, modificada: true }
        aplicar(lista.map((r) => (r.id === existente.id ? modificada : r)))
        return modificada
      }
      const nueva = {
        id: nuevoId(),
        codigo: nuevoCodigo(),
        correo,
        nombre,
        establecimientoId,
        fecha,
        menuId,
        estado: 'confirmada',
        creada: ahoraISO,
        actualizada: ahoraISO,
      }
      aplicar([...lista, nueva])
      return nueva
    },
    [aplicar],
  )

  const cancelar = useCallback(
    (id) =>
      aplicar(
        actuales.current.map((r) =>
          r.id === id ? { ...r, estado: 'cancelada', actualizada: new Date().toISOString() } : r,
        ),
      ),
    [aplicar],
  )

  const valor = useMemo(() => ({ reservas, reservar, cancelar }), [reservas, reservar, cancelar])
  return <ReservasContext.Provider value={valor}>{children}</ReservasContext.Provider>
}

export function useReservas() {
  const ctx = useContext(ReservasContext)
  if (!ctx) throw new Error('useReservas debe usarse dentro de <ReservasProvider>')
  return ctx
}

// Reservas del estudiante con sesión iniciada, ordenadas por fecha
export function useMisReservas() {
  const { reservas, reservar, cancelar } = useReservas()
  const { sesiones } = useSesion()
  const estudiante = sesiones.estudiantes
  const mias = useMemo(
    () =>
      estudiante
        ? reservas.filter((r) => r.correo === estudiante.correo).sort((a, b) => a.fecha.localeCompare(b.fecha))
        : [],
    [reservas, estudiante],
  )
  return { mias, estudiante, reservar, cancelar }
}
