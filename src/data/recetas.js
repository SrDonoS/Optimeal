// 📋 Fichas técnicas FICTICIAS: cuánto se usa de cada ingrediente por ración.
//
// Regla importante del prototipo: NO inventamos cantidades.
//   • Si un ingrediente tiene `porRacion: null` → se muestra "Cantidad por definir".
//   • Si un plato no tiene ficha técnica (receta: null) → todo queda "por definir".
//
// Unidades: 'g' (gramos), 'ml' (mililitros), 'unid' (unidades).
// Grupos: 'plato' (plato principal), 'acomp' (acompañamientos), 'postre'.

const FRUTA = { nombre: 'Fruta de estación', porRacion: 1, unidad: 'unid', grupo: 'postre' }
const JALEA = { nombre: 'Jalea de frutilla', porRacion: 1, unidad: 'unid', grupo: 'postre' }
const YOGUR = { nombre: 'Yogur natural', porRacion: 1, unidad: 'unid', grupo: 'postre' }
const LECHUGA = { nombre: 'Lechuga', porRacion: 40, unidad: 'g', grupo: 'acomp' }
const CHILENA = [
  { nombre: 'Tomate (ensalada)', porRacion: 60, unidad: 'g', grupo: 'acomp' },
  { nombre: 'Cebolla (ensalada)', porRacion: 15, unidad: 'g', grupo: 'acomp' },
]
const REPOLLO = [
  { nombre: 'Repollo', porRacion: 40, unidad: 'g', grupo: 'acomp' },
  { nombre: 'Zanahoria (ensalada)', porRacion: 15, unidad: 'g', grupo: 'acomp' },
]
const PAN = { nombre: 'Pan amasado', porRacion: 1, unidad: 'unid', grupo: 'acomp' }

const i = (nombre, porRacion, unidad = 'g', grupo = 'plato') => ({ nombre, porRacion, unidad, grupo })

export const RECETAS = {
  // ---------- Lunes ----------
  'Pollo arvejado con arroz': [
    i('Pollo (trutro)', 150), i('Arvejas', 40), i('Zanahoria', 30), i('Cebolla', 25),
    i('Aceite', 5, 'ml'), i('Arroz', 70, 'g', 'acomp'), LECHUGA, FRUTA,
  ],
  'Budín de zapallo italiano': [
    i('Zapallo italiano', 180), i('Huevo', 1, 'unid'), i('Queso', 30), i('Cebolla', 25),
    i('Arroz', 60, 'g', 'acomp'), i('Arvejas (arroz primavera)', 10, 'g', 'acomp'), ...CHILENA, FRUTA,
  ],
  'Merluza al vapor con quinoa': [
    i('Merluza', 140), i('Limón', null), i('Perejil', null),
    i('Quinoa', 50, 'g', 'acomp'), i('Zanahoria', 30, 'g', 'acomp'), LECHUGA, FRUTA,
  ],
  // ---------- Martes ----------
  'Porotos con riendas': [
    i('Porotos', 80), i('Tallarines', 25), i('Zapallo', 60), i('Cebolla', 25), i('Pimentón', 15),
    ...CHILENA, PAN, JALEA,
  ],
  'Charquicán de verduras con huevo': [
    i('Papa', 150), i('Zapallo', 80), i('Choclo', 40), i('Arvejas', 30), i('Huevo', 1, 'unid'),
    ...REPOLLO, JALEA,
  ],
  'Albóndigas de pavo con puré': [
    i('Pavo molido', 120), i('Avena', 15), i('Huevo', 12), i('Tomate', 40),
    i('Papa (puré)', 180, 'g', 'acomp'), i('Leche (puré)', 30, 'ml', 'acomp'), LECHUGA, JALEA,
  ],
  // ---------- Miércoles ----------
  'Pastel de choclo': [
    i('Choclo', 150), i('Carne molida', 70), i('Pollo', 40), i('Huevo duro', 15), i('Cebolla', 40),
    i('Albahaca', null), i('Aceitunas', null), ...CHILENA, FRUTA,
  ],
  'Croquetas de quinoa con arroz': [
    i('Quinoa', 60), i('Zanahoria', 40), i('Avena', 20), i('Cebollín', 10),
    i('Arroz', 60, 'g', 'acomp'), i('Betarraga', 50, 'g', 'acomp'), FRUTA,
  ],
  'Pollo al horno con papas cocidas': [
    i('Pechuga de pollo', 140), i('Ajo', 3), i('Orégano', null),
    i('Papa', 180, 'g', 'acomp'), ...REPOLLO, FRUTA,
  ],
  // ---------- Jueves ----------
  'Cazuela de vacuno': [
    i('Vacuno (posta)', 120), i('Papa', 120), i('Zapallo', 60), i('Choclo', 60), i('Arroz', 20),
    i('Cilantro', null), PAN, LECHUGA, YOGUR,
  ],
  'Lentejas con arroz': [
    i('Lentejas', 70), i('Zapallo', 50), i('Zanahoria', 30), i('Cebolla', 25),
    i('Arroz', 50, 'g', 'acomp'), ...CHILENA, YOGUR,
  ],
  // Plato nuevo: la ficha técnica aún no está lista
  'Tortilla de verduras con quinoa': null,
  // ---------- Viernes ----------
  'Tallarines con salsa boloñesa': [
    i('Tallarines', 90), i('Carne molida', 80), i('Salsa de tomate', 80, 'ml'), i('Cebolla', 25),
    i('Queso rallado', 10), LECHUGA, FRUTA,
  ],
  'Garbanzos guisados con arroz': [
    i('Garbanzos', 80), i('Espinaca', 40), i('Zapallo', 50), i('Cebolla', 25),
    i('Arroz', 50, 'g', 'acomp'), ...REPOLLO, FRUTA,
  ],
  'Merluza al horno con puré de zapallo': [
    i('Merluza', 140), i('Limón', null), i('Perejil', null),
    i('Zapallo camote (puré)', 200, 'g', 'acomp'), ...CHILENA, FRUTA,
  ],
}

// Ficha técnica de un menú: lista de ingredientes, o null si no existe
export function recetaDe(menu) {
  return RECETAS[menu?.nombre] ?? null
}
