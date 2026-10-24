// "Guardia" de ruta: si no hay sesión (simulada) para esta área,
// te manda a su login y recuerda a dónde querías ir.

import { Navigate, useLocation } from 'react-router-dom'
import { useSesion } from '../context/SesionContext'

export default function RequiereSesion({ area, children }) {
  const { sesiones } = useSesion()
  const location = useLocation()

  if (!sesiones[area]) {
    return <Navigate to={`/login/${area}`} state={{ desde: location.pathname }} replace />
  }
  return children
}
