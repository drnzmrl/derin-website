import { motion } from 'framer-motion'
import { Children } from 'react'
import { theme } from '../../config/theme.config'
import { dur } from '../../config/applyTheme'

/**
 * Izgara/liste çocuklarını sırayla ortaya çıkarır.
 *
 *   <AnimatedGroup className="grid grid-cols-3 gap-6">
 *     {items.map(...)}
 *   </AnimatedGroup>
 *
 * Kaynak fikir: motion-primitives (MIT) — projeye uyarlandı.
 */
export default function AnimatedGroup({
  children,
  className = '',
  stagger = 0.07,
  from = 'up',
  duration = 0.6,
  ...rest
}) {
  const offset = {
    up: { y: 22, x: 0 },
    left: { y: 0, x: -22 },
    right: { y: 0, x: 22 },
    scale: { y: 0, x: 0 },
  }[from] || { y: 22, x: 0 }

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: dur(stagger) } },
  }

  const item = {
    hidden: {
      opacity: 0,
      ...offset,
      scale: from === 'scale' ? 0.95 : 1,
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: dur(duration), ease: theme.motion.ease },
    },
  }

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-70px' }}
      {...rest}
    >
      {Children.map(children, (child, i) =>
        child ? (
          <motion.div key={i} variants={item}>
            {child}
          </motion.div>
        ) : null
      )}
    </motion.div>
  )
}
