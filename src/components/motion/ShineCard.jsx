import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { site } from '../../config/site.config'
import { motionOff } from '../../config/applyTheme'

/**
 * İmlece göre hafifçe eğilen, üzerinde ışık gezinen kart.
 * Barış Alkan'ın portfolyosundaki proje kartından uyarlandı.
 *
 *   <ShineCard className="panel">...</ShineCard>
 *
 * Dokunmatik ekranda ve "hareketi azalt" açıkken düz kart olur.
 */
export default function ShineCard({ children, className = '', max = 6, as = 'article', ...rest }) {
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const sx = useMotionValue(50)
  const sy = useMotionValue(50)
  const srx = useSpring(rx, { stiffness: 180, damping: 18 })
  const sry = useSpring(ry, { stiffness: 180, damping: 18 })
  const shine = useMotionTemplate`radial-gradient(circle at ${sx}% ${sy}%, rgb(var(--c-text) / 0.12), transparent 45%)`

  const fine =
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const active = fine && !motionOff() && site.effects?.tilt !== false
  const Tag = motion[as] || motion.article

  const move = (e) => {
    if (!active) return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    rx.set((0.5 - py) * max)
    ry.set((px - 0.5) * max)
    sx.set(px * 100)
    sy.set(py * 100)
  }
  const reset = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <Tag
      onMouseMove={move}
      onMouseLeave={reset}
      style={active ? { rotateX: srx, rotateY: sry, transformPerspective: 1100 } : undefined}
      className={`group relative overflow-hidden ${className}`}
      {...rest}
    >
      {/* üst kenarda hover'da uzayan ince çizgi */}
      <span className="absolute inset-x-0 top-0 z-30 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-accent to-warm transition-transform duration-500 group-hover:scale-x-100" />
      {active && (
        <motion.div
          style={{ background: shine }}
          className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
      {children}
    </Tag>
  )
}
