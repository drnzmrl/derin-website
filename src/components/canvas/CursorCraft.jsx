import { useEffect, useRef } from 'react'
import { site } from '../../config/site.config'
import { rgb } from '../../config/colors'
import { motionOff } from '../../config/applyTheme'

/* İmleci takip eden araç. Hangisi çizileceği site.config.js →
   cursorCraft ile seçilir: 'rocket' | 'plane' | 'none'          */

const FOLLOW = 0.028
const DAMPING = 0.35
const TRAIL_MAX = 80

/* ── Roket ───────────────────────────────────────────────────── */
function drawRocket(ctx, x, y, angle, c, s = 12) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)

  const body = `rgba(${c.text.r},${c.text.g},${c.text.b},0.9)`
  const fill = `rgba(${c.text.r},${c.text.g},${c.text.b},0.1)`

  ctx.lineWidth = 1
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.strokeStyle = body
  ctx.fillStyle = fill

  // Gövde: sivri burun, silindirik ana bölüm
  ctx.beginPath()
  ctx.moveTo(s * 1.45, 0)
  ctx.quadraticCurveTo(s * 0.55, -s * 0.34, s * 0.1, -s * 0.34)
  ctx.lineTo(-s * 0.9, -s * 0.34)
  ctx.lineTo(-s * 0.9, s * 0.34)
  ctx.lineTo(s * 0.1, s * 0.34)
  ctx.quadraticCurveTo(s * 0.55, s * 0.34, s * 1.45, 0)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Burun bandı
  ctx.beginPath()
  ctx.moveTo(s * 0.42, -s * 0.31)
  ctx.lineTo(s * 0.42, s * 0.31)
  ctx.strokeStyle = `rgba(${c.accent.r},${c.accent.g},${c.accent.b},0.6)`
  ctx.stroke()

  // Kanatçıklar
  ctx.strokeStyle = body
  ctx.fillStyle = `rgba(${c.warm.r},${c.warm.g},${c.warm.b},0.18)`
  for (const sign of [-1, 1]) {
    ctx.beginPath()
    ctx.moveTo(-s * 0.55, sign * s * 0.32)
    ctx.lineTo(-s * 1.15, sign * s * 0.95)
    ctx.lineTo(-s * 0.92, sign * s * 0.3)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }

  // Motor ağzı
  ctx.beginPath()
  ctx.moveTo(-s * 0.9, -s * 0.3)
  ctx.lineTo(-s * 1.12, -s * 0.42)
  ctx.lineTo(-s * 1.12, s * 0.42)
  ctx.lineTo(-s * 0.9, s * 0.3)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Sıcak egzoz parıltısı
  const g = ctx.createRadialGradient(-s * 1.2, 0, 0, -s * 1.2, 0, s * 0.62)
  g.addColorStop(0, `rgba(${c.horizon.r},${c.horizon.g},${c.horizon.b},0.6)`)
  g.addColorStop(0.5, `rgba(${c.warm.r},${c.warm.g},${c.warm.b},0.25)`)
  g.addColorStop(1, `rgba(${c.warm.r},${c.warm.g},${c.warm.b},0)`)
  ctx.beginPath()
  ctx.arc(-s * 1.2, 0, s * 0.62, 0, Math.PI * 2)
  ctx.fillStyle = g
  ctx.fill()

  ctx.restore()
}

