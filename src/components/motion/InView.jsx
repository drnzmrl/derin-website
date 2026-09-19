import { motion } from 'framer-motion'
import { theme } from '../../config/theme.config'
import { dur } from '../../config/applyTheme'

/**
 * Görünür olunca beliren sarmalayıcı.
 * Her bölümde tekrar tekrar yazdığımız whileInView kalıbını
 * tek yere topladı.
 *
 *   <InView delay={0.1}>...</InView>
 *   <InView from="left">...</InView>
 *
 * Kaynak fikir: motion-primitives (MIT) — projeye uyarlandı.
 */

const OFFSETS = {
  up: { x: 0, y: 24 },
  down: { x: 0, y: -24 },
  left: { x: -28, y: 0 },
  right: { x: 28, y: 0 },
  none: { x: 0, y: 0 },
  scale: { x: 0, y: 0 },
}

export default function InView({
  children,
  from = 'up',
  delay = 0,
  duration = 0.7,
  once = true,
  margin = '-70px',
  className = '',
  ...rest
}) {
  const off = OFFSETS[from] || OFFSETS.up

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        x: off.x,
        y: off.y,
        scale: from === 'scale' ? 0.94 : 1,
      }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, margin }}
      transition={{
        duration: dur(duration),
        delay: dur(delay),
        ease: theme.motion.ease,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
