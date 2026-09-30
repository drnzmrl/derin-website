import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

const R = 21

/** Sağ altta yukarı çık butonu; halkası kaydırma ilerlemesiyle dolar.
 *  Barış Alkan'ın portfolyosundan uyarlandı. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  useMotionValueEvent(scrollY, 'change', (v) => setVisible(v > 700))

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.92 }}
          className="group fixed bottom-5 right-5 z-[55] grid h-12 w-12 place-items-center rounded-full border border-text/10 bg-space/80 text-accent shadow-[0_10px_30px_-10px_rgb(var(--c-accent)/0.6)] backdrop-blur-md hover:text-text sm:bottom-7 sm:right-7"
          aria-label="Back to top"
        >
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
            <circle cx="24" cy="24" r={R} fill="none" strokeWidth="2" style={{ stroke: 'rgb(var(--c-text) / 0.15)' }} />
            <motion.circle
              cx="24"
              cy="24"
              r={R}
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ pathLength: progress, stroke: 'rgb(var(--c-warm))' }}
            />
          </svg>
          <ArrowUp size={18} className="relative transition-transform group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
