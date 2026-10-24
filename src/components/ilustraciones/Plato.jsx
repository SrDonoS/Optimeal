// 🍽️ Ilustración de platos vistos desde arriba (SVG 100% original).
//
// Hay dos tipos:
//   • Plato llano  → plato principal + acompañamiento + ensalada
//   • Plato hondo  → guisos y cazuelas, con una ensaladita al lado
//
// Uso rápido:  <Plato variante="guiso" />
// Uso completo (lo usan los menús de src/data/menus.js):
//   <Plato ilustracion={{ hondo: true, base: '#E8C27A', trozos: [...], extra: 'hierbas', ensalada: 'chilena' }} />

// Presets usados en Inicio, Login y la página 404
const VARIANTES = {
  guiso: { forma: 'trozos', base: '#C9773F', oscuro: '#8E4A22', claro: '#E7A462', acomp: 'arroz', ensalada: 'lechuga' },
  legumbres: { forma: 'trozos', base: '#A8743F', oscuro: '#6E4520', claro: '#E9C46A', acomp: 'arroz', ensalada: 'lechuga' },
  vegetal: { forma: 'trozos', base: '#E1A23B', oscuro: '#B5761C', claro: '#F3CF7A', acomp: 'arroz', ensalada: 'lechuga' },
  pescado: { forma: 'filete', base: '#E8D2A6', oscuro: '#C59A5B', claro: '#F6E7C6', acomp: 'arroz', ensalada: 'lechuga' },
}

