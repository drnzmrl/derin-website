import { useScroll, useSpring, motion } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 origin-left h-[2px]"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, rgba(79,195,247,0.9) 0%, rgba(79,195,247,0.5) 100%)',
        boxShadow: '0 0 8px rgba(79,195,247,0.6)',
      }}
    />
  )
}
