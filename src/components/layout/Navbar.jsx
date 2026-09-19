import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { site } from '../../config/site.config'
import { navSections } from '../../config/sections.config'
import { theme } from '../../config/theme.config'
import { dur } from '../../config/applyTheme'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')

  // Menü bağlantıları sections.config.js'ten türetilir —
  // orada inNav: false yaparsan buradan da kaybolur.
  const links = navSections()
  const cv = site.files.cv

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Görünen bölümü menüde işaretle
  useEffect(() => {
    const ids = links.map((l) => l.key)
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [links.length])

  const go = (key) => {
    setMenuOpen(false)
    document.getElementById(key)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? 'glass border-b border-text/10 py-3' : 'py-5'
        }`}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: dur(0.6), delay: dur(0.3), ease: theme.motion.ease }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <button
            onClick={() => go('hero')}
            className="font-display font-semibold text-lg tracking-tight text-text hover:text-accent transition-colors"
          >
            {site.initial}
            <span className="text-warm">.</span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <button
                key={link.key}
                onClick={() => go(link.key)}
                className={`px-4 py-2 rounded-soft text-sm font-medium transition-all duration-300 ${
                  active === link.key
                    ? 'text-text bg-text/10'
                    : 'text-text-dim hover:text-text hover:bg-text/5'
                }`}
              >
                {link.navLabel || link.title || link.key}
              </button>
            ))}
            {site.features.navbarCvButton && cv && (
              <a
                href={cv}
                download
                className="ml-3 px-4 py-2 rounded-soft text-sm font-medium border border-warm/35 text-warm hover:bg-warm/10 transition-all duration-300"
              >
                CV
              </a>
            )}
          </nav>

          <button
            className="md:hidden p-2 text-text-dim hover:text-text transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-space/90 backdrop-blur-xl flex flex-col items-center justify-center gap-2 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur(0.25) }}
          >
            {links.map((link, i) => (
              <motion.button
                key={link.key}
                onClick={() => go(link.key)}
                className="text-2xl font-display font-semibold text-text-dim hover:text-accent transition-colors py-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dur(i * 0.06), duration: dur(0.4), ease: theme.motion.ease }}
              >
                {link.navLabel || link.title || link.key}
              </motion.button>
            ))}
            {cv && (
              <motion.a
                href={cv}
                download
                className="mt-4 px-6 py-3 border border-warm/40 text-warm rounded-soft font-display font-medium"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dur(links.length * 0.06), duration: dur(0.4) }}
              >
                Download CV
              </motion.a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