// Generador pseudoaleatorio con semilla (para que el dibujo sea siempre igual)
function aleatorio(semilla = 7) {
  let s = semilla
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

export default function Plato({ variante = 'guiso', ilustracion, className = '', titulo }) {
  const d = ilustracion ?? VARIANTES[variante] ?? VARIANTES.guiso
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role={titulo ? 'img' : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
    >
      {d.hondo ? <PlatoHondo d={d} /> : <PlatoLlano d={d} />}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Plato llano
// ---------------------------------------------------------------------------
function PlatoLlano({ d }) {
  return (
    <>
      <circle cx="102" cy="106" r="86" fill="#1E2A23" opacity="0.07" />
      <circle cx="100" cy="100" r="86" fill="#FFFFFF" stroke="#E9E2D2" strokeWidth="2" />
      <circle cx="100" cy="100" r="66" fill="#FBF8F1" stroke="#F1EBDD" strokeWidth="2" />
      <Acompanamiento tipo={d.acomp} />
      <Principal d={d} />
      <Ensalada tipo={d.ensalada} cx={98} cy={136} />
    </>
  )
}

function Acompanamiento({ tipo }) {
  if (!tipo) return null
  const r = aleatorio(11)
  if (tipo === 'arroz' || tipo === 'quinoa') {
    const fondo = tipo === 'arroz' ? '#F1E8D0' : '#EADBB4'
    return (
      <g>
        <ellipse cx="76" cy="80" rx="33" ry="26" transform="rotate(-24 76 80)" fill={fondo} />
        {Array.from({ length: tipo === 'arroz' ? 12 : 26 }, (_, i) => {
          const x = 52 + r() * 46
          const y = 62 + r() * 36
          return tipo === 'arroz' ? (
            <ellipse key={i} cx={x} cy={y} rx="3.4" ry="1.7" transform={`rotate(${r() * 180} ${x} ${y})`} fill="#FFFFFF" />
          ) : (
            <circle key={i} cx={x} cy={y} r="1.6" fill={i % 3 === 0 ? '#8DBB9D' : i % 3 === 1 ? '#C9A86A' : '#F6EBCF'} />
          )
        })}
      </g>
    )
  }
  if (tipo === 'pure' || tipo === 'pureZapallo') {
    const [fondo, brillo] = tipo === 'pure' ? ['#F3D98B', '#F9EBC0'] : ['#EDA65A', '#F6C88E']
    return (
      <g>
        <ellipse cx="76" cy="80" rx="32" ry="26" transform="rotate(-24 76 80)" fill={fondo} />
        <path d="M58 82c6-12 22-16 32-8-8 2-14 8-18 14" fill="none" stroke={brillo} strokeWidth="5" strokeLinecap="round" />
        <path d="M66 92c6-4 14-5 20-2" fill="none" stroke={brillo} strokeWidth="4" strokeLinecap="round" />
      </g>
    )
  }
  if (tipo === 'papas') {
    return (
      <g>
        {[[62, 72], [80, 66], [70, 88], [88, 84], [58, 92]].map(([x, y], i) => (
          <g key={i}>
            <rect x={x - 9} y={y - 7} width="18" height="14" rx="6" fill="#E8C170" transform={`rotate(${i * 23} ${x} ${y})`} />
            <rect x={x - 5} y={y - 4} width="8" height="4" rx="2" fill="#F5DE9E" transform={`rotate(${i * 23} ${x} ${y})`} />
          </g>
        ))}
      </g>
    )
  }
  return null
}

function Principal({ d }) {
  const { forma = 'trozos', base, oscuro, claro } = d
  const r = aleatorio(23)
  let cuerpo
  if (forma === 'filete') {
    cuerpo = (
      <g transform="rotate(-18 130 94)">
        <rect x="102" y="72" width="56" height="44" rx="20" fill={base} />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${114 + i * 13} 78l-6 32`} stroke={oscuro} strokeWidth="3" strokeLinecap="round" opacity="0.55" />
        ))}
      </g>
    )
  } else if (forma === 'budin') {
    cuerpo = (
      <g>
        <rect x="104" y="70" width="52" height="48" rx="10" fill={base} />
        <rect x="108" y="74" width="44" height="18" rx="7" fill={claro} />
        {[[116, 102], [132, 108], [146, 100]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.5" fill={oscuro} />
        ))}
      </g>
    )
  } else if (forma === 'croquetas') {
    cuerpo = (
      <g>
        {[[118, 84], [142, 90], [126, 106]].map(([x, y], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y} rx="14" ry="11" fill={base} />
            <ellipse cx={x - 3} cy={y - 3} rx="7" ry="4" fill={claro} opacity="0.8" />
          </g>
        ))}
      </g>
    )
  } else if (forma === 'tortilla') {
    cuerpo = (
      <g>
        <circle cx="130" cy="94" r="30" fill={base} />
        <circle cx="130" cy="94" r="30" fill="none" stroke={oscuro} strokeWidth="3" opacity="0.5" />
        {Array.from({ length: 9 }, (_, i) => (
          <circle key={i} cx={112 + r() * 36} cy={76 + r() * 36} r="3" fill={i % 2 ? '#5E9C74' : '#D9583F'} />
        ))}
      </g>
    )
  } else {
    cuerpo = (
      <g>
        <ellipse cx="130" cy="94" rx="31" ry="29" fill={base} />
        <circle cx="120" cy="86" r="8" fill={oscuro} />
        <circle cx="140" cy="100" r="9" fill={oscuro} />
        <circle cx="136" cy="80" r="6" fill={claro} />
        <circle cx="122" cy="106" r="5.5" fill={claro} />
      </g>
    )
  }
  return (
    <g>
      {cuerpo}
      <Extra tipo={d.extra} cx={130} cy={94} />
    </g>
  )
}

// ---------------------------------------------------------------------------
// Plato hondo (guisos)
// ---------------------------------------------------------------------------
function PlatoHondo({ d }) {
  const r = aleatorio(d.semilla ?? 5)
  const borde = d.borde ?? '#FFFFFF'
  const trozos = d.trozos ?? []
  return (
    <>
      <circle cx="94" cy="96" r="78" fill="#1E2A23" opacity="0.07" />
      <circle cx="90" cy="90" r="78" fill={borde} stroke={d.borde ? 'none' : '#E9E2D2'} strokeWidth="2" />
      <circle cx="90" cy="90" r="60" fill={d.base} />
      <circle cx="90" cy="90" r="60" fill="none" stroke="#1E2A23" strokeOpacity="0.08" strokeWidth="6" />
      {Array.from({ length: trozos.length ? 16 : 0 }, (_, i) => {
        const ang = r() * Math.PI * 2
        const dist = Math.sqrt(r()) * 44
        const x = 90 + Math.cos(ang) * dist
        const y = 90 + Math.sin(ang) * dist
        const color = trozos[i % Math.max(trozos.length, 1)] ?? d.base
        const tam = 4 + r() * 5
        return i % 3 === 0 ? (
          <rect key={i} x={x - tam} y={y - tam} width={tam * 2} height={tam * 2} rx="3" fill={color} transform={`rotate(${r() * 90} ${x} ${y})`} />
        ) : (
          <circle key={i} cx={x} cy={y} r={tam} fill={color} />
        )
      })}
      <Extra tipo={d.extra} cx={90} cy={90} hondo />
      {d.ensalada && (
        <g>
          <circle cx="160" cy="160" r="34" fill="#1E2A23" opacity="0.07" />
          <circle cx="158" cy="157" r="34" fill="#FFFFFF" stroke="#E9E2D2" strokeWidth="2" />
          <Ensalada tipo={d.ensalada} cx={158} cy={157} chica />
        </g>
      )}
    </>
  )
}

// Detalles encima del plato principal
function Extra({ tipo, cx, cy, hondo = false }) {
  if (!tipo) return null
  // Se pueden combinar varios detalles: extra: ['fideos', 'salsa']
  if (Array.isArray(tipo)) {
    return tipo.map((t) => <Extra key={t} tipo={t} cx={cx} cy={cy} hondo={hondo} />)
  }
  const r = aleatorio(31)
  if (tipo === 'fideos') {
    return Array.from({ length: 16 }, (_, i) => {
      const ang = r() * Math.PI * 2
      const dist = Math.sqrt(r()) * 40
      const x = cx + Math.cos(ang) * dist - 10
      const y = cy + Math.sin(ang) * dist
      return (
        <path
          key={i}
          d={`M${x} ${y}q6 -7 12 0t12 0`}
          fill="none"
          stroke={i % 2 ? '#F8E6AE' : '#E3BC62'}
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${r() * 180} ${x + 12} ${y})`}
        />
      )
    })
  }
  if (tipo === 'arvejas' || tipo === 'lentejas') {
    const color = tipo === 'arvejas' ? '#6FA35A' : '#6B4426'
    return Array.from({ length: hondo ? 22 : 12 }, (_, i) => {
      const ang = r() * Math.PI * 2
      const dist = Math.sqrt(r()) * (hondo ? 46 : 24)
      return <circle key={i} cx={cx + Math.cos(ang) * dist} cy={cy + Math.sin(ang) * dist} r="3" fill={color} />
    })
  }
  if (tipo === 'huevo') {
    return (
      <g>
        <path d={`M${cx - 20} ${cy - 2}c0-14 12-20 22-18 12 2 20 10 18 22-2 12-14 16-24 14-10-2-16-8-16-18z`} fill="#FFFDF5" />
        <circle cx={cx + 2} cy={cy + 2} r="8" fill="#F2B53A" />
        <circle cx={cx - 1} cy={cy - 1} r="2.5" fill="#F8D27A" />
      </g>
    )
  }
  if (tipo === 'hierbas') {
    return Array.from({ length: 7 }, (_, i) => {
      const x = cx - 22 + r() * 44
      const y = cy - 20 + r() * 40
      return <path key={i} d={`M${x} ${y}c3-5 8-6 11-5-2 4-6 7-11 5z`} fill="#3F7F57" />
    })
  }
  if (tipo === 'riendas') {
    return Array.from({ length: 6 }, (_, i) => {
      const x = cx - 30 + r() * 50
      const y = cy - 30 + r() * 50
      return (
        <path key={i} d={`M${x} ${y}q8 -6 16 0t16 0`} fill="none" stroke="#F3DC9A" strokeWidth="3.5" strokeLinecap="round" />
      )
    })
  }
  if (tipo === 'salsa') {
    return (
      <g>
        <path d={`M${cx - 26} ${cy}c0-18 18-28 32-22 16 6 22 22 12 34-10 12-30 12-38 4-4-4-6-10-6-16z`} fill="#B5452F" />
        <path d={`M${cx - 12} ${cy - 6}c6-6 14-6 20 0`} fill="none" stroke="#D86A4E" strokeWidth="4" strokeLinecap="round" />
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={cx - 18 + r() * 34} y={cy - 14 + r() * 28} width="4" height="2.5" rx="1" fill="#FFF3C4" />
        ))}
        <path d={`M${cx + 14} ${cy - 22}c4-7 11-9 16-8-2 6-8 10-16 8z`} fill="#3F7F57" />
      </g>
    )
  }
  if (tipo === 'gratinado') {
    return Array.from({ length: 20 }, (_, i) => {
      const ang = r() * Math.PI * 2
      const dist = Math.sqrt(r()) * 50
      return <circle key={i} cx={cx + Math.cos(ang) * dist} cy={cy + Math.sin(ang) * dist} r={1.5 + r() * 2.5} fill="#C98B2A" opacity="0.7" />
    })
  }
  return null
}

