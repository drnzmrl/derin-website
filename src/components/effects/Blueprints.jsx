import { motion } from 'framer-motion'
import { nacaPoints } from '../../lib/panel'
import { dur } from '../../config/applyTheme'

/* ══════════════════════════════════════════════════════════════
   TEKNİK ÇİZİMLER (SVG)

   Görseli olmayan proje ve çizim kartları için. Ekrana girince
   çizgiler kendini çizer. Hepsi 320 × 180 (16:9) çerçevede.

   Yeni çizim: aşağıdaki DRAW nesnesine bir anahtar ekle,
   veri dosyasında blueprint: '<anahtar>' ya da
   cover: { kind: 'blueprint', draw: '<anahtar>' } yaz.
   ══════════════════════════════════════════════════════════════ */

const ink = 'rgb(var(--c-accent) / 0.85)'
const dim = 'rgb(var(--c-warm) / 0.8)'
const faint = 'rgb(var(--c-text) / 0.18)'
const txt = { fill: 'rgb(var(--c-textDim) / 0.85)', fontSize: 7, fontFamily: 'JetBrains Mono, monospace' }

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: dur(1.4), ease: [0.16, 1, 0.3, 1] } },
}
const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: dur(0.6), delay: dur(0.8) } },
}

/* Küçük yardımcılar */
const P = ({ d, c = ink, w = 1.2, dash, fill = 'none' }) => (
  <motion.path d={d} variants={draw} style={{ stroke: c, fill }} strokeWidth={w} strokeDasharray={dash} strokeLinecap="round" strokeLinejoin="round" />
)
const T = ({ x, y, children, a = 'start' }) => (
  <motion.text x={x} y={y} textAnchor={a} variants={fade} style={txt}>
    {children}
  </motion.text>
)
/** Ölçü çizgisi (oklu) */
const Dim = ({ x1, y1, x2, y2, label, off = 0 }) => {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const ang = Math.atan2(y2 - y1, x2 - x1)
  const ah = (x, y, s) =>
    `M${x},${y} l${Math.cos(ang + s * 2.7) * 4},${Math.sin(ang + s * 2.7) * 4} M${x},${y} l${Math.cos(ang - s * 2.7) * 4},${Math.sin(ang - s * 2.7) * 4}`
  return (
    <>
      <P d={`M${x1},${y1} L${x2},${y2} ${ah(x1, y1, -1)} ${ah(x2, y2, 1)}`} c={dim} w={0.8} />
      {label && <T x={mx} y={my - 3 + off} a="middle">{label}</T>}
    </>
  )
}

const foilPath = (spec, x0, y0, chord, n = 50) =>
  nacaPoints(spec, n)
    .map(([x, y], i) => `${i ? 'L' : 'M'}${(x0 + x * chord).toFixed(1)},${(y0 - y * chord).toFixed(1)}`)
    .join(' ') + ' Z'

/* ────────────────────────────────────────────────────────────── */

