// 🤷 Página 404

import { ArrowLeft } from 'lucide-react'
import Boton from '../components/ui/Boton'
import Plato from '../components/ilustraciones/Plato'

export default function NoEncontrado() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12 text-center">
      <div className="max-w-md animate-aparecer">
        <Plato variante="vegetal" className="mx-auto size-40" />
        <h1 className="mt-6 font-display text-3xl font-semibold text-verde-900">
          Este plato no está en el menú
        </h1>
        <p className="mt-2 text-tinta-suave">La página que buscas no existe o cambió de lugar.</p>
        <Boton to="/" icono={ArrowLeft} className="mt-6">
          Volver al inicio
        </Boton>
      </div>
    </main>
  )
}
