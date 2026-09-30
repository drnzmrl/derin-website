import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Section from '../components/layout/Section'
import { airfoils, AOA, interp, ackeret } from '../data/flowlab'
import { nacaPoints, rotate, velocityGrid } from '../lib/panel'
import { rgb } from '../config/colors'
import { theme } from '../config/theme.config'
import { dur, motionOff } from '../config/applyTheme'

/* Akış animasyonunun çözüm alanı (veter uzunluğu birimi) */
const BOUNDS = { x0: -0.9, x1: 2.1, y0: -1.1, y1: 1.1 }
const VIEW_W = 1.8 // ekranda görünen genişlik (veter)
const VIEW_H = 1.1 // ekranda görünen en az yükseklik (veter)
const VIEW_CX = 0.5 // görünümün yatay merkezi

// Sıfıra çok yakın değerler (ör. simetrik profilde 0° kaldırma, -4e-6) "-0.000" yazmasın
const fmt = (v, d = 3) => (Math.abs(v) < 0.5 * 10 ** -d ? (0).toFixed(d) : v.toFixed(d))
const pct = (a, b) => (Math.abs(b) < 1e-6 ? null : (Math.abs(a - b) / Math.abs(b)) * 100)

/** Sayıyı yumuşakça hedefe götürür */
function useTween(value, ms = 650) {
  const [shown, setShown] = useState(value)
  const from = useRef(value)
  useEffect(() => {
    if (motionOff()) {
      setShown(value)
      from.current = value
      return
    }
    const start = performance.now()
    const a = from.current
    let raf
    const step = (now) => {
      const k = Math.min(1, (now - start) / ms)
      const e = 1 - Math.pow(1 - k, 3)
      const v = a + (value - a) * e
      setShown(v)
      from.current = v
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, ms])
  return shown
}

/** Seçime göre şok çizgileri (süpersonik ve transonik) */
function shockModel(foil, mach, aoa) {
  const [le] = rotate([[0, 0]], aoa)
  const [te] = rotate([[1, 0]], aoa)
  if (mach > 1) {
    const mu = Math.asin(1 / mach)
    const delta = mach < 1.3 ? 0.15 : 0.06 // M → 1 yaklaştıkça şok daha uzakta durur
    const bowX = (y) => {
      const dy = (y - le[1]) / Math.tan(mu)
      return le[0] - delta + Math.sqrt(delta * delta + dy * dy) - delta
    }
    return { kind: 'super', mu, le, te, bowX }
  }
  if (mach > 0.7) {
    // Transonik: üst yüzeyde normal şok; simetrik ve 0° ise altta da
    const up = nacaPoints(foil, 60).slice(60)
    const lo = nacaPoints(foil, 60).slice(0, 61).reverse()
    const at = aoa === 0 ? 0.5 : aoa === 8 ? 0.42 : 0.32
    const pick = (list) => list.reduce((b, p) => (Math.abs(p[0] - at) < Math.abs(b[0] - at) ? p : b))
    const h = 0.14 + aoa * 0.006
    const shocks = [{ base: pick(up), dir: 1, h }]
    if (aoa === 0) shocks.push({ base: pick(lo), dir: -1, h: h * (foil.m ? 0.6 : 1) })
    return {
      kind: 'trans',
      shocks: shocks.map((s) => {
        const [a, b] = rotate([s.base, [s.base[0], s.base[1] + s.dir * s.h]], aoa)
        return [a, b]
      }),
    }
  }
  return { kind: 'sub' }
}

/* ────────────────────────────────────────────────────────────── */

function FlowCanvas({ foilKey, runIdx, aoa }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const simRef = useRef(null)
  const [ready, setReady] = useState(false)

  const foil = airfoils[foilKey]
  const run = foil.runs[runIdx]

  // Geometri + hız ızgarası (seçim değişince yeniden hesaplanır)
  useEffect(() => {
    setReady(false)
    const id = setTimeout(() => {
      const pts = rotate(nacaPoints(foil, 40), aoa)
      const pg = run.mach < 0.95 ? 1 / Math.sqrt(1 - run.mach * run.mach) : 1
      const small = window.innerWidth < 768
      const grid = velocityGrid(pts, BOUNDS, small ? 110 : 150, small ? 84 : 112, Math.min(pg, 1.6))
      simRef.current = { pts, grid, shock: shockModel(foil, run.mach, aoa), mach: run.mach }
      setReady(true)
    }, 20)
    return () => clearTimeout(id)
  }, [foilKey, runIdx, aoa]) // eslint-disable-line react-hooks/exhaustive-deps

  // Çizim döngüsü
  useEffect(() => {
    if (!ready) return
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    const ctx = canvas.getContext('2d')
    const still = motionOff()
    const small = window.innerWidth < 768
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2)
    const C = { accent: rgb('accent'), warm: rgb('warm'), text: rgb('text'), horizon: rgb('horizon') }

    let W = 0
    let H = 0
    let scale = 1
    let yHalf = 0.6
    const resize = () => {
      const r = wrap.getBoundingClientRect()
      W = r.width
      H = r.height
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      scale = Math.min(W / VIEW_W, H / VIEW_H)
      yHalf = H / scale / 2
    }
    resize()
    const toPx = (x, y) => [W / 2 + (x - VIEW_CX) * scale, H / 2 - y * scale]
    const xMin = () => VIEW_CX - W / scale / 2
    const xMax = () => VIEW_CX + W / scale / 2

    const sim = simRef.current
    const { grid, pts, shock } = sim

    const velocity = (x, y) => {
      if (shock.kind === 'super' && x < shock.bowX(y)) return [1, 0, 0]
      return grid.sample(x, y)
    }

    // Hıza göre renk kovaları: yavaş = sıcak, hızlı = soğuk mavi
    const BUCKETS = 10
    const mix = (a, b, k) => Math.round(a + (b - a) * k)
    const bucketColor = (i) => {
      const k = i / (BUCKETS - 1)
      const [c1, c2, kk] = k < 0.5 ? [C.warm, C.text, k * 2] : [C.text, C.accent, (k - 0.5) * 2]
      return `rgba(${mix(c1.r, c2.r, kk)},${mix(c1.g, c2.g, kk)},${mix(c1.b, c2.b, kk)},0.85)`
    }
    const colors = Array.from({ length: BUCKETS }, (_, i) => bucketColor(i))
    const bucketOf = (s) => {
      const k = Math.max(0, Math.min(1, (s - 0.55) / 0.95))
      return Math.min(BUCKETS - 1, Math.floor(k * BUCKETS))
    }

    const drawBody = () => {
      // şoklar
      ctx.save()
      ctx.lineCap = 'round'
      ctx.shadowColor = `rgba(${C.horizon.r},${C.horizon.g},${C.horizon.b},0.8)`
      ctx.shadowBlur = 10
      ctx.strokeStyle = `rgba(${C.horizon.r},${C.horizon.g},${C.horizon.b},0.75)`
      ctx.lineWidth = 1.6
      if (shock.kind === 'super') {
        ctx.beginPath()
        let first = true
        for (let y = -yHalf; y <= yHalf; y += 0.02) {
          const [px, py] = toPx(shock.bowX(y), y)
          first ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
          first = false
        }
        ctx.stroke()
        const L = 2.2
        for (const s of [1, -1]) {
          ctx.beginPath()
          ctx.moveTo(...toPx(shock.te[0], shock.te[1]))
          ctx.lineTo(...toPx(shock.te[0] + L * Math.cos(shock.mu), shock.te[1] + s * L * Math.sin(shock.mu)))
          ctx.globalAlpha = 0.55
          ctx.stroke()
          ctx.globalAlpha = 1
        }
      } else if (shock.kind === 'trans') {
        for (const [a, b] of shock.shocks) {
          ctx.beginPath()
          ctx.moveTo(...toPx(a[0], a[1]))
          ctx.lineTo(...toPx(b[0], b[1]))
          ctx.stroke()
        }
      }
      ctx.restore()

      // profil
      ctx.beginPath()
      pts.forEach(([x, y], i) => {
        const [px, py] = toPx(x, y)
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)
      })
      ctx.closePath()
      ctx.fillStyle = '#0a0f1e'
      ctx.fill()
      ctx.lineWidth = 1.4
      ctx.strokeStyle = `rgba(${C.accent.r},${C.accent.g},${C.accent.b},0.9)`
      ctx.stroke()

      // veter çizgisi
      const [a, b] = rotate([[0, 0], [1, 0]], aoa)
      ctx.setLineDash([3, 4])
      ctx.beginPath()
      ctx.moveTo(...toPx(a[0], a[1]))
      ctx.lineTo(...toPx(b[0], b[1]))
      ctx.strokeStyle = `rgba(${C.text.r},${C.text.g},${C.text.b},0.25)`
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.setLineDash([])
    }

    /* Hareket azaltılmışsa: durağan akım çizgileri */
    if (still) {
      ctx.clearRect(0, 0, W, H)
      const lines = 30
      for (let i = 0; i < lines; i++) {
        let x = xMin()
        let y = -yHalf + ((i + 0.5) / lines) * yHalf * 2
        ctx.beginPath()
        ctx.moveTo(...toPx(x, y))
        for (let s = 0; s < 700; s++) {
          const [u, v, solid] = velocity(x, y)
          if (solid) break
          x += u * 0.005
          y += v * 0.005
          if (x > xMax()) break
          ctx.lineTo(...toPx(x, y))
        }
        ctx.strokeStyle = `rgba(${C.accent.r},${C.accent.g},${C.accent.b},0.35)`
        ctx.lineWidth = 1
        ctx.stroke()
      }
      drawBody()
      return
    }

    /* Parçacıklar */
    const COUNT = small ? 340 : 720
    const P = []
    const spawn = (p, anywhere) => {
      p.x = anywhere ? xMin() + Math.random() * (xMax() - xMin()) : xMin() - Math.random() * 0.1
      p.y = (Math.random() * 2 - 1) * yHalf
      p.age = 0
      p.life = 2.5 + Math.random() * 3.5
      return p
    }
    for (let i = 0; i < COUNT; i++) P.push(spawn({}, true))

    const SPEED = 0.42 // veter/saniye
    let raf
    let last = performance.now()
    let visible = true

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      // eski izleri söndür (arka plan CSS'te, tuval saydam)
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0,0,0,0.11)'
      ctx.fillRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'source-over'

      const paths = Array.from({ length: BUCKETS }, () => new Path2D())
      for (const p of P) {
        const [u, v, solid] = velocity(p.x, p.y)
        p.age += dt
        if (solid || p.age > p.life || p.x > xMax() + 0.05 || Math.abs(p.y) > yHalf + 0.05) {
          spawn(p, false)
          continue
        }
        const ox = p.x
        const oy = p.y
        p.x += u * SPEED * dt
        p.y += v * SPEED * dt
        const s = Math.hypot(u, v)
        const path = paths[bucketOf(s)]
        const [ax, ay] = toPx(ox, oy)
        const [bx, by] = toPx(p.x, p.y)
        path.moveTo(ax, ay)
        path.lineTo(bx, by)
      }
      ctx.lineWidth = small ? 1.1 : 1.3
      ctx.lineCap = 'round'
      paths.forEach((path, i) => {
        ctx.strokeStyle = colors[i]
        ctx.stroke(path)
      })
      drawBody()
      if (visible) raf = requestAnimationFrame(frame)
    }

    const io = new IntersectionObserver(([e]) => {
      const was = visible
      visible = e.isIntersecting
      if (visible && !was) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    })
    io.observe(wrap)
    const ro = new ResizeObserver(() => {
      resize()
      ctx.clearRect(0, 0, W, H)
    })
    ro.observe(wrap)
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
    }
  }, [ready, aoa])

  return (
    <div
      ref={wrapRef}
      className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-card border border-text/10 flow-grid"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      {/* Serbest akış etiketi */}
      <div className="absolute left-3 top-3 font-mono text-[11px] text-text-dim flex items-center gap-2 pointer-events-none">
        <span className="text-accent">M∞ {run.mach}</span>
        <span className="text-muted">→</span>
        <span>α {aoa}°</span>
        <span className="text-muted hidden sm:inline">· {foil.label}</span>
      </div>
      <div className="absolute right-3 top-3 font-mono text-[10px] uppercase tracking-[0.16em] text-warm/80 pointer-events-none">
        {run.regime}
      </div>

      {!ready && (
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-mono text-[11px] text-muted">solving panels…</span>
        </div>
      )}

      {/* Hız lejantı */}
      <div className="absolute left-3 bottom-3 flex items-center gap-2 font-mono text-[10px] text-muted pointer-events-none">
        <span>slower</span>
        <span className="h-1 w-16 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(var(--c-warm)), rgb(var(--c-text)), rgb(var(--c-accent)))' }} />
        <span>faster</span>
        {run.mach > 0.7 && (
          <>
            <span className="ml-2 h-px w-4" style={{ background: 'rgb(var(--c-horizon))', boxShadow: '0 0 6px rgb(var(--c-horizon))' }} />
            <span>shock</span>
          </>
        )}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────── */

function LiftChart({ foil, runIdx, aoaIdx }) {
  const Wd = 360
  const Ht = 220
  const pad = { l: 34, r: 10, t: 10, b: 26 }
  const X = (a) => pad.l + ((a + 5) / 23) * (Wd - pad.l - pad.r)
  const Y = (c) => pad.t + (1 - (c + 0.6) / 2.4) * (Ht - pad.t - pad.b)
  const run = foil.runs[runIdx]
  const line = (xs, ys) => xs.map((x, i) => `${i ? 'L' : 'M'}${X(x).toFixed(1)},${Y(ys[i]).toFixed(1)}`).join(' ')
  const theory = run.mach > 1 ? AOA.map((a) => ackeret(run.mach, a).CL) : null
  const c = (name, a = 1) => `rgb(var(--c-${name}) / ${a})`
  const label = { fill: c('muted'), fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }

  return (
    <svg viewBox={`0 0 ${Wd} ${Ht}`} className="w-full h-auto" role="img" aria-label={`Lift coefficient against angle of attack for ${foil.label}`}>
      <defs>
        {/* eğriler eksen alanının dışına taşmasın (NACA 2415 verisi -8°'den başlıyor) */}
        <clipPath id="lift-plot">
          <rect x={pad.l} y={pad.t} width={Wd - pad.l - pad.r} height={Ht - pad.t - pad.b} />
        </clipPath>
      </defs>
      {/* ızgara */}
      {[-0.5, 0, 0.5, 1, 1.5].map((v) => (
        <g key={v}>
          <line x1={pad.l} x2={Wd - pad.r} y1={Y(v)} y2={Y(v)} style={{ stroke: c('text', 0.07) }} />
          <text x={pad.l - 6} y={Y(v) + 3} textAnchor="end" style={label}>{v}</text>
        </g>
      ))}
      {[0, 5, 10, 15].map((a) => (
        <g key={a}>
          <line x1={X(a)} x2={X(a)} y1={pad.t} y2={Ht - pad.b} style={{ stroke: c('text', 0.05) }} />
          <text x={X(a)} y={Ht - pad.b + 12} textAnchor="middle" style={label}>{a}°</text>
        </g>
      ))}
      <text x={Wd - pad.r} y={Ht - 3} textAnchor="end" style={label}>α</text>
      <text x={4} y={pad.t + 8} style={label}>
        C<tspan dy="2" fontSize="7">L</tspan>
      </text>

      <g clipPath="url(#lift-plot)">
      {/* NASA deneyi (düşük hız); transonik/süpersonikte soluk */}
      <g style={{ opacity: run.mach < 0.7 ? 1 : 0.35 }}>
        <path d={line(foil.nasa.aoa, foil.nasa.CL)} fill="none" strokeWidth="1.2" style={{ stroke: c('text', 0.45) }} />
        {foil.nasa.aoa.map((a, i) => (
          <circle key={a} cx={X(a)} cy={Y(foil.nasa.CL[i])} r="2" strokeWidth="1" style={{ fill: c('space'), stroke: c('text', 0.6) }} />
        ))}
      </g>

      {/* diğer Mach sayıları soluk */}
      {foil.runs.map((r, i) =>
        i === runIdx ? null : (
          <path key={r.mach} d={line(AOA, r.CL)} fill="none" strokeWidth="1" style={{ stroke: c('accent', 0.16) }} />
        )
      )}

      {/* teori */}
      {theory && (
        <path d={line(AOA, theory)} fill="none" strokeWidth="1.2" strokeDasharray="4 3" style={{ stroke: c('warm', 0.8) }} />
      )}

      {/* seçili CFD serisi */}
      <motion.path
        key={`${foil.label}-${runIdx}`}
        d={line(AOA, run.CL)}
        fill="none"
        strokeWidth="2"
        style={{ stroke: c('accent') }}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: dur(0.7), ease: theme.motion.ease }}
      />
      {AOA.map((a, i) => (
        <rect key={a} x={X(a) - 3} y={Y(run.CL[i]) - 3} width="6" height="6" style={{ fill: c('accent') }} />
      ))}
      <motion.circle
        r="7"
        fill="none"
        strokeWidth="1.5"
        style={{ stroke: c('warm') }}
        initial={false}
        animate={{ cx: X(AOA[aoaIdx]), cy: Y(run.CL[aoaIdx]) }}
        transition={{ duration: dur(0.5), ease: theme.motion.ease }}
      />
      </g>
    </svg>
  )
}

