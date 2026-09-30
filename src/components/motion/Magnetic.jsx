import { useEffect, useRef } from 'react'
import { motion, useSpring } from 'framer-motion'
import { site } from '../../config/site.config'
import { motionOff } from '../../config/applyTheme'

/**
 * İçindekini imlece doğru hafifçe çeker (yerçekimi hissi).
 * Sadece imleç elemanın üstündeyken ya da hemen yanındayken (pad)
 * çalışır ve kayma en fazla `max` piksel olur. Böylece yan yana
 * duran iki buton aynı anda çekilip birbirinin üstüne binmez.
 *
 *   <Magnetic><button>...</button></Magnetic>
 *
 * Kapatmak için: site.config.js → effects.magnetic = false
 * Kaynak fikir: motion-primitives (MIT), projeye uyarlandı.
 */
export default function Magnetic({
  children,
  strength = 0.22,
  pad = 6,
  max = 8,
  className = '',
}) {
  const ref = useRef(null)
  const spring = { stiffness: 220, damping: 18, mass: 0.35 }
  const x = useSpring(0, spring)
  const y = useSpring(0, spring)

  const disabled =
    motionOff() ||
    site.effects?.magnetic === false ||
    (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches)

  useEffect(() => {
    if (disabled) return
    const clamp = (v) => Math.max(-max, Math.min(max, v))

    const onMove = (e) => {
      const el = ref.current
      if (!el) return
      // Kaymış konumu değil, elemanın asıl yerini ölç
      const r = el.getBoundingClientRect()
      const left = r.left - x.get()
      const top = r.top - y.get()
      const inside =
        e.clientX > left - pad &&
        e.clientX < left + r.width + pad &&
        e.clientY > top - pad &&
        e.clientY < top + r.height + pad

      if (inside) {
        x.set(clamp((e.clientX - (left + r.width / 2)) * strength))
        y.set(clamp((e.clientY - (top + r.height / 2)) * strength))
        el.style.zIndex = '2'
      } else {
        x.set(0)
        y.set(0)
        el.style.zIndex = ''
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [disabled, pad, max, strength, x, y])

  if (disabled) return <span className={className}>{children}</span>

  return (
    <motion.span ref={ref} className={`relative inline-block ${className}`} style={{ x, y }}>
      {children}
    </motion.span>
  )
}