// ---------------------------------------------------------------------------
// Ensaladas
// ---------------------------------------------------------------------------
function Ensalada({ tipo, cx, cy, chica = false }) {
  if (!tipo) return null
  const e = chica ? 0.72 : 1
  const t = (dx, dy) => `${cx + dx * e} ${cy + dy * e}`

  if (tipo === 'chilena') {
    return (
      <g>
        {!chica && <ellipse cx={cx} cy={cy} rx={36 * e} ry={21 * e} fill="#F7E3DC" />}
        {[[-18, -4], [0, 4], [16, -6], [-6, -12]].map(([dx, dy], i) => (
          <g key={i}>
            <circle cx={cx + dx * e} cy={cy + dy * e} r={10 * e} fill="#D9583F" />
            <circle cx={cx + dx * e} cy={cy + dy * e} r={6 * e} fill="#E8826B" />
          </g>
        ))}
        {[[-10, 8], [10, 10], [22, 4]].map(([dx, dy], i) => (
          <ellipse key={i} cx={cx + dx * e} cy={cy + dy * e} rx={7 * e} ry={3 * e} fill="none" stroke="#FFFFFF" strokeWidth="2.2" />
        ))}
        <path d={`M${t(-24, 10)}c3-5 8-6 11-5-2 4-6 7-11 5z`} fill="#3F7F57" />
      </g>
    )
  }
  if (tipo === 'betarraga') {
    const r = aleatorio(41)
    return (
      <g>
        {!chica && <ellipse cx={cx} cy={cy} rx={36 * e} ry={21 * e} fill="#F1D9DF" />}
        {Array.from({ length: 11 }, (_, i) => {
          const x = cx + (-26 + r() * 50) * e
          const y = cy + (-14 + r() * 26) * e
          return <rect key={i} x={x} y={y} width={8 * e} height={8 * e} rx="2" fill={i % 2 ? '#9B2C4F' : '#B8456A'} />
        })}
      </g>
    )
  }
  if (tipo === 'repollo') {
    const r = aleatorio(43)
    return (
      <g>
        {!chica && <ellipse cx={cx} cy={cy} rx={36 * e} ry={21 * e} fill="#E6F0DA" />}
        {Array.from({ length: 12 }, (_, i) => {
          const x = cx + (-28 + r() * 48) * e
          const y = cy + (-14 + r() * 26) * e
          return (
            <path key={i} d={`M${x} ${y}q${6 * e} ${-5 * e} ${12 * e} 0`} fill="none" stroke={i % 3 ? '#B9D88F' : '#E08A3C'} strokeWidth="2.6" strokeLinecap="round" />
          )
        })}
      </g>
    )
  }
  // lechuga (por defecto)
  return (
    <g>
      {!chica && <ellipse cx={cx} cy={cy} rx={36 * e} ry={21 * e} fill="#A9CF9F" />}
      {chica && <circle cx={cx} cy={cy} r={24} fill="#A9CF9F" />}
      <path d={`M${t(-26, 0)}c${4 * e}-${12 * e} ${18 * e}-${16 * e} ${28 * e}-${12 * e}-${5 * e} ${11 * e}-${17 * e} ${15 * e}-${28 * e} ${12 * e}z`} fill="#5E9C74" />
      <path d={`M${t(-2, 10)}c${6 * e}-${11 * e} ${20 * e}-${12 * e} ${28 * e}-${7 * e}-${7 * e} ${9 * e}-${19 * e} ${12 * e}-${28 * e} ${7 * e}z`} fill="#3F7F57" />
      <path d={`M${t(-12, -12)}c${8 * e}-${6 * e} ${18 * e}-${5 * e} ${22 * e} 0-${8 * e} ${5 * e}-${16 * e} ${5 * e}-${22 * e} 0z`} fill="#8DBB9D" />
      <circle cx={cx + 14 * e} cy={cy - 8 * e} r={6.5 * e} fill="#D9583F" />
      <circle cx={cx + 14 * e} cy={cy - 8 * e} r={2 * e} fill="#F3B2A4" />
      <circle cx={cx - 16 * e} cy={cy + 10 * e} r={5.5 * e} fill="#D9583F" />
    </g>
  )
}
