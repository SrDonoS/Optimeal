// 🔔 Avisos flotantes ("toasts")
// Uso: const { avisar } = useAvisos();  avisar('Reserva cancelada', 'arcilla')

import { CircleCheck, Info, X } from 'lucide-react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AvisosContext = createContext(null)

const TONOS = {
  verde: 'bg-verde-800 text-white',
  arcilla: 'bg-arcilla-700 text-white',
  neutro: 'bg-tinta text-white',
}

export function AvisosProvider({ children }) {
  const [avisos, setAvisos] = useState([])

  const quitar = useCallback((id) => setAvisos((prev) => prev.filter((a) => a.id !== id)), [])

  const avisar = useCallback(
    (texto, tono = 'verde') => {
      const id = Math.random().toString(36).slice(2)
      setAvisos((prev) => [...prev.slice(-2), { id, texto, tono }])
      setTimeout(() => quitar(id), 4000)
    },
    [quitar],
  )

  const valor = useMemo(() => ({ avisar }), [avisar])

  return (
    <AvisosContext.Provider value={valor}>
      {children}
      <div
        data-no-imprimir
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
        role="status"
        aria-live="polite"
      >
        {avisos.map((a) => {
          const Icono = a.tono === 'verde' ? CircleCheck : Info
          return (
            <div
              key={a.id}
              className={`pointer-events-auto flex max-w-md animate-aparecer items-center gap-3 rounded-2xl py-3 pr-2 pl-4 text-sm font-semibold shadow-flotante ${TONOS[a.tono] ?? TONOS.neutro}`}
            >
              <Icono className="size-5 shrink-0" aria-hidden="true" />
              <span className="flex-1">{a.texto}</span>
              <button
                type="button"
                onClick={() => quitar(a.id)}
                className="grid size-7 cursor-pointer place-items-center rounded-lg hover:bg-white/15"
                aria-label="Cerrar aviso"
              >
                <X className="size-4" />
              </button>
            </div>
          )
        })}
      </div>
    </AvisosContext.Provider>
  )
}

export function useAvisos() {
  const ctx = useContext(AvisosContext)
  if (!ctx) throw new Error('useAvisos debe usarse dentro de <AvisosProvider>')
  return ctx
}
