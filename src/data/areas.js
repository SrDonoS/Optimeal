// Configuración de las 3 áreas de Optimeal.
// Cada área tiene su login, su color de acento y su menú lateral.
// Las pantallas marcadas con `fase` mayor a la actual se muestran
// como "Próximamente" hasta que las construyamos.

import {
  Building2,
  CalendarCheck,
  ChartColumn,
  ChefHat,
  ClipboardList,
  GraduationCap,
  NotebookPen,
  PiggyBank,
  QrCode,
  School,
  TrendingUp,
  UtensilsCrossed,
} from 'lucide-react'

// Fase de construcción en la que estamos (súbela al avanzar 🚀)
export const FASE_ACTUAL = 4

export const AREAS = {
  estudiantes: {
    id: 'estudiantes',
    ruta: '/estudiantes',
    nombre: 'Estudiantes',
    titulo: 'Área Estudiantes',
    icono: GraduationCap,
    tono: 'verde',
    resumen: 'Revisa el menú, reserva tu almuerzo antes del cierre y retira con tu código QR.',
    beneficios: [
      'Menú visual con platos e ingredientes',
      'Reserva anticipada con cuenta regresiva',
      'Código QR para retirar tu almuerzo',
    ],
    pideEstablecimiento: true,
    correoDemo: 'sofia.rojas@alumnos.cl',
    nav: [
      {
        ruta: 'menu',
        etiqueta: 'Menú y reserva',
        icono: UtensilsCrossed,
        fase: 2,
        descripcion: 'Elige una fecha, mira los menús disponibles y reserva tu almuerzo.',
        incluye: [
          'Selector de fecha y tarjetas de menú con plato, ingredientes y acompañamientos',
          'Botones “Seleccionar menú” y “Reservar almuerzo” con estado de la reserva',
          'Contador de cierre con hora límite y vista de plazo cerrado',
        ],
      },
      {
        ruta: 'reservas',
        etiqueta: 'Mis reservas',
        icono: CalendarCheck,
        fase: 2,
        descripcion: 'Gestiona tus reservas: modifícalas o cancélalas dentro del plazo.',
        incluye: [
          'Lista de reservas con fecha, menú y estado',
          'Modificar o cancelar dentro del plazo (con confirmación)',
          'Acciones deshabilitadas y explicadas cuando el plazo ya cerró',
        ],
      },
      {
        ruta: 'qr',
        etiqueta: 'Mi código QR',
        icono: QrCode,
        fase: 2,
        descripcion: 'Tu reserva confirmada y el QR que presentarás al retirar.',
        incluye: [
          'Mensaje de reserva confirmada con fecha y menú',
          'Código QR ilustrativo y explicación del retiro',
          'Botones “Ver mi reserva” y “Modificar reserva”',
        ],
      },
    ],
  },

  casino: {
    id: 'casino',
    ruta: '/casino',
    nombre: 'Personal del casino',
    titulo: 'Panel del Casino',
    icono: ChefHat,
    tono: 'miel',
    resumen: 'Conoce la demanda real del día y cocina las raciones justas.',
    beneficios: [
      'Reservas confirmadas por día y por menú',
      'Predicción de raciones con historial',
      'Lista de preparación lista para imprimir',
    ],
    pideEstablecimiento: true,
    correoDemo: 'marcela.diaz@saboresdelsur.cl',
    nav: [
      {
        ruta: 'demanda',
        etiqueta: 'Demanda diaria',
        icono: ChartColumn,
        fase: 3,
        descripcion: 'Reservas confirmadas del día por menú, con gráfico de demanda.',
        incluye: [
          'Establecimiento, fecha, total de reservas y reservas por menú',
          'Gráfico de demanda de la semana',
          'Accesos rápidos a predicción, preparación y registro de desperdicio',
        ],
      },
      {
        ruta: 'prediccion',
        etiqueta: 'Predicción de raciones',
        icono: TrendingUp,
        fase: 3,
        descripcion: 'Raciones estimadas a partir de reservas e historial disponible.',
        incluye: [
          'Reservas confirmadas vs. raciones estimadas (bien diferenciadas)',
          'Factores explicativos de la estimación',
          'Aviso de “Datos insuficientes” cuando corresponda',
        ],
      },
      {
        ruta: 'preparacion',
        etiqueta: 'Lista de preparación',
        icono: ClipboardList,
        fase: 3,
        descripcion: 'Raciones recomendadas e ingredientes necesarios por menú.',
        incluye: [
          'Fecha, menú, raciones recomendadas e ingredientes',
          '“Cantidad por definir” cuando falta la receta o los datos',
          'Botones “Consultar demanda” e “Imprimir lista”',
        ],
      },
    ],
  },

  admin: {
    id: 'admin',
    ruta: '/admin',
    nombre: 'Administración',
    titulo: 'Área Administrativa',
    icono: Building2,
    tono: 'laguna',
    resumen: 'Mide el desperdicio, el ahorro y el avance hacia la meta en cada colegio.',
    beneficios: [
      'Registro de sobrantes reales',
      'Panel de ahorro y meta de reducción',
      'Datos separados por establecimiento',
    ],
    pideEstablecimiento: false,
    correoDemo: 'admin@saboresdelsur.cl',
    nav: [
      {
        ruta: 'desperdicio',
        etiqueta: 'Registro de desperdicio',
        icono: NotebookPen,
        fase: 4,
        descripcion: 'Registra los sobrantes reales y compáralos con lo estimado.',
        incluye: [
          'Formulario: fecha, menú, raciones preparadas/servidas, kilos sobrantes y observaciones',
          'Botón “Guardar registro”',
          'Vista posterior con el dato incorporado al resumen',
        ],
      },
      {
        ruta: 'ahorro',
        etiqueta: 'Ahorro y reducción',
        icono: PiggyBank,
        fase: 4,
        descripcion: 'Costos estimados vs. reales, kilos desperdiciados y meta de reducción.',
        incluye: [
          'Costos estimados y reales, y su diferencia',
          'Kilos desperdiciados y su evolución en el tiempo',
          'Meta de reducción con barra de progreso',
        ],
      },
      {
        ruta: 'establecimientos',
        etiqueta: 'Establecimientos',
        icono: School,
        fase: 4,
        descripcion: 'Todos los colegios y casinos, con sus datos separados.',
        incluye: [
          'Lista de colegios y casinos',
          'Selector del establecimiento activo',
          'Indicadores clave por establecimiento',
        ],
      },
    ],
  },
}

export const LISTA_AREAS = Object.values(AREAS)

// Clases de color por "tono" de área (Tailwind necesita los nombres completos).
export const TONOS = {
  verde: {
    suave: 'bg-verde-50',
    borde: 'border-verde-200',
    icono: 'bg-verde-100 text-verde-700',
    texto: 'text-verde-700',
    punto: 'bg-verde-500',
  },
  miel: {
    suave: 'bg-miel-50',
    borde: 'border-miel-100',
    icono: 'bg-miel-100 text-miel-800',
    texto: 'text-miel-800',
    punto: 'bg-miel-400',
  },
  laguna: {
    suave: 'bg-laguna-50',
    borde: 'border-laguna-100',
    icono: 'bg-laguna-100 text-laguna-800',
    texto: 'text-laguna-800',
    punto: 'bg-laguna-600',
  },
}
