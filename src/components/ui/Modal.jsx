import { motion, AnimatePresence } from 'framer-motion'
import { X, Wrench, Tag as TagIcon } from 'lucide-react'
import { useEffect } from 'react'
import Tag from './Tag'

export default function Modal({ item, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal panel */}
        <motion.div
          className="relative z-10 w-full max-w-2xl bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Image area */}
          <div className="w-full aspect-video blueprint-grid flex items-center justify-center relative overflow-hidden">
            {item.image ? (
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <DrawingPlaceholder title={item.title} />
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="font-mono text-xs text-accent tracking-widest uppercase mb-1">{item.category}</p>
                <h3 className="font-display text-xl font-semibold text-text leading-snug">{item.title}</h3>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1.5 rounded-lg text-muted hover:text-text hover:bg-surface-2 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-text-dim text-sm leading-relaxed mb-5">{item.description}</p>

            <div className="flex items-center gap-2">
              <Wrench size={13} className="text-muted flex-shrink-0" />
              <span className="font-mono text-xs text-muted mr-1">Tool:</span>
              <Tag variant="muted">{item.tool}</Tag>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function DrawingPlaceholder({ title }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
      {/* Animated SVG blueprint drawing */}
      <svg viewBox="0 0 300 160" className="w-full max-w-xs opacity-40" fill="none">
        {/* Center cross */}
        <line x1="150" y1="10" x2="150" y2="150" stroke="#4FC3F7" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="10" y1="80" x2="290" y2="80" stroke="#4FC3F7" strokeWidth="0.5" strokeDasharray="3 3" />
        {/* Main shape — simplified airfoil */}
        <path d="M20,80 Q80,30 150,70 Q220,110 280,80 Q220,72 150,74 Q80,76 20,80Z"
          stroke="#4FC3F7" strokeWidth="1" fill="none" />
        {/* Chord line */}
        <line x1="20" y1="80" x2="280" y2="80" stroke="#4FC3F7" strokeWidth="0.5" />
        {/* Dimension arrows */}
        <line x1="20" y1="130" x2="280" y2="130" stroke="#4FC3F7" strokeWidth="0.5" />
        <line x1="20" y1="126" x2="20" y2="134" stroke="#4FC3F7" strokeWidth="0.5" />
        <line x1="280" y1="126" x2="280" y2="134" stroke="#4FC3F7" strokeWidth="0.5" />
        <text x="150" y="145" textAnchor="middle" fill="#4FC3F7" fontSize="8" fontFamily="JetBrains Mono">260 mm</text>
        {/* Corner marks */}
        <path d="M5,5 L5,20 M5,5 L20,5" stroke="#4FC3F7" strokeWidth="0.5" />
        <path d="M295,5 L295,20 M295,5 L280,5" stroke="#4FC3F7" strokeWidth="0.5" />
        <path d="M5,155 L5,140 M5,155 L20,155" stroke="#4FC3F7" strokeWidth="0.5" />
        <path d="M295,155 L295,140 M295,155 L280,155" stroke="#4FC3F7" strokeWidth="0.5" />
      </svg>
      <p className="font-mono text-[10px] text-accent/40 text-center tracking-wider">{title.toUpperCase()}</p>
    </div>
  )
}
