// ⚠️ Los NOMBRES son de colegios reales, pero TODAS las cifras (matrícula,
// raciones, costos, desperdicio) y la concesionaria son FICTICIAS para el prototipo.
// El `id` es interno (no se muestra en pantalla); no lo cambies o se pierden
// las reservas y registros guardados en el navegador.

export const CONCESIONARIA = {
  nombre: 'Sabores del Sur',
  descripcion: 'Concesionaria de alimentación escolar (ficticia)',
}

export const ESTABLECIMIENTOS = [
  {
    id: 'los-aromos',
    nombre: 'Liceo A21',
    comuna: 'Talcahuano',
    region: 'Biobío',
    casino: 'Casino Central',
    matricula: 860,
    racionesDiariasPromedio: 412,
    semanasEnPiloto: 10, // semanas de historial disponibles
    racionesFijasAntes: 470, // lo que se cocinaba cada día ANTES de Optimeal
    costoRacion: 2350, // costo de una ración en pesos chilenos (CLP)
  },
  {
    id: 'altamira',
    nombre: 'Adventista Thno Centro',
    comuna: 'Talcahuano',
    region: 'Biobío',
    casino: 'Casino Patio Norte',
    matricula: 1140,
    racionesDiariasPromedio: 538,
    semanasEnPiloto: 8, // semanas de historial disponibles
    racionesFijasAntes: 610, // lo que se cocinaba cada día ANTES de Optimeal
    costoRacion: 2280, // costo de una ración en pesos chilenos (CLP)
  },
  {
    id: 'mar-azul',
    nombre: "Saint John's School Concepción",
    comuna: 'Concepción',
    region: 'Biobío',
    casino: 'Casino Mirador',
    matricula: 640,
    racionesDiariasPromedio: 295,
    semanasEnPiloto: 6, // semanas de historial disponibles
    racionesFijasAntes: 340, // lo que se cocinaba cada día ANTES de Optimeal
    costoRacion: 2450, // costo de una ración en pesos chilenos (CLP)
  },
  {
    id: 'bosque-nativo',
    nombre: 'Colegio María Inmaculada',
    comuna: 'Concepción',
    region: 'Biobío',
    casino: 'Casino Los Coigües',
    matricula: 380,
    racionesDiariasPromedio: 176,
    semanasEnPiloto: 1, // semanas de historial disponibles
    racionesFijasAntes: 205, // lo que se cocinaba cada día ANTES de Optimeal
    costoRacion: 2600, // costo de una ración en pesos chilenos (CLP)
  },
]

export function buscarEstablecimiento(id) {
  return ESTABLECIMIENTOS.find((e) => e.id === id) ?? ESTABLECIMIENTOS[0]
}
