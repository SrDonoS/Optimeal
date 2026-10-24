// Pequeño ayudante para guardar datos en el navegador (localStorage).
// Así, si recargas la página, la sesión simulada y (en próximas fases)
// las reservas siguen ahí. Si el navegador bloquea el almacenamiento,
// la app sigue funcionando igual, solo que sin "memoria".

const PREFIJO = 'optimeal:'

export function leer(clave, valorPorDefecto) {
  try {
    const guardado = localStorage.getItem(PREFIJO + clave)
    return guardado === null ? valorPorDefecto : JSON.parse(guardado)
  } catch {
    return valorPorDefecto
  }
}

export function guardar(clave, valor) {
  try {
    localStorage.setItem(PREFIJO + clave, JSON.stringify(valor))
  } catch {
    /* sin almacenamiento disponible: no pasa nada */
  }
}

// Borra todo lo que Optimeal guardó (útil para reiniciar la demo).
export function borrarTodo() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIJO))
      .forEach((k) => localStorage.removeItem(k))
  } catch {
    /* nada que hacer */
  }
}
