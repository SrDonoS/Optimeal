// 🎓 Sección "Menú y reserva" del estudiante. Tiene dos pasos:
//   /estudiantes/menu            → Menú visual (elegir fecha y menú)
//   /estudiantes/menu/confirmar  → Contador de cierre y confirmación

import { Route, Routes } from 'react-router-dom'
import ContadorCierre from './ContadorCierre'
import MenuVisual from './MenuVisual'

export default function MenuReserva() {
  return (
    <Routes>
      <Route index element={<MenuVisual />} />
      <Route path="confirmar" element={<ContadorCierre />} />
    </Routes>
  )
}