const DRAW = {
  /* Silindir arkasında girdap yolu (Kármán) */
  cylinder: () => (
    <>
      {[40, 60, 80, 100, 120, 140].map((y) => (
        <P key={y} d={`M10,${y} C60,${y} 70,${y + (y < 90 ? -14 : 14) * (Math.abs(y - 90) < 40 ? 1 : 0.4)} 110,${y}`} c={faint} w={0.8} />
      ))}
      <P d="M72,90 m-18,0 a18,18 0 1,0 36,0 a18,18 0 1,0 -36,0" w={1.4} />
      <g className="bp-drift">
        {[0, 1, 2, 3, 4].map((i) => {
          const x = 120 + i * 40
          const y = i % 2 ? 104 : 76
          const r = 10 + i * 1.5
          const s = i % 2 ? 0 : 1
          return <P key={i} d={`M${x + r},${y} A${r},${r} 0 1,${s} ${x - r * 0.6},${y + (s ? -r * 0.8 : r * 0.8)} A${r * 0.6},${r * 0.6} 0 1,${s} ${x + r * 0.3},${y}`} c={i % 2 ? dim : ink} w={1} />
        })}
      </g>
      <T x={72} y={126} a="middle">D</T>
      <Dim x1={54} y1={120} x2={90} y2={120} />
      <T x={200} y={160} a="middle">vortex street behind a 2D cylinder</T>
    </>
  ),

  /* Campus Collab arayüz taslağı */
  board: () => (
    <>
      <P d="M20,20 H300 V160 H20 Z" c={faint} />
      <P d="M20,36 H300" c={faint} w={0.8} />
      <T x={28} y={31}>campus collab · my courses</T>
      <P d="M20,36 V160 M76,36 V160" c={faint} w={0.8} />
      {['Courses', 'Projects', 'Societies', 'Tasks'].map((l, i) => (
        <T key={l} x={28} y={54 + i * 16}>{l}</T>
      ))}
      {[0, 1, 2].map((col) => (
        <g key={col}>
          <T x={88 + col * 72} y={52}>{['To do', 'Doing', 'Done'][col]}</T>
          {(col === 2 ? [0, 1] : [0, 1, 2]).map((row) => (
            <P key={row} d={`M${86 + col * 72},${60 + row * 30} h64 v24 h-64 Z`} c={col === 1 ? ink : faint} />
          ))}
        </g>
      ))}
      <P d="M88,150 H290" c={faint} w={3} />
      <P d="M88,150 H214" c={dim} w={3} />
    </>
  ),

  /* Katı yakıtlı motor itki eğrisi */
  thrust: () => (
    <>
      <P d="M36,20 V150 H300" c={faint} />
      <T x={40} y={28}>F [kN]</T>
      <T x={296} y={146} a="end">t [s]</T>
      <P d="M36,150 L44,62 C70,58 110,54 150,52 C190,50 220,56 244,64 L262,120 L280,150" w={1.6} />
      <P d="M44,62 C80,66 120,60 160,58 C200,57 230,64 250,76 L266,130 L280,150" c={dim} w={0.9} dash="3 3" />
      <T x={150} y={44} a="middle">model</T>
      <T x={170} y={80} a="middle">test data</T>
    </>
  ),

  /* Kararsız Hollanda yuvarlanması (sapma açısı) */
  dutchroll: () => {
    let d = 'M36,90'
    for (let x = 0; x <= 260; x += 2) {
      const y = 90 - Math.sin(x / 11) * (6 + x * 0.19)
      d += ` L${36 + x},${y.toFixed(1)}`
    }
    let e = 'M36,90'
    for (let x = 0; x <= 260; x += 2) e += ` L${36 + x},${(90 - (6 + x * 0.19)).toFixed(1)}`
    return (
      <>
        <P d="M36,20 V160 M36,90 H300" c={faint} />
        <T x={40} y={28}>β [deg]</T>
        <T x={296} y={86} a="end">t</T>
        <P d={d} w={1.4} />
        <P d={e} c={dim} w={0.8} dash="3 3" />
        <T x={250} y={30} a="middle">growing envelope</T>
      </>
    )
  },

  /* Yeniden giriş kapsülü, yay şoku ve ısı akısı */
  reentry: () => (
    <>
      <P d="M200,40 C150,60 150,120 200,140" c={dim} w={1.4} />
      <P d="M214,52 A60,60 0 0,0 214,128 L262,110 V70 Z" w={1.4} />
      <P d="M222,62 A48,48 0 0,0 222,118" c={dim} w={2.4} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <P key={i} d={`M30,${50 + i * 16} H${150 + Math.abs(i - 2.5) * 8}`} c={faint} w={0.8} />
      ))}
      <T x={172} y={34} a="middle">bow shock</T>
      <T x={250} y={150} a="middle">peak heating at the nose</T>
      <T x={60} y={40}>V∞</T>
    </>
  ),

  /* Sürükleme poları */
  polar: () => {
    const pts = [-2, 0, 2, 4, 6, 8, 10, 12, 14].map((a) => {
      const CL = 0.055 * a + 0.1
      const CD = 0.012 + 0.05 * CL * CL
      return [60 + CD * 1900, 150 - (CL + 0.1) * 130]
    })
    const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
    return (
      <>
        <P d="M50,20 V160 H300" c={faint} />
        <T x={54} y={28}>CL</T>
        <T x={296} y={156} a="end">CD</T>
        <P d={d} w={1.5} />
        {pts.map(([x, y], i) => (
          <P key={i} d={`M${x - 2.5},${y - 2.5} h5 v5 h-5 Z`} c={dim} w={0.9} />
        ))}
        <T x={200} y={100}>delta wing, low speed</T>
      </>
    )
  },

  /* NACA 2412 kesiti, ölçülü */
  naca2412: () => (
    <>
      <P d={foilPath({ m: 0.02, p: 0.4, t: 0.12 }, 30, 92, 260)} w={1.5} />
      <P d="M30,92 H290" c={faint} w={0.7} dash="4 3" />
      <P d="M95,64 V114 M199,74 V104" c={dim} w={1.2} />
      <T x={95} y={124} a="middle">spar 25%</T>
      <T x={199} y={116} a="middle">spar 65%</T>
      <Dim x1={30} y1={150} x2={290} y2={150} label="c = 1.000" />
      <Dim x1={112} y1={58} x2={112} y2={102} />
      <T x={116} y={52}>t = 0.12c</T>
      <T x={30} y={30}>NACA 2412 · m = 2%, p = 40%</T>
    </>
  ),

  /* 1U CubeSat, 100 × 100 × 113.5 mm, patlatılmış */
  cubesat: () => {
    const iso = (x, y, z) => [160 + (x - y) * 0.62, 118 + (x + y) * 0.36 - z * 0.72]
    const box = (x0, y0, z0, x1, y1, z1) => {
      const c = [
        [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0],
        [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1],
      ].map((p) => iso(...p))
      const e = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]]
      return e.map(([a, b]) => `M${c[a][0].toFixed(1)},${c[a][1].toFixed(1)} L${c[b][0].toFixed(1)},${c[b][1].toFixed(1)}`).join(' ')
    }
    return (
      <>
        <P d={box(0, 0, 0, 100, 100, 113.5)} w={1.3} />
        <P d={box(0, 0, 135, 100, 100, 139)} c={dim} w={1} />
        <P d={box(-28, 0, 0, -24, 100, 113.5)} c={dim} w={1} />
        {[20, 45, 70].map((z) => (
          <P key={z} d={box(10, 10, z, 90, 90, z + 1.6)} c={faint} w={0.8} />
        ))}
        <T x={236} y={40}>top panel</T>
        <T x={40} y={70}>side panel</T>
        <T x={236} y={160}>100 × 100 × 113.5 mm</T>
      </>
    )
  },

  /* Katı yakıtlı motor kesiti */
  motor: () => (
    <>
      <P d="M30,60 H220 L240,74 L260,56 H290 M30,120 H220 L240,106 L260,124 H290" w={1.4} />
      <P d="M30,60 V120" w={1.4} />
      <P d="M38,68 H212 V112 H38 Z" c={dim} w={1} />
      <P d="M38,84 H212 M38,96 H212" c={ink} w={0.8} dash="5 3" />
      {[70, 110, 150, 190].map((x) => (
        <P key={x} d={`M${x},68 V112`} c={faint} w={0.8} />
      ))}
      <T x={125} y={52} a="middle">casing</T>
      <T x={125} y={134} a="middle">propellant grain</T>
      <T x={250} y={48} a="middle">nozzle</T>
      <Dim x1={30} y1={150} x2={290} y2={150} label="L" />
    </>
  ),

  /* İHA üç görünüş */
  uav: () => (
    <>
      <P d="M90,30 L100,30 L104,70 L170,78 L170,84 L104,86 L102,110 L114,116 L114,120 L80,120 L80,116 L92,110 L90,86 L24,84 L24,78 L90,70 Z" w={1.2} />
      <P d="M200,92 L232,86 L264,92 M232,86 V98" w={1.2} />
      <P d="M190,140 H290 M196,140 C200,132 220,130 240,132 L286,134 L290,124" w={1.2} />
      <P d="M40,82 H80 M114,82 H154" c={dim} w={2} />
      <T x={97} y={140} a="middle">top</T>
      <T x={232} y={112} a="middle">front · dihedral</T>
      <T x={240} y={156} a="middle">side</T>
      <T x={50} y={96}>aileron</T>
    </>
  ),

  /* Kapsül burun yarıçapı taraması */
  capsule: () => (
    <>
      {[40, 58, 80].map((r, i) => (
        <P key={r} d={`M${150 - i * 10},${90 - 44} A${r},${r} 0 0,0 ${150 - i * 10},${90 + 44} L${230},${90 + 26} V${90 - 26} Z`} c={i === 1 ? ink : faint} w={i === 1 ? 1.4 : 0.9} />
      ))}
      <T x={120} y={30} a="middle">nose radius sweep</T>
      <T x={250} y={150} a="middle">larger R, lower heat flux</T>
    </>
  ),

  /* Delta kanat rüzgâr tüneli modeli */
  delta: () => (
    <>
      <P d="M60,90 L220,30 L220,150 Z" w={1.4} />
      <P d="M220,86 H300 M220,94 H300" c={dim} w={1.2} />
      <P d="M60,90 H220" c={faint} w={0.8} dash="4 3" />
      <T x={260} y={82} a="middle">sting</T>
      <Dim x1={60} y1={164} x2={220} y2={164} label="root chord" />
      <T x={110} y={60}>Λ</T>
    </>
  ),
}

/**
 * <Blueprint name="naca2412" />
 * Kart kapağı ya da çizim görseli olarak kullanılır.
 */
export default function Blueprint({ name, className = '' }) {
  const Draw = DRAW[name]
  return (
    <div className={`blueprint-bg ${className}`}>
      <motion.svg
        viewBox="0 0 320 180"
        className="w-full h-full"
        variants={{ hidden: {}, show: { transition: { staggerChildren: dur(0.05) } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        aria-hidden="true"
      >
        {Draw ? <Draw /> : null}
      </motion.svg>
    </div>
  )
}
