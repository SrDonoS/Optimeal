// Tarjeta "Soft UI": fondo marfil claro, borde suave y sombra difusa.

export default function Tarjeta({ as: Etiqueta = 'div', className = '', children, ...props }) {
  return (
    <Etiqueta
      className={`rounded-3xl border border-marfil-300/80 bg-marfil-50 shadow-suave ${className}`}
      {...props}
    >
      {children}
    </Etiqueta>
  )
}
