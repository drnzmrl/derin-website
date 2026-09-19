import { useEffect, useRef } from 'react'
import { motion, useSpring } from 'framer-motion'
import { site } from '../../config/site.config'
import { motionOff } from '../../config/applyTheme'

/**
 * İçindekini imlece doğru hafifçe çeker — yerçekimi hissi.
 * Butonlar ve ikonlar için. İmleç yaklaşınca etki başlar,
 * uzaklaşınca yayla eski yerine döner.
 *
 *   <Magnetic><button>...</button></Magnetic>
 *
 * Kapatmak için: site.config.js → effects.magnetic = false
 * Kaynak fikir: motion-primitives (MIT) — projeye uyarlandı.
 */
export default function Magnetic({
  children,
  strength = 0.32,
  range = 120,
  className = '',
}) {
  const ref = useRef(null)
  const spring = { stiffness: 200, damping: 17, mass: 0.35 }
  const x = useSpring(0, spring)
  const y = useSpring(0, spring)

  const disabled =
    motionOff() ||
    site.effects?.magnetic === false ||
    (typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches)

  useEffect(() => {
    if (disabled) return

    const onMove = (e) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)

      if (Math.hypot(dx, dy) < range) {
        x.set(dx * strength)
        y.set(dy * strength)
      } else {
        x.set(0)
        y.set(0)
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [disabled, range, strength, x, y])

  if (disabled) return <span className={className}>{children}</span>

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x, y }}
    >
      {children}
    </motion.span>
  )
}
