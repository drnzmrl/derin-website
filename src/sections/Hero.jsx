import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import Icon from '../components/ui/Icon'
import { TextEffect, Magnetic } from '../components/motion'
import { site } from '../config/site.config'
import { theme } from '../config/theme.config'
import { dur, motionOff } from '../config/applyTheme'
import { downloadVCard } from '../lib/contact'

export default function Hero({ config }) {
  const still = motionOff()
  const { scrollY } = useScroll()
  const contentY = useTransform(scrollY, [0, 600], still ? [0, 0] : [0, -80])
  const contentOpacity = useTransform(scrollY, [0, 420], [1, 0])

  const ease = theme.motion.ease
  const reveal = site.effects?.textReveal !== false

  /** heroButtons ayarındaki bir satırı gerçek butona çevirir */
  const renderButton = (btn, i) => {
    const cls = {
      solid: 'bg-accent text-space hover:bg-accent/90 glow-soft',
      outline: 'border border-text/15 text-text hover:border-warm/50 hover:bg-warm/10',
      ghost: 'text-text-dim hover:text-warm',
    }[btn.style || 'solid']
    const pad = btn.style === 'ghost' ? 'px-4 py-3.5' : 'px-7 py-3.5'
    const base = `inline-flex items-center gap-2 ${pad} rounded-soft font-display font-semibold text-sm tracking-wide transition-all duration-300 ${cls}`

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
    } else if (btn.kind === 'contact') {
      el = (
        <button onClick={downloadVCard} className={base}>
          {inner}
        </button>
      )
    } else {
      el = (
        <button
          onClick={() => document.getElementById(btn.target)?.scrollIntoView({ behavior: 'smooth' })}
          className={base}
        >
          {inner}
        </button>
      )
    }

    // Butonlar imlece doğru hafifçe çekilir (site.config → effects.magnetic)
    return <Magnetic key={i}>{el}</Magnetic>
  }

  const nameCls = 'font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tight text-gradient leading-none'

  return (
    <section
      id={config?.key || 'hero'}
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Merkezde çok yumuşak bir aydınlanma */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 45%, rgb(var(--c-accent) / 0.07) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 text-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {site.status && (
          <motion.div
            className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-text/10 bg-space/40 px-3.5 py-1.5 backdrop-blur-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dur(0.2), duration: dur(0.6) }}
          >
            <span className="radar-dot" aria-hidden="true" />
            <span className="text-xs font-medium text-text-dim">{site.status}</span>
          </motion.div>
        )}

        <motion.p
          className="eyebrow mb-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: dur(0.3), duration: dur(0.6) }}
        >
          {site.role}
        </motion.p>

        {/* İsim: harfler aşağıdan fırlayarak gelir */}
        <div className="mb-3">
          {reveal ? (
            <TextEffect as="h1" per="char" preset="launch" delay={0.4} stagger={0.05} duration={0.8} gradient className={nameCls}>
              {site.name}
            </TextEffect>
          ) : (
            <h1 className={nameCls}>{site.name}</h1>
          )}
        </div>
        {site.surname && (
          <motion.p
            className="font-display text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.28em] uppercase text-text/80 mb-7 pl-[0.28em]"
            initial={{ opacity: 0, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, letterSpacing: '0.28em' }}
            transition={{ delay: dur(0.85), duration: dur(1.1), ease }}
            aria-label={site.surname}
          >
            {site.surname.toLocaleUpperCase('tr-TR')}
          </motion.p>
        )}

        {reveal ? (
          <TextEffect as="p" per="word" preset="lift" delay={1.05} stagger={0.035} className="text-text-dim text-lg md:text-xl font-light mb-3 max-w-2xl mx-auto">
            {site.tagline}
          </TextEffect>
        ) : (
          <motion.p
            className="text-text-dim text-lg md:text-xl font-light mb-3 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dur(0.7), duration: dur(0.7), ease }}
          >
            {site.tagline}
          </motion.p>
        )}

        <motion.p
          className="text-xs text-muted tracking-wide mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: dur(1.2), duration: dur(0.6) }}
        >
          {site.university}
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: dur(1.3), duration: dur(0.7), ease }}
        >
          {site.heroButtons.map(renderButton)}
        </motion.div>

        {site.telemetry?.length > 0 && (
          <motion.ul
            className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 font-mono text-[11px] text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: dur(1.6), duration: dur(0.8) }}
          >
            {site.telemetry.map((t, i) => (
              <li key={t} className="flex items-center gap-3">
                {i > 0 && <span className="hidden sm:block h-3 w-px bg-text/15" aria-hidden="true" />}
                <span>{t}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: dur(1.9), duration: dur(0.6) }}
      >
        <span className="text-[10px] tracking-[0.2em] uppercase font-display">Scroll</span>
        {still ? (
          <ArrowDown size={14} />
        ) : (
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
            <ArrowDown size={14} />
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
