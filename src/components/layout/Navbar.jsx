import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Drawings', href: '#drawings' },
  { label: 'Publications', href: '#publications' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href) => {
    setMenuOpen(false)
    setActive(href)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? 'glass border-b border-border/50 py-3' : 'py-5'
        }`}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            onClick={() => handleNav('#hero')}
            className="font-display font-semibold text-lg tracking-tight text-text hover:text-accent transition-colors"
          >
            D<span className="text-accent">.</span>
          </a>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active === link.href
                    ? 'text-accent bg-accent/10'
                    : 'text-text-dim hover:text-text hover:bg-surface-2'
                }`}
              >
                {link.label}
              </button>
            ))}
            <a
              href="/cv/derin-cv.pdf"
              download
              className="ml-3 px-4 py-2 rounded-lg text-sm font-medium border border-accent/30 text-accent hover:bg-accent/10 transition-all duration-200"
            >
              CV
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-text-dim hover:text-text transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-background/95 backdrop-blur-lg flex flex-col items-center justify-center gap-2 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-2xl font-display font-semibold text-text-dim hover:text-accent transition-colors py-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {link.label}
              </motion.button>
            ))}
            <motion.a
              href="/cv/derin-cv.pdf"
              download
              className="mt-4 px-6 py-3 border border-accent/40 text-accent rounded-lg font-display font-medium"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.06, duration: 0.4 }}
            >
              Download CV
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