/* ────────────────────────────────────────────────────────────── */

function Segmented({ label, options, value, onChange }) {
  return (
    <div>
      <p className="eyebrow mb-2">{label}</p>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const on = o.value === value
          return (
            <button
              key={o.value}
              role="radio"
              aria-checked={on}
              onClick={() => onChange(o.value)}
              className={`relative px-3 py-2 rounded-soft text-left border transition-colors duration-300 ${
                on ? 'border-accent/50 bg-accent/10 text-text' : 'border-text/10 text-text-dim hover:border-text/25 hover:text-text'
              }`}
            >
              <span className="block font-mono text-xs">{o.title}</span>
              {o.sub && <span className="block text-[10px] text-muted mt-0.5">{o.sub}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Readout({ label, value, digits = 3, accent }) {
  const v = useTween(value)
  return (
    <div className="panel px-3 py-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className={`font-display text-2xl font-semibold mt-1 tabular-nums ${accent ? 'text-accent' : 'text-text'}`}>
        {fmt(v, digits)}
      </p>
    </div>
  )
}

/** Seçime göre referansla karşılaştırma notu */
function reference(foil, run, aoa, CL, CD) {
  const sub = run.mach < 0.7
  if (sub) {
    const exp = interp(foil.nasa.aoa, foil.nasa.CL, aoa)
    if (foil.m === 0 && aoa === 0) {
      return { title: 'NASA experiment', value: 'CL ≈ 0', text: 'Symmetric airfoil at zero incidence: no lift, and the CFD agrees.' }
    }
    const e = pct(CL, exp)
    // NACA 2415 deneyi ~14°'de tutunmayı kaybediyor (CL tepe noktası)
    const stalled = foil.m > 0 && aoa >= 16
    return {
      title: 'NASA experiment',
      value: `CL = ${exp.toFixed(3)}`,
      diff: e,
      text: stalled
        ? 'The experiment stalls near 14°. The steady RANS run keeps producing lift past that point, so the gap opens up here.'
        : `Measured by ${foil.nasa.source}, Re = 6×10⁶.`,
    }
  }
  if (run.mach < 1) {
    const base = foil.runs[0].CD[AOA.indexOf(aoa)]
    return {
      title: 'Transonic',
      value: `CD × ${(CD / base).toFixed(1)}`,
      text: 'No simple reference here: the flow is mixed, with pockets of supersonic flow ending in shocks on the surface. Drag compared with the subsonic run at the same angle.',
    }
  }
  const th = ackeret(run.mach, aoa)
  if (aoa === 0) {
    return {
      title: 'Linearized theory',
      value: 'CD = 0',
      text: 'Thin-plate theory predicts no wave drag at zero incidence. The CFD still sees drag from thickness and viscosity.',
    }
  }
  return {
    title: 'Linearized (Ackeret) theory',
    value: `CL = ${th.CL.toFixed(3)}`,
    diff: pct(CL, th.CL),
    text: 'The theory treats the airfoil as a thin flat plate with small angles, so thickness, camber and viscous effects are left out.',
  }
}

export default function FlowLab({ config }) {
  const [foilKey, setFoilKey] = useState('0012')
  const [runIdx, setRunIdx] = useState(0)
  const [aoaIdx, setAoaIdx] = useState(1)

  const foil = airfoils[foilKey]
  const run = foil.runs[runIdx]
  const aoa = AOA[aoaIdx]
  const CL = run.CL[aoaIdx]
  const CD = run.CD[aoaIdx]
  const LD = CD > 0 ? CL / CD : 0
  const ref = useMemo(() => reference(foil, run, aoa, CL, CD), [foil, run, aoa, CL, CD])

  return (
    <Section config={config}>
      <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_1fr] gap-6 lg:gap-8 items-start">
        <div>
          <FlowCanvas foilKey={foilKey} runIdx={runIdx} aoa={aoa} />
          <p className="mt-3 text-[11px] leading-relaxed text-muted">
            The animation is illustrative: an inviscid panel solution with a Prandtl–Glauert correction, and shocks sketched
            from the Mach angle. The coefficients are from my steady 2D RANS runs in ANSYS Fluent (k-ω SST); the NASA
            reference data are low-speed measurements at Re = 6 × 10⁶.
          </p>
        </div>

        <div className="space-y-5">
          <Segmented
            label="Airfoil"
            value={foilKey}
            onChange={setFoilKey}
            options={Object.entries(airfoils).map(([k, f]) => ({ value: k, title: f.label, sub: f.note }))}
          />
          <Segmented
            label="Mach number"
            value={runIdx}
            onChange={setRunIdx}
            options={foil.runs.map((r, i) => ({ value: i, title: `M ${r.mach}`, sub: r.regime }))}
          />
          <Segmented
            label="Angle of attack"
            value={aoaIdx}
            onChange={setAoaIdx}
            options={AOA.map((a, i) => ({ value: i, title: `${a}°` }))}
          />

          <div className="grid grid-cols-3 gap-2">
            <Readout label={<>C<sub>L</sub></>} value={CL} accent />
            <Readout label={<>C<sub>D</sub></>} value={CD} digits={4} />
            <Readout label="L / D" value={LD} digits={1} />
          </div>

          <div className="panel p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <p className="eyebrow">{ref.title}</p>
              <p className="font-mono text-xs text-text whitespace-nowrap">
                {ref.value}
                {ref.diff != null && <span className="ml-2 text-warm">Δ {ref.diff.toFixed(1)}%</span>}
              </p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-text-dim">{ref.text}</p>
          </div>

          <div className="panel p-3">
            <LiftChart foil={foil} runIdx={runIdx} aoaIdx={aoaIdx} />
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-muted px-1">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 bg-accent" /> CFD, M {run.mach}</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full border border-text/60" /> NASA experiment, low speed</span>
              {run.mach > 1 && (
                <span className="flex items-center gap-1.5"><span className="h-px w-3 border-t border-dashed border-warm" /> Ackeret theory</span>
              )}
              <span className="flex items-center gap-1.5"><span className="h-px w-3 bg-accent/30" /> other Mach</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24 horizon-line" />
    </Section>
  )
}
