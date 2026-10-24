// 🍲 Menús FICTICIOS de la concesionaria (ciclo semanal de lunes a viernes).
// Cada día hay 3 opciones: Tradicional, Vegetariano y Liviano.
// La propiedad `ilustracion` describe cómo se dibuja el plato (ver Plato.jsx).

import { desdeISO } from '../utils/fechas'

// `color`: color de cada tipo en los gráficos (paleta validada para daltonismo)
export const TIPOS_MENU = {
  tradicional: { nombre: 'Tradicional', tono: 'miel', emoji: '🍲', fondo: 'bg-miel-50', color: '#AD5C1B' },
  vegetariano: { nombre: 'Vegetariano', tono: 'verde', emoji: '🌱', fondo: 'bg-verde-50', color: '#53A06D' },
  liviano: { nombre: 'Liviano', tono: 'laguna', emoji: '🥗', fondo: 'bg-laguna-50', color: '#4169B3' },
}

// Colores base reutilizables para las ilustraciones
const POLLO = { base: '#E3A857', oscuro: '#B9772E', claro: '#F3CF8E' }
const PESCADO = { base: '#F1E4C8', oscuro: '#D7BE90', claro: '#FBF3E2' }

// 1 = lunes … 5 = viernes
const CICLO = {
  1: {
    postre: 'Fruta de estación',
    opciones: [
      {
        tipo: 'tradicional',
        nombre: 'Pollo arvejado con arroz',
        descripcion: 'Trutro de pollo guisado con arvejas y zanahoria, acompañado de arroz graneado.',
        ingredientes: ['Pollo', 'Arvejas', 'Zanahoria', 'Cebolla', 'Arroz'],
        acompanamientos: ['Arroz graneado', 'Ensalada de lechuga'],
        calorias: 720,
        ilustracion: { forma: 'trozos', ...POLLO, extra: 'arvejas', acomp: 'arroz', ensalada: 'lechuga' },
      },
      {
        tipo: 'vegetariano',
        nombre: 'Budín de zapallo italiano',
        descripcion: 'Budín horneado de zapallo italiano, huevo y queso, con arroz primavera.',
        ingredientes: ['Zapallo italiano', 'Huevo', 'Queso', 'Cebolla', 'Arroz'],
        acompanamientos: ['Arroz primavera', 'Ensalada chilena'],
        calorias: 640,
        ilustracion: { forma: 'budin', base: '#D9B44A', oscuro: '#7FA05A', claro: '#F1D98A', acomp: 'arroz', ensalada: 'chilena' },
      },
      {
        tipo: 'liviano',
        nombre: 'Merluza al vapor con quinoa',
        descripcion: 'Filete de merluza al vapor con hierbas, sobre quinoa y verduras.',
        ingredientes: ['Merluza', 'Quinoa', 'Limón', 'Perejil', 'Zanahoria'],
        acompanamientos: ['Quinoa con verduras', 'Ensalada de lechuga'],
        calorias: 560,
        ilustracion: { forma: 'filete', ...PESCADO, extra: 'hierbas', acomp: 'quinoa', ensalada: 'lechuga' },
      },
    ],
  },
  2: {
    postre: 'Jalea de frutilla',
    opciones: [
      {
        tipo: 'tradicional',
        nombre: 'Porotos con riendas',
        descripcion: 'Clásico guiso de porotos con tallarines, zapallo y sofrito.',
        ingredientes: ['Porotos', 'Tallarines', 'Zapallo', 'Cebolla', 'Pimentón'],
        acompanamientos: ['Ensalada chilena', 'Pan amasado'],
        calorias: 780,
        ilustracion: { hondo: true, base: '#C98E55', trozos: ['#F1E3C6', '#E89B3C', '#F1E3C6'], extra: 'riendas', ensalada: 'chilena', semilla: 3 },
      },
      {
        tipo: 'vegetariano',
        nombre: 'Charquicán de verduras con huevo',
        descripcion: 'Charquicán de papa, zapallo, choclo y arvejas, coronado con huevo.',
        ingredientes: ['Papa', 'Zapallo', 'Choclo', 'Arvejas', 'Huevo'],
        acompanamientos: ['Ensalada de repollo y zanahoria'],
        calorias: 650,
        ilustracion: { hondo: true, base: '#E2A04A', trozos: ['#F2C94C', '#8DBB9D', '#E07B39'], extra: 'huevo', ensalada: 'repollo', semilla: 9 },
      },
      {
        tipo: 'liviano',
        nombre: 'Albóndigas de pavo con puré',
        descripcion: 'Albóndigas de pavo al horno en salsa suave, con puré de papas.',
        ingredientes: ['Pavo', 'Avena', 'Huevo', 'Papa', 'Tomate'],
        acompanamientos: ['Puré de papas', 'Ensalada de lechuga'],
        calorias: 590,
        ilustracion: { forma: 'croquetas', base: '#A9663A', oscuro: '#7A4524', claro: '#C98B5E', acomp: 'pure', ensalada: 'lechuga' },
      },
    ],
  },
  3: {
    postre: 'Fruta de estación',
    opciones: [
      {
        tipo: 'tradicional',
        nombre: 'Pastel de choclo',
        descripcion: 'Pino de carne con pollo, huevo y aceituna, cubierto con pastelera de choclo.',
        ingredientes: ['Choclo', 'Carne molida', 'Pollo', 'Huevo', 'Cebolla', 'Albahaca'],
        acompanamientos: ['Ensalada chilena'],
        calorias: 760,
        ilustracion: { hondo: true, borde: '#A9643A', base: '#E9B949', trozos: ['#F6DC8A', '#D9A23A'], extra: 'gratinado', ensalada: 'chilena', semilla: 4 },
      },
      {
        tipo: 'vegetariano',
        nombre: 'Croquetas de quinoa con arroz',
        descripcion: 'Croquetas doradas de quinoa y zanahoria, con arroz graneado.',
        ingredientes: ['Quinoa', 'Zanahoria', 'Avena', 'Cebollín', 'Arroz'],
        acompanamientos: ['Arroz graneado', 'Ensalada de betarraga'],
        calorias: 610,
        ilustracion: { forma: 'croquetas', base: '#D49A4E', oscuro: '#9A6211', claro: '#EBC184', acomp: 'arroz', ensalada: 'betarraga' },
      },
      {
        tipo: 'liviano',
        nombre: 'Pollo al horno con papas cocidas',
        descripcion: 'Pechuga de pollo al horno con hierbas y papas cocidas.',
        ingredientes: ['Pechuga de pollo', 'Papa', 'Orégano', 'Ajo'],
        acompanamientos: ['Papas cocidas', 'Ensalada de repollo'],
        calorias: 580,
        ilustracion: { forma: 'filete', ...POLLO, extra: 'hierbas', acomp: 'papas', ensalada: 'repollo' },
      },
    ],
  },
  4: {
    postre: 'Yogur natural',
    opciones: [
      {
        tipo: 'tradicional',
        nombre: 'Cazuela de vacuno',
        descripcion: 'Cazuela casera con trozo de vacuno, papa, zapallo, choclo y arroz.',
        ingredientes: ['Vacuno', 'Papa', 'Zapallo', 'Choclo', 'Arroz', 'Cilantro'],
        acompanamientos: ['Pan amasado', 'Ensalada de lechuga'],
        calorias: 700,
        ilustracion: { hondo: true, base: '#E8C27A', trozos: ['#8E4A22', '#F1D9A0', '#E89B3C', '#F2C94C'], extra: 'hierbas', ensalada: 'lechuga', semilla: 8 },
      },
      {
        tipo: 'vegetariano',
        nombre: 'Lentejas con arroz',
        descripcion: 'Lentejas guisadas con zapallo y zanahoria, servidas con arroz.',
        ingredientes: ['Lentejas', 'Zapallo', 'Zanahoria', 'Cebolla', 'Arroz'],
        acompanamientos: ['Ensalada chilena'],
        calorias: 630,
        ilustracion: { hondo: true, base: '#8A5A33', trozos: ['#F1E8D0', '#E07B39', '#F1E8D0'], extra: 'lentejas', ensalada: 'chilena', semilla: 6 },
      },
      {
        tipo: 'liviano',
        nombre: 'Tortilla de verduras con quinoa',
        nuevo: true, // plato recién agregado: todavía no tiene historial ni ficha técnica
        descripcion: 'Tortilla al horno de espinaca, tomate y cebolla, con quinoa.',
        ingredientes: ['Huevo', 'Espinaca', 'Tomate', 'Cebolla', 'Quinoa'],
        acompanamientos: ['Quinoa', 'Ensalada de betarraga'],
        calorias: 540,
        ilustracion: { forma: 'tortilla', base: '#F2CF5B', oscuro: '#D9A23A', claro: '#F8E39A', acomp: 'quinoa', ensalada: 'betarraga' },
      },
    ],
  },
  5: {
    postre: 'Fruta de estación',
    opciones: [
      {
        tipo: 'tradicional',
        nombre: 'Tallarines con salsa boloñesa',
        descripcion: 'Tallarines con salsa de tomate y carne, con queso rallado.',
        ingredientes: ['Tallarines', 'Carne molida', 'Tomate', 'Cebolla', 'Queso'],
        acompanamientos: ['Ensalada de lechuga'],
        calorias: 750,
        ilustracion: { hondo: true, base: '#F2D58A', trozos: [], extra: ['fideos', 'salsa'], ensalada: 'lechuga', semilla: 12 },
      },
      {
        tipo: 'vegetariano',
        nombre: 'Garbanzos guisados con arroz',
        descripcion: 'Garbanzos con espinaca y zapallo en sofrito suave, con arroz.',
        ingredientes: ['Garbanzos', 'Espinaca', 'Zapallo', 'Cebolla', 'Arroz'],
        acompanamientos: ['Ensalada de repollo'],
        calorias: 660,
        ilustracion: { hondo: true, base: '#D9A35A', trozos: ['#EAD2A0', '#5E9C74', '#EAD2A0', '#E89B3C'], extra: null, ensalada: 'repollo', semilla: 15 },
      },
      {
        tipo: 'liviano',
        nombre: 'Merluza al horno con puré de zapallo',
        descripcion: 'Merluza al horno con limón y puré de zapallo camote.',
        ingredientes: ['Merluza', 'Zapallo', 'Limón', 'Perejil'],
        acompanamientos: ['Puré de zapallo', 'Ensalada chilena'],
        calorias: 550,
        ilustracion: { forma: 'filete', base: '#EED9B0', oscuro: '#C9A26A', claro: '#F8EBD0', extra: 'hierbas', acomp: 'pureZapallo', ensalada: 'chilena' },
      },
    ],
  },
}

// Menús disponibles para una fecha 'AAAA-MM-DD'.
// El id de cada menú es '<fecha>:<tipo>' (ej: '2026-10-23:vegetariano').
export function menusDelDia(iso) {
  const dia = desdeISO(iso).getDay()
  const ciclo = CICLO[dia]
  if (!ciclo) return []
  return ciclo.opciones.map((op) => ({
    ...op,
    id: `${iso}:${op.tipo}`,
    fecha: iso,
    postre: ciclo.postre,
  }))
}

export function buscarMenu(menuId) {
  const [iso, tipo] = (menuId ?? '').split(':')
  if (!iso || !tipo) return null
  return menusDelDia(iso).find((m) => m.tipo === tipo) ?? null
}
