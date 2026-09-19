import { useScroll, useSpring, motion } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 origin-left h-[2px]"
      style={{
        scaleX,
        // Sıcaktan soğuğa: rampadan yörüngeye
        background:
          'linear-gradient(90deg, rgb(var(--c-horizon) / 0.95) 0%, rgb(var(--c-accent) / 0.85) 100%)',
      }}
    />
  )
}
