import { nacaPoints, rotate } from '../../lib/panel'

/**
 * Uzay görevi arması tarzında kişisel rozet.
 * Fotoğraf yokken Hakkımda bölümünde gösterilir.
 *
 * Ortada: Mach 1.5'te 8° hücum açısındaki NACA 0012 ve önündeki
 * yay şoku (Derin'in Fluent'te çalıştığı durum), altta Dünya'nın
 * kenarı, üstte alçak yörüngede bir uydu.
 */
export default function MissionPatch({ name = 'DERİN İZMİRLİ', className = '' }) {
  // profil: 150 px veter, merkez (160, 158)
  const foil = rotate(nacaPoints({ m: 0, p: 0, t: 0.12 }, 40), 8)
    .map(([x, y], i) => `${i ? 'L' : 'M'}${(98 + x * 130).toFixed(1)},${(166 - y * 130).toFixed(1)}`)
    .join(' ')

  const ring = `${name} ✦ AEROSPACE ENGINEERING ✦ METU NCC ✦ `
  const stars = [
    [118, 74, 1.1], [205, 70, 0.9], [232, 104, 1.3], [92, 112, 0.8], [178, 92, 0.7],
    [250, 140, 0.9], [70, 146, 1], [140, 60, 0.8], [214, 124, 0.6], [110, 96, 0.6],
  ]

  return (
    <svg viewBox="0 0 320 320" className={className} role="img" aria-label={`${name}, aerospace engineering, METU NCC`}>
      <defs>
        <radialGradient id="mp-sky" cx="50%" cy="90%" r="85%">
          <stop offset="0%" stopColor="rgb(var(--c-horizon))" stopOpacity="0.55" />
          <stop offset="28%" stopColor="rgb(var(--c-dawn))" />
          <stop offset="62%" stopColor="rgb(var(--c-atmosphere))" />
          <stop offset="100%" stopColor="rgb(var(--c-space))" />
        </radialGradient>
        <linearGradient id="mp-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgb(var(--c-space))" />
          <stop offset="100%" stopColor="rgb(var(--c-atmosphere))" />
        </linearGradient>
        <clipPath id="mp-inner">
          <circle cx="160" cy="160" r="110" />
        </clipPath>
        <path id="mp-text" d="M160,160 m-131,0 a131,131 0 1,1 262,0 a131,131 0 1,1 -262,0" />
      </defs>

      {/* dış halka */}
      <circle cx="160" cy="160" r="156" fill="url(#mp-ring)" />
      <circle cx="160" cy="160" r="156" fill="none" strokeWidth="2" style={{ stroke: 'rgb(var(--c-warm) / 0.7)' }} />
      <circle cx="160" cy="160" r="150" fill="none" strokeWidth="1" strokeDasharray="2 3" style={{ stroke: 'rgb(var(--c-text) / 0.3)' }} />
      <circle cx="160" cy="160" r="113" fill="none" strokeWidth="1" strokeDasharray="2 3" style={{ stroke: 'rgb(var(--c-text) / 0.3)' }} />

      <g className="patch-spin">
        <text
          style={{ fill: 'rgb(var(--c-text))', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, letterSpacing: '0.18em' }}
          fontSize="15"
        >
          <textPath href="#mp-text" textLength="818" lengthAdjust="spacing">
            {ring}
          </textPath>
        </text>
      </g>

      {/* iç disk */}
      <g clipPath="url(#mp-inner)">
        <rect x="40" y="40" width="240" height="240" fill="url(#mp-sky)" />
        {stars.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} className="patch-twinkle" style={{ fill: 'rgb(var(--c-text))', animationDelay: `${i * 0.37}s` }} />
        ))}

        {/* alçak yörünge ve uydu */}
        <ellipse cx="160" cy="112" rx="92" ry="22" fill="none" strokeWidth="0.8" strokeDasharray="3 4" style={{ stroke: 'rgb(var(--c-accent) / 0.45)' }} transform="rotate(-12 160 112)" />
        <g transform="translate(236 96) rotate(-12)">
          <rect x="-3" y="-2.5" width="6" height="5" style={{ fill: 'rgb(var(--c-text))' }} />
          <rect x="-13" y="-1.5" width="8" height="3" style={{ fill: 'rgb(var(--c-accent))' }} />
          <rect x="5" y="-1.5" width="8" height="3" style={{ fill: 'rgb(var(--c-accent))' }} />
        </g>

        {/* akım çizgileri */}
        {[132, 146, 186, 200].map((y) => (
          <path key={y} d={`M44,${y} C90,${y} 110,${y + (y < 166 ? -8 : 8)} 160,${y + (y < 166 ? -6 : 6)} S240,${y} 280,${y}`} fill="none" strokeWidth="0.8" style={{ stroke: 'rgb(var(--c-accent) / 0.35)' }} />
        ))}

        {/* yay şoku */}
        <path d="M92,98 Q76,168 92,238" fill="none" strokeWidth="2" style={{ stroke: 'rgb(var(--c-horizon))', filter: 'drop-shadow(0 0 4px rgb(var(--c-horizon)))' }} />
        <path d="M232,178 L276,204 M232,178 L276,150" fill="none" strokeWidth="1" style={{ stroke: 'rgb(var(--c-horizon) / 0.5)' }} />

        {/* profil */}
        <path d={foil + ' Z'} strokeWidth="1.5" style={{ fill: 'rgb(var(--c-space))', stroke: 'rgb(var(--c-accent))' }} />

        {/* Dünya'nın kenarı */}
        <ellipse cx="160" cy="362" rx="190" ry="110" style={{ fill: 'rgb(var(--c-space))' }} />
        <ellipse cx="160" cy="362" rx="190" ry="110" fill="none" strokeWidth="1.5" style={{ stroke: 'rgb(var(--c-horizon) / 0.8)', filter: 'drop-shadow(0 -2px 6px rgb(var(--c-horizon) / 0.8))' }} />

        <text x="160" y="241" textAnchor="middle" style={{ fill: 'rgb(var(--c-warm))', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.2em' }} fontSize="9">
          M 1.5 · α 8°
        </text>
      </g>
    </svg>
  )
}
