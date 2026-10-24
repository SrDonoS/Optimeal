// 🛟 Pantalla de rescate
// Si alguna pantalla falla, React normalmente deja la página EN BLANCO.
// Este componente "atrapa" el error y muestra qué pasó, con botones para
// reintentar o reiniciar la demo. Así nunca nos quedamos en blanco frente
// al jurado, y si pasa algo, sabemos exactamente qué error fue.

import { Component } from 'react'
import { borrarTodo } from '../utils/storage'

export default class RescateErrores extends Component {
  state = { error: null, detalle: '', copiado: false }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    this.setState({ detalle: info?.componentStack ?? '' })
    console.error('[Optimeal] Error atrapado por la pantalla de rescate:', error)
  }

  reintentar = () => this.setState({ error: null, detalle: '', copiado: false })

  reiniciarDemo = () => {
    borrarTodo()
    window.location.assign(window.location.pathname + '#/')
    window.location.reload()
  }

  copiar = async () => {
    const texto = `${this.state.error}\n${this.state.detalle}`
    try {
      await navigator.clipboard.writeText(texto)
      this.setState({ copiado: true })
    } catch {
      /* el navegador no permitió copiar */
    }
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <main className="grid min-h-dvh place-items-center bg-marfil-100 px-4 py-12">
        <div className="w-full max-w-lg rounded-3xl border border-marfil-300 bg-marfil-50 p-6 shadow-flotante sm:p-8">
          <p className="text-4xl" aria-hidden="true">
            🛟
          </p>
          <h1 className="mt-3 font-display text-2xl font-semibold text-verde-900">
            Ups, algo falló en esta pantalla
          </h1>
          <p className="mt-2 text-tinta-suave">
            No te preocupes: puedes reintentar o reiniciar la demo. Si se repite, copia el error y
            compártelo para arreglarlo.
          </p>

          <pre className="mt-5 max-h-48 overflow-auto rounded-2xl bg-white p-4 text-xs leading-relaxed whitespace-pre-wrap text-arcilla-700 ring-1 ring-marfil-300">
            {String(this.state.error)}
            {this.state.detalle && `\n${this.state.detalle.trim().split('\n').slice(0, 6).join('\n')}`}
          </pre>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={this.reintentar}
              className="h-11 flex-1 cursor-pointer rounded-2xl bg-verde-600 px-5 font-semibold text-white shadow-boton hover:bg-verde-700"
            >
              Reintentar
            </button>
            <button
              type="button"
              onClick={this.reiniciarDemo}
              className="h-11 flex-1 cursor-pointer rounded-2xl border border-marfil-300 bg-white px-5 font-semibold hover:border-marfil-400"
            >
              Reiniciar demo
            </button>
          </div>
          <button
            type="button"
            onClick={this.copiar}
            className="mt-3 w-full cursor-pointer rounded-xl py-2 text-sm font-semibold text-verde-700 hover:bg-verde-50"
          >
            {this.state.copiado ? '✓ Error copiado' : 'Copiar el error'}
          </button>
        </div>
      </main>
    )
  }
}
