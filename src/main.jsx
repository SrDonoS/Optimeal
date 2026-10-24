// Punto de entrada de la app ⚡
// Aquí se cargan las fuentes, los estilos globales, el router y los
// "contextos" (información compartida por toda la app).

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource-variable/fraunces/soft.css'
import '@fontsource-variable/fraunces/soft-italic.css'
import './index.css'
import App from './App.jsx'
import RescateErrores from './components/RescateErrores.jsx'
import { AvisosProvider } from './context/AvisosContext.jsx'
import { RegistrosProvider } from './context/RegistrosContext.jsx'
import { RelojProvider } from './context/RelojContext.jsx'
import { ReservasProvider } from './context/ReservasContext.jsx'
import { SesionProvider } from './context/SesionContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Si algo falla, mostramos el error en vez de una página en blanco */}
    <RescateErrores>
      {/* HashRouter: las rutas se ven como /#/estudiantes y funcionan
          con cualquier servidor, sin configuración extra. */}
      <HashRouter>
        <SesionProvider>
          <RelojProvider>
            <ReservasProvider>
              <RegistrosProvider>
                <AvisosProvider>
                  <App />
                </AvisosProvider>
              </RegistrosProvider>
            </ReservasProvider>
          </RelojProvider>
        </SesionProvider>
      </HashRouter>
    </RescateErrores>
  </StrictMode>,
)
