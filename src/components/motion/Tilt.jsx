import { useRef } from 'react'
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion'
import { site } from '../../config/site.config'
import { motionOff } from '../../config/applyTheme'

/**
 * Kartı imlece göre 3B eğer. Proje/çizim kartları için.
 *
 *   <Tilt className="panel"> ...kart içeriği... </Tilt>
 *
 * Kapatmak için: site.config.js → effects.tilt = false
 * Kaynak fikir: motion-primitives (MIT) — projeye uyarlandı.
 */
export default function Tilt({
  children,
  max = 7,          // derece
  scale = 1.015,
  className = '',
  ...rest
}) {
  const ref = useRef(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)

  const spring = { stiffness: 180, damping: 20, mass: 0.4 }
  const rotateX = useSpring(useTransform(my, [0, 1], [max, -max]), spring)
  const rotateY = useSpring(useTransform(mx, [0, 1], [-max, max]), spring)

  const disabled =
    motionOff() ||
    site.effects?.tilt === false ||
    (typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches)

  if (disabled) {
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    )
  }

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }

  const reset = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileHover={{ scale }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      transition={{ type: 'spring', ...spring }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
