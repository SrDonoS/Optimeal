// ⚙️ Reglas del servicio de almuerzo (ficticias, pero realistas).
// Cambia estos valores y toda la app se adapta.

// Hora límite para reservar, modificar o cancelar el almuerzo de un día.
// Ej: 10:00 → el almuerzo del jueves se puede reservar hasta el jueves a las 10:00.
export const HORA_CIERRE = { horas: 10, minutos: 0 }
const pad = (n) => String(n).padStart(2, '0')
export const HORA_CIERRE_TEXTO = `${pad(HORA_CIERRE.horas)}:${pad(HORA_CIERRE.minutos)} h` // '10:00 h'

// Cuántas semanas se pueden reservar por adelantado (1 = solo esta semana).
export const SEMANAS_RESERVABLES = 2

// Horario en que se retira el almuerzo en el casino.
export const HORARIO_RETIRO = '13:00 – 14:30'
