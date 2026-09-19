import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, Download, ChevronRight } from 'lucide-react'
import HeroCanvas from '../components/canvas/HeroCanvas'
import { useCursorPosition } from '../hooks/useCursorPosition'

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.5 + i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function Hero() {
  const { normalized } = useCursorPosition()
  const { scrollY } = useScroll()
  const contentY = useTransform(scrollY, [0, 600], [0, -80])
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0])

  const scrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background"
    >
      {/* Canvas background */}
      <HeroCanvas mousePos={normalized} />

      {/* Radial gradient center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(79,195,247,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Label */}
        <motion.p
          className="font-mono text-xs tracking-widest text-accent uppercase mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          ✦ Aerospace Engineering
        </motion.p>

        {/* Name */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            className="font-display text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tight text-gradient leading-none"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            Derin
          </motion.h1>
        </div>

        {/* Subtitle words */}
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 mb-3 text-text-dim text-lg md:text-xl font-light">
          {['Aspiring researcher and aerospace engineer.'].map((word, i) => (
            <motion.span key={word} custom={i} variants={wordVariants} initial="hidden" animate="visible">
              {word}
            </motion.span>
          ))}
        </div>

        {/* University line */}
        <motion.p
          className="font-mono text-xs text-muted tracking-wider mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          B.Sc. Aerospace Engineering — Middle East Technical University (NCC)
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={scrollToProjects}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-background rounded-lg font-display font-semibold text-sm tracking-wide hover:bg-accent/90 transition-all duration-200 shadow-lg shadow-accent/25"
          >
            View Projects
            <ChevronRight size={16} />
          </button>
          <a
            href="/cv/derin-cv.pdf"
            download
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-accent/35 text-accent rounded-lg font-display font-semibold text-sm tracking-wide hover:bg-accent/10 hover:border-accent/60 transition-all duration-200"
          >
            <Download size={16} />
            Download CV
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <span className="font-mono text-[10px] tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>

      {/* Bottom horizon line */}
      <div className="absolute bottom-0 left-0 right-0 horizon-line" />
    </section>
  )
}
