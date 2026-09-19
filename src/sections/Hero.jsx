import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import HeroCanvas from '../components/canvas/HeroCanvas'
import Icon from '../components/ui/Icon'
import { TextEffect, Magnetic } from '../components/motion'
import { useCursorPosition } from '../hooks/useCursorPosition'
import { site } from '../config/site.config'
import { theme } from '../config/theme.config'
import { dur } from '../config/applyTheme'

export default function Hero({ config }) {
  const { normalized } = useCursorPosition()
  const { scrollY } = useScroll()
  const contentY = useTransform(scrollY, [0, 600], [0, -80])
  const contentOpacity = useTransform(scrollY, [0, 420], [1, 0])

  const ease = theme.motion.ease
  const reveal = site.effects?.textReveal !== false

  /** heroButtons ayarındaki bir satırı gerçek butona çevirir */
  const renderButton = (btn, i) => {
    const solid = btn.style !== 'outline'
    const cls = solid
      ? 'bg-accent text-space hover:bg-accent/90 glow-soft'
      : 'border border-text/15 text-text hover:border-warm/50 hover:bg-warm/10'
    const base = `inline-flex items-center gap-2 px-7 py-3.5 rounded-soft font-display font-semibold text-sm tracking-wide transition-all duration-300 ${cls}`

    const inner = (
      <>
        {btn.icon && <Icon name={btn.icon} size={16} />}
        {btn.label}
        {btn.kind === 'scroll' && <Icon name="ChevronRight" size={16} />}
      </>
    )

    let el
    if (btn.kind === 'file') {
      const href = site.files[btn.target]
      if (!href) return null // dosya tanımlı değilse buton hiç çizilmez
      el = (
        <a href={href} download className={base}>
          {inner}
        </a>
      )
    } else if (btn.kind === 'link') {
      el = (
        <a href={btn.href} target="_blank" rel="noopener noreferrer" className={base}>
          {inner}
        </a>
      )
    } else {
      el = (
        <button
          onClick={() =>
            document.getElementById(btn.target)?.scrollIntoView({ behavior: 'smooth' })
          }
          className={base}
        >
          {inner}
        </button>
      )
    }

    // Butonlar imlece doğru hafifçe çekilir (site.config → effects.magnetic)
    return <Magnetic key={i}>{el}</Magnetic>
  }

  return (
    <section
      id={config?.key || 'hero'}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <HeroCanvas mousePos={normalized} />

      {/* Merkezde çok yumuşak bir aydınlanma */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 45%, rgb(var(--c-accent) / 0.07) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.p
          className="eyebrow mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: dur(0.3), duration: dur(0.6) }}
        >
          {site.role}
        </motion.p>

        {/* İsim: harfler aşağıdan fırlayarak gelir */}
        <div className="mb-5">
          {reveal ? (
            <TextEffect
              as="h1"
              per="char"
              preset="launch"
              delay={0.4}
              stagger={0.05}
              duration={0.8}
              className="font-display text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tight text-gradient leading-none"
            >
              {site.name}
            </TextEffect>
          ) : (
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tight text-gradient leading-none">
              {site.name}
            </h1>
          )}
        </div>

        {reveal ? (
          <TextEffect
            as="p"
            per="word"
            preset="lift"
            delay={0.95}
            stagger={0.035}
            className="text-text-dim text-lg md:text-xl font-light mb-3"
          >
            {site.tagline}
          </TextEffect>
        ) : (
          <motion.p
            className="text-text-dim text-lg md:text-xl font-light mb-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dur(0.7), duration: dur(0.7), ease }}
          >
            {site.tagline}
          </motion.p>
        )}

        <motion.p
          className="text-xs text-muted tracking-wide mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: dur(1.0), duration: dur(0.6) }}
        >
          {site.university}
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: dur(1.15), duration: dur(0.7), ease }}
        >
          {site.heroButtons.map(renderButton)}
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: dur(1.8), duration: dur(0.6) }}
      >
        <span className="text-[10px] tracking-[0.2em] uppercase font-display">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: dur(2) || 0.001, ease: 'easeInOut' }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  )
}
