// Encabezado estándar de cada pantalla: antetítulo, título, descripción y acciones.

export default function Encabezado({ antetitulo, titulo, descripcion, acciones, children }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {antetitulo && <p className="text-sm font-semibold text-tinta-suave">{antetitulo}</p>}
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-verde-900 sm:text-4xl">
          {titulo}
        </h1>
        {descripcion && <p className="mt-2 max-w-2xl text-tinta-suave">{descripcion}</p>}
        {children}
      </div>
      {acciones && <div className="flex shrink-0 flex-wrap gap-2">{acciones}</div>}
    </header>
  )
}