/* ── Jet ─────────────────────────────────────────────────────── */
function drawPlane(ctx, x, y, angle, c, s = 12) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)

  ctx.strokeStyle = `rgba(${c.text.r},${c.text.g},${c.text.b},0.85)`
  ctx.fillStyle = `rgba(${c.text.r},${c.text.g},${c.text.b},0.1)`
  ctx.lineWidth = 1
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  // Gövde
  ctx.beginPath()
  ctx.moveTo(s * 1.3, 0)
  ctx.lineTo(s * 0.1, -s * 0.14)
  ctx.lineTo(-s * 0.8, -s * 0.12)
  ctx.lineTo(-s * 1.05, 0)
  ctx.lineTo(-s * 0.8, s * 0.12)
  ctx.lineTo(s * 0.1, s * 0.14)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Delta kanatlar
  for (const sign of [-1, 1]) {
    ctx.beginPath()
    ctx.moveTo(s * 0.2, 0)
    ctx.lineTo(-s * 0.3, sign * s)
    ctx.lineTo(-s * 0.65, sign * s)
    ctx.lineTo(-s * 0.55, 0)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }

  // Kuyruk
  for (const sign of [-1, 1]) {
    ctx.beginPath()
    ctx.moveTo(-s * 0.62, 0)
    ctx.lineTo(-s * 0.88, sign * s * 0.42)
    ctx.lineTo(-s * 1.05, sign * s * 0.1)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }

  const g = ctx.createRadialGradient(-s * 1.1, 0, 0, -s * 1.1, 0, s * 0.42)
  g.addColorStop(0, `rgba(${c.accent.r},${c.accent.g},${c.accent.b},0.45)`)
  g.addColorStop(1, `rgba(${c.accent.r},${c.accent.g},${c.accent.b},0)`)
  ctx.beginPath()
  ctx.arc(-s * 1.1, 0, s * 0.42, 0, Math.PI * 2)
  ctx.fillStyle = g
  ctx.fill()

  ctx.restore()
}

const CRAFT = { rocket: drawRocket, plane: drawPlane }

export default function CursorCraft() {
  const canvasRef = useRef(null)
  const kind = site.cursorCraft

  useEffect(() => {
    const drawCraft = CRAFT[kind]
    if (!drawCraft) return
    if (motionOff()) return
    // Dokunmatik cihazlarda imleç yok — çizme
    if (window.matchMedia('(pointer: coarse)').matches) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const c = {
      text: rgb('text'),
      accent: rgb('accent'),
      warm: rgb('warm'),
      horizon: rgb('horizon'),
    }
    // Roket sıcak, jet soğuk iz bırakır
    const plume = kind === 'rocket' ? c.warm : c.accent

    // Retina ekranlarda bulanık görünmesin: piksel yoğunluğuyla ölçekle
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let px = mouseX
    let py = mouseY
    let vx = 0
    let vy = 0
    let angle = 0
    const trail = []
    let raf

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const tick = () => {
      vx = (vx + (mouseX - px) * FOLLOW) * DAMPING
      vy = (vy + (mouseY - py) * FOLLOW) * DAMPING
      px += vx
      py += vy

      const speed = Math.hypot(vx, vy)

      // İmleç durduysa ve iz tükendiyse görüntü değişmiyor demektir —
      // tam ekran temizleyip yeniden çizmeye gerek yok.
      if (speed < 0.02 && trail.length === 0) {
        raf = requestAnimationFrame(tick)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (speed > 0.3) angle = Math.atan2(vy, vx)

      // İz parçacıkları — hız arttıkça yoğunlaşır
      if (speed > 1.6) {
        const count = speed > 20 ? 3 : speed > 8 ? 2 : 1
        for (let i = 0; i < count; i++) {
          trail.push({
            x: px - Math.cos(angle) * 14 + (Math.random() - 0.5) * 4,
            y: py - Math.sin(angle) * 14 + (Math.random() - 0.5) * 4,
            age: 0,
            size: Math.random() * 2.4 + 0.8,
            drift: (Math.random() - 0.5) * 0.25,
          })
        }
      }

      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i]
        p.age++
        if (p.age > TRAIL_MAX) {
          trail.splice(i, 1)
          continue
        }
        const life = 1 - p.age / TRAIL_MAX
        // Duman gibi yayılsın: yaşlandıkça büyür ve saçılır
        p.x += p.drift
        p.y += p.drift * 0.6
        const spread = 1 + (1 - life) * 2.2
        const a = life * life * (kind === 'rocket' ? 0.45 : 0.3)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * spread * 0.7, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${plume.r},${plume.g},${plume.b},${a})`
        ctx.fill()
      }

      drawCraft(ctx, px, py, angle, c)
      raf = requestAnimationFrame(tick)
    }

    tick()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [kind])

  if (!CRAFT[kind]) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999, mixBlendMode: 'screen' }}
    />
  )
}
