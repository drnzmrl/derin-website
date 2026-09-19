import { useEffect, useRef } from 'react'

const ACCENT = { r: 79, g: 195, b: 247 }
const TRAIL_MAX = 90
const FOLLOW_FORCE = 0.028
const DAMPING = 0.35

const SHOCK_TRIGGER_SPEED = 6
const SHOCK_DURATION = 90 // yaklaşık 1.5 saniye (60fps civarı)

// Sleek modern fighter jet çizer
function drawPlane(ctx, x, y, angle, scale = 13) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)

  ctx.strokeStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},0.92)`
  ctx.fillStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},0.12)`
  ctx.lineWidth = 1
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  const s = scale

  // Fuselage (gövde)
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

  // Ana kanatlar (delta wing)
  ctx.beginPath()
  ctx.moveTo(s * 0.2, 0)
  ctx.lineTo(-s * 0.3, -s * 1.0)
  ctx.lineTo(-s * 0.65, -s * 1.0)
  ctx.lineTo(-s * 0.55, 0)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(s * 0.2, 0)
  ctx.lineTo(-s * 0.3, s * 1.0)
  ctx.lineTo(-s * 0.65, s * 1.0)
  ctx.lineTo(-s * 0.55, 0)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Kuyruk kanatları
  ctx.beginPath()
  ctx.moveTo(-s * 0.62, 0)
  ctx.lineTo(-s * 0.88, -s * 0.42)
  ctx.lineTo(-s * 1.05, -s * 0.1)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(-s * 0.62, 0)
  ctx.lineTo(-s * 0.88, s * 0.42)
  ctx.lineTo(-s * 1.05, s * 0.1)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Engine glow (egzoz)
  const grd = ctx.createRadialGradient(-s * 1.1, 0, 0, -s * 1.1, 0, s * 0.4)
  grd.addColorStop(0, `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},0.55)`)
  grd.addColorStop(1, `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},0)`)
  ctx.beginPath()
  ctx.arc(-s * 1.1, 0, s * 0.4, 0, Math.PI * 2)
  ctx.fillStyle = grd
  ctx.fill()

  ctx.restore()
}

function drawShock(ctx, x, y, angle, life) {
  if (life <= 0) return

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)

  const t = life
  const opacity = 0.18 + t * 0.42
  const R = 180, G = 225, B = 255

  ctx.lineCap = 'round'

  const drawShockPair = (originX, len, angle) => {
    const ex = originX - Math.cos(angle) * len
    const ey = Math.sin(angle) * len

    // Glow
    for (const sign of [-1, 1]) {
      const grad = ctx.createLinearGradient(originX, 0, ex, sign * ey)
      grad.addColorStop(0, `rgba(${R},${G},${B},${opacity * 0.5})`)
      grad.addColorStop(1, `rgba(${R},${G},${B},0)`)
      ctx.strokeStyle = grad
      ctx.lineWidth = 2.5
      ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(ex, sign * ey); ctx.stroke()
    }

    // Ana ince çizgi
    ctx.strokeStyle = `rgba(${R},${G},${B},${opacity})`
    ctx.lineWidth = 1.0
    ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(ex, -ey); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(ex,  ey); ctx.stroke()
  }

  // Burun şoku — uzun, dar açı
  drawShockPair(17, 55 + t * 20, 20 * Math.PI / 180)

  // Kuyruk şoku — kısa, geniş açı
  drawShockPair(-14, 18 + t * 8, 27 * Math.PI / 180)

  ctx.restore()
}

function drawExpansion(ctx, x, y, angle, life) {
  if (life <= 0) return

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)

  const t = life
  const opacity = 0.12 + t * 0.28
  const R = 180, G = 225, B = 255
  const s = 13

  // Kanat en geniş noktası (trailing edge bölgesi)
  const wx = -s * 0.48
  const wy = s * 1.0

  ctx.lineCap = 'round'
  const numLines = 5
  const fanLen = 38 + t * 22

  for (const sign of [-1, 1]) {
    for (let i = 0; i < numLines; i++) {
      const frac = i / (numLines - 1)
      // Fan: 20° - 70° arası (dışa doğru perpendicular'dan geriye sweep)
      const fanDeg = 20 + frac * 50
      const fanRad = fanDeg * Math.PI / 180

      const startX = wx
      const startY = sign * wy
      const endX = startX - Math.sin(fanRad) * fanLen
      const endY = startY + sign * Math.cos(fanRad) * fanLen

      const lineOpacity = opacity * (1 - frac * 0.5)

      const grad = ctx.createLinearGradient(startX, startY, endX, endY)
      grad.addColorStop(0, `rgba(${R},${G},${B},${lineOpacity})`)
      grad.addColorStop(1, `rgba(${R},${G},${B},0)`)

      ctx.strokeStyle = grad
      ctx.lineWidth = 0.9
      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.stroke()
    }
  }

  ctx.restore()
}

export default function PlaneTrail() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let planeX = mouseX
    let planeY = mouseY
    let velX = 0
    let velY = 0
    let angle = 0
    let speed = 0
    let shockFrames = 0
    const trail = []

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener('mousemove', onMove)

    let animId

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const dx = mouseX - planeX
      const dy = mouseY - planeY

      velX += dx * FOLLOW_FORCE
      velY += dy * FOLLOW_FORCE

      velX *= DAMPING
      velY *= DAMPING

      planeX += velX
      planeY += velY

      speed = Math.sqrt(velX * velX + velY * velY)

      // Sadece hareket ederken açıyı güncelle
      if (speed > 0.3) {
        angle = Math.atan2(velY, velX)
      }
      // Shock tetikleme
      if (speed > SHOCK_TRIGGER_SPEED) {
        shockFrames = SHOCK_DURATION
       } else if (shockFrames > 0) {
        shockFrames--
       }

      // Trail partikülleri: hıza göre yoğunluk
      if (speed > 2) {
        const count = speed > 20 ? 3 : speed > 8 ? 2 : 1
        for (let i = 0; i < count; i++) {
          // Uçağın arkasında egzoz konumu
          const ex = planeX - Math.cos(angle) * 14 + (Math.random() - 0.5) * 3
          const ey = planeY - Math.sin(angle) * 14 + (Math.random() - 0.5) * 3
          trail.push({
            x: ex,
            y: ey,
            age: 0,
            size: Math.random() * 2.2 + 0.6,
          })
        }
      }

      // Trail çiz ve yaşlandır
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i]
        p.age++
        if (p.age > TRAIL_MAX) {
          trail.splice(i, 1)
          continue
        }
        const life = 1 - p.age / TRAIL_MAX
        const opacity = life * life * 0.65  // kare azalma — daha yumuşak söner

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${opacity})`
        ctx.fill()
      }

      // Trail çizgi (son 20 nokta arası ince çizgi)
      if (trail.length > 6) {
        ctx.beginPath()
        ctx.moveTo(trail[trail.length - 1].x, trail[trail.length - 1].y)
        const from = Math.max(0, trail.length - 20)
        for (let i = trail.length - 2; i >= from; i--) {
          ctx.lineTo(trail[i].x, trail[i].y)
        }
        const lineOpacity = Math.min(speed / 60, 0.35)
        ctx.strokeStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${lineOpacity})`
        ctx.lineWidth = 0.8
        ctx.stroke()
      }


      if (shockFrames > 0) {
        const shockLife = shockFrames / SHOCK_DURATION
        drawShock(ctx, planeX, planeY, angle, shockLife)
      }

      // Uçağı çiz
      drawPlane(ctx, planeX, planeY, angle)

      animId = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999, mixBlendMode: 'screen' }}
    />
  )
}
