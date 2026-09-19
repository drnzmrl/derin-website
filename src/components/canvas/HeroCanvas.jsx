import { useEffect, useRef } from 'react'
import { rgb } from '../../config/colors'
import { motionOff } from '../../config/applyTheme'

/**
 * Hero arkasındaki yumuşak yörünge katmanı:
 * iki eliptik yörünge, üzerlerinde yavaşça dolaşan birer uydu,
 * ve aşağıda bir gezegen kıvrımı. Izgara yok, neon yok.
 * İmleçle hafifçe yatar (parallax).
 */
export default function HeroCanvas({ mousePos }) {
  const canvasRef = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    mouse.current = mousePos
  }, [mousePos])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const still = motionOff()

    const accent = rgb('accent')
    const warm = rgb('warm')
    const horizon = rgb('horizon')

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let raf
    let t = 0
    let tilt = { x: 0, y: 0 }

    function resize() {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function orbit(cx, cy, rx, ry, rotation, alpha) {
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(rotation)
      ctx.beginPath()
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
      const g = ctx.createLinearGradient(-rx, 0, rx, 0)
      g.addColorStop(0, `rgba(${accent.r},${accent.g},${accent.b},0)`)
      g.addColorStop(0.5, `rgba(${accent.r},${accent.g},${accent.b},${alpha})`)
      g.addColorStop(1, `rgba(${warm.r},${warm.g},${warm.b},0)`)
      ctx.strokeStyle = g
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.restore()
    }

    function satellite(cx, cy, rx, ry, rotation, phase) {
      const a = phase
      const lx = Math.cos(a) * rx
      const ly = Math.sin(a) * ry
      const x = cx + lx * Math.cos(rotation) - ly * Math.sin(rotation)
      const y = cy + lx * Math.sin(rotation) + ly * Math.cos(rotation)

      const g = ctx.createRadialGradient(x, y, 0, x, y, 14)
      g.addColorStop(0, `rgba(${horizon.r},${horizon.g},${horizon.b},0.5)`)
      g.addColorStop(1, `rgba(${horizon.r},${horizon.g},${horizon.b},0)`)
      ctx.beginPath()
      ctx.arc(x, y, 14, 0, Math.PI * 2)
      ctx.fillStyle = g
      ctx.fill()

      ctx.beginPath()
      ctx.arc(x, y, 1.8, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,0.85)`
      ctx.fill()
    }

    function planetLimb() {
      // Ekranın altından yükselen gezegen kıvrımı + ince atmosfer halkası
      const cx = w * 0.5
      const cy = h * 1.62
      const r = h * 0.95

      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      const body = ctx.createLinearGradient(0, cy - r, 0, h)
      body.addColorStop(0, `rgba(${accent.r},${accent.g},${accent.b},0.05)`)
      body.addColorStop(1, `rgba(${accent.r},${accent.g},${accent.b},0.015)`)
      ctx.fillStyle = body
      ctx.fill()

      ctx.beginPath()
      ctx.arc(cx, cy, r, Math.PI * 1.15, Math.PI * 1.85)
      ctx.strokeStyle = `rgba(${horizon.r},${horizon.g},${horizon.b},0.22)`
      ctx.lineWidth = 1.4
      ctx.stroke()
    }

    function draw() {
      ctx.clearRect(0, 0, w, h)
      if (!still) t += 0.0016

      // İmleç takibi yumuşatılmış parallax
      tilt.x += (mouse.current.x * 18 - tilt.x) * 0.04
      tilt.y += (mouse.current.y * 12 - tilt.y) * 0.04

      ctx.save()
      ctx.translate(tilt.x, tilt.y)

      planetLimb()

      const o1 = { cx: w * 0.68, cy: h * 0.4, rx: w * 0.3, ry: h * 0.2, rot: -0.35 }
      const o2 = { cx: w * 0.3, cy: h * 0.62, rx: w * 0.26, ry: h * 0.14, rot: 0.42 }

      orbit(o1.cx, o1.cy, o1.rx, o1.ry, o1.rot, 0.16)
      orbit(o2.cx, o2.cy, o2.rx, o2.ry, o2.rot, 0.1)
      satellite(o1.cx, o1.cy, o1.rx, o1.ry, o1.rot, t * 6)
      satellite(o2.cx, o2.cy, o2.rx, o2.ry, o2.rot, -t * 4.2 + 2)

      ctx.restore()
      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}
