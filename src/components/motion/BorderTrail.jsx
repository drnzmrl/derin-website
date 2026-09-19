import { motion } from 'framer-motion'
import { site } from '../../config/site.config'
import { motionOff } from '../../config/applyTheme'

/**
 * Kartın kenarında dolaşan küçük ışık — yörüngedeki uydu gibi.
 * Kartın içine koy; kart `relative` ve `overflow-hidden` olmalı.
 *
 *   <div className="panel relative overflow-hidden">
 *     <BorderTrail />
 *     ...
 *   </div>
 *
 * Kapatmak için: site.config.js → effects.borderTrail = false
 * Kaynak fikir: motion-primitives (MIT) — projeye uyarlandı.
 */
export default function BorderTrail({
  size = 70,
  duration = 6,
  color = 'var(--c-warm)',
  className = '',
}) {
  if (motionOff() || site.effects?.borderTrail === false) return null

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 rounded-[inherit] ${className}`}
      style={{
        maskImage:
          'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
        maskComposite: 'exclude',
        WebkitMaskComposite: 'xor',
        padding: '1px',
      }}
    >
      <motion.div
        style={{
          width: size,
          height: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          background: `radial-gradient(circle, rgb(${color} / 0.85) 0%, rgb(${color} / 0) 68%)`,
        }}
        animate={{ offsetDistance: ['0%', '100%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      />
    </div>
  )
}
