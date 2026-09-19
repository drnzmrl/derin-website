import { useEffect, useRef } from 'react'
import { theme } from '../../config/theme.config'
import { rgb } from '../../config/colors'
import { motionOff } from '../../config/applyTheme'

/**
 * Sabit yıldız alanı. Fırlatma rampasında (sayfanın üstünde)
 * görünmez; yükseldikçe atmosfer inceldiği için ortaya çıkar.
 * Ayarlar: theme.config.js → stars
 */
export default function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const cfg = theme.stars
    if (!cfg.enabled) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const still = motionOff()

    const accent = rgb('accent')
    const warm = rgb('warm')

    let stars = []
    let shooting = []
    let raf = null
    let fade = 1
    let t = 0

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    function seed() {
      const w = window.innerWidth
      const h = window.innerHeight
      stars = Array.from({ length: cfg.count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.1 + 0.25,
        base: Math.random() * 0.5 + 0.25,
        // Birkaç yıldız sıcak tonda olsun; hepsi aynı mavi olmasın
        warm: Math.random() < 0.18,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.6 + 0.3,
      }))
    }

    /** Kaydırma ilerlemesine göre yıldızların genel opaklığı.
        Rampada 0, yörüngede 1. */
    function updateFade() {
      const max = document.body.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      const from = cfg.appearFrom ?? 0.25
      const to = cfg.fullBy ?? 0.7
      fade = Math.min(1, Math.max(0, (p - from) / Math.max(0.001, to - from)))
    }

    function spawnShootingStar() {
      const w = window.innerWidth
      shooting.push({
        x: Math.random() * w * 0.7,
        y: Math.random() * window.innerHeight * 0.4,
        len: Math.random() * 90 + 60,
        speed: Math.random() * 5 + 6,
        angle: Math.PI / 5 + (Math.random() * 0.2 - 0.1),
        life: 0,
        max: 55,
      })
    }

    function draw() {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      if (fade > 0.004) {
        t += 0.016
        for (const s of stars) {
          const tw =
            cfg.twinkle && !still
              ? 0.65 + 0.35 * Math.sin(t * s.speed + s.phase)
              : 1
          const a = s.base * tw * fade
          const c = s.warm ? warm : accent
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${a})`
          ctx.fill()
        }

        if (cfg.shootingStars && !still) {
          if (Math.random() < 0.0025 && shooting.length < 2) spawnShootingStar()
          shooting = shooting.filter((m) => m.life < m.max)
          for (const m of shooting) {
            m.life++
            m.x += Math.cos(m.angle) * m.speed
            m.y += Math.sin(m.angle) * m.speed
            const a = Math.sin((m.life / m.max) * Math.PI) * 0.55 * fade
            const tailX = m.x - Math.cos(m.angle) * m.len
            const tailY = m.y - Math.sin(m.angle) * m.len
            const g = ctx.createLinearGradient(m.x, m.y, tailX, tailY)
            g.addColorStop(0, `rgba(255,255,255,${a})`)
            g.addColorStop(0.4, `rgba(${accent.r},${accent.g},${accent.b},${a * 0.5})`)
            g.addColorStop(1, 'rgba(0,0,0,0)')
            ctx.strokeStyle = g
            ctx.lineWidth = 1.4
            ctx.lineCap = 'round'
            ctx.beginPath()
            ctx.moveTo(m.x, m.y)
            ctx.lineTo(tailX, tailY)
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    updateFade()
    draw()

    window.addEventListener('resize', resize)
    window.addEventListener('scroll', updateFade, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', updateFade)
    }
  }, [])

  if (!theme.stars.enabled) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  )
}
