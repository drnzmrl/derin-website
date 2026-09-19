import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 55
const ACCENT = { r: 79, g: 195, b: 247 }

function rand(min, max) {
  return Math.random() * (max - min) + min
}

export default function HeroCanvas({ mousePos }) {
  const canvasRef = useRef(null)
  const particles = useRef([])
  const arcs = useRef([])
  const animRef = useRef(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    mouseRef.current = {
      x: (mousePos.x + 1) / 2,
      y: (mousePos.y + 1) / 2,
    }
  }, [mousePos])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      initParticles()
      initArcs()
    }

    function initParticles() {
      particles.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: rand(0, canvas.width),
        y: rand(0, canvas.height),
        r: rand(0.5, 1.8),
        vx: rand(-0.12, 0.12),
        vy: rand(-0.08, 0.08),
        opacity: rand(0.2, 0.7),
      }))
    }

    function initArcs() {
      arcs.current = [
        {
          // Elliptical orbit arc 1
          cx: canvas.width * 0.72,
          cy: canvas.height * 0.38,
          rx: canvas.width * 0.28,
          ry: canvas.height * 0.18,
          rotation: -0.3,
          progress: 0,
          speed: 0.0008,
          opacity: 0.18,
        },
        {
          cx: canvas.width * 0.25,
          cy: canvas.height * 0.65,
          rx: canvas.width * 0.22,
          ry: canvas.height * 0.12,
          rotation: 0.5,
          progress: 0.4,
          speed: 0.0005,
          opacity: 0.12,
        },
      ]
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Draw subtle grid shifted by mouse
      const gridOff = { x: (mx - 0.5) * 12, y: (my - 0.5) * 12 }
      ctx.strokeStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},0.04)`
      ctx.lineWidth = 0.5
      const gridSize = 44
      for (let x = (gridOff.x % gridSize) - gridSize; x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = (gridOff.y % gridSize) - gridSize; y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw orbit arcs
      arcs.current.forEach((arc) => {
        arc.progress += arc.speed
        if (arc.progress > 1) arc.progress = 0

        ctx.save()
        ctx.translate(arc.cx, arc.cy)
        ctx.rotate(arc.rotation)
        ctx.scale(1, arc.ry / arc.rx)

        const endAngle = arc.progress * Math.PI * 2
        ctx.beginPath()
        ctx.arc(0, 0, arc.rx, 0, endAngle)
        ctx.strokeStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${arc.opacity})`
        ctx.lineWidth = 0.8
        ctx.stroke()

        // Leading dot
        const dotX = Math.cos(endAngle) * arc.rx
        const dotY = Math.sin(endAngle) * arc.rx
        ctx.beginPath()
        ctx.arc(dotX, dotY, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},0.7)`
        ctx.fill()

        ctx.restore()
      })

      // Draw particles
      particles.current.forEach((p) => {
        p.x += p.vx + (mx - 0.5) * 0.08
        p.y += p.vy + (my - 0.5) * 0.06

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${p.opacity})`
        ctx.fill()
      })

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  )
}
