// 🗺️ Mapa de rutas de Optimeal
//
//  /                         → Inicio y acceso
//  /login/:area              → Login simulado (estudiantes | casino | admin)
//  /estudiantes/...          → Panel Estudiantes   (requiere "sesión")
//  /casino/...               → Panel del Casino    (requiere "sesión")
//  /admin/...                → Panel Administrativo (requiere "sesión")
//
// Las rutas de cada panel salen de src/data/areas.js. Cuando construyamos
// una pantalla nueva, solo hay que registrarla en PANTALLAS (abajo) y
// reemplazará automáticamente a la vista "Próximamente".

import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import RequiereSesion from './components/RequiereSesion'
import PanelLayout from './components/layout/PanelLayout'
import { LISTA_AREAS } from './data/areas'
import Inicio from './pages/Inicio'
import Login from './pages/Login'
import NoEncontrado from './pages/NoEncontrado'
import Proximamente from './pages/Proximamente'
import AhorroReduccion from './pages/admin/AhorroReduccion'
import Establecimientos from './pages/admin/Establecimientos'
import RegistroDesperdicio from './pages/admin/RegistroDesperdicio'
import DemandaDiaria from './pages/casino/DemandaDiaria'
import ListaPreparacion from './pages/casino/ListaPreparacion'
import Prediccion from './pages/casino/Prediccion'
import ConfirmacionQR from './pages/estudiantes/ConfirmacionQR'
import MenuReserva from './pages/estudiantes/MenuReserva'
import MisReservas from './pages/estudiantes/MisReservas'

// Pantallas ya construidas, con la forma 'area/ruta': Componente.
// Las que no estén aquí se muestran como "Próximamente".
const PANTALLAS = {
  // Fase 2 · Estudiantes 🎓
  'estudiantes/menu': MenuReserva,
  'estudiantes/reservas': MisReservas,
  'estudiantes/qr': ConfirmacionQR,
  // Fase 3 · Casino 👩‍🍳
  'casino/demanda': DemandaDiaria,
  'casino/prediccion': Prediccion,
  'casino/preparacion': ListaPreparacion,
  // Fase 4 · Administración 🏛️
  'admin/desperdicio': RegistroDesperdicio,
  'admin/ahorro': AhorroReduccion,
  'admin/establecimientos': Establecimientos,
}

// Al cambiar de página, vuelve arriba
function ScrollArriba() {
  const { pathname } = useLocation()
  // Ojo: las llaves { } son importantes. En navegadores nuevos scrollTo
  // devuelve una "promesa", y useEffect solo acepta devolver una función.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollArriba />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login/:area" element={<Login />} />

        {LISTA_AREAS.map((area) => (
          <Route
            key={area.id}
            path={area.ruta}
            element={
              <RequiereSesion area={area.id}>
                <PanelLayout area={area} />
              </RequiereSesion>
            }
          >
            <Route index element={<Navigate to={area.nav[0].ruta} replace />} />
            {area.nav.map((item) => {
              const Pantalla = PANTALLAS[`${area.id}/${item.ruta}`]
              return (
                <Route
                  key={item.ruta}
                  path={`${item.ruta}/*`}
                  element={Pantalla ? <Pantalla /> : <Proximamente area={area} item={item} />}
                />
              )
            })}
          </Route>
        ))}

        <Route path="*" element={<NoEncontrado />} />
      </Routes>
    </>
  )
}
