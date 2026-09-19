import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import Icon from './Icon'
import Tag from './Tag'
import { theme } from '../../config/theme.config'
import { dur } from '../../config/applyTheme'

export default function Modal({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div
        className="absolute inset-0 bg-space/85 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        className="relative z-10 w-full max-w-2xl panel overflow-hidden"
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: dur(0.35), ease: theme.motion.ease }}
      >
        <div
          className="w-full aspect-video flex items-center justify-center relative overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse at 50% 115%, rgb(var(--c-warm) / 0.14) 0%, transparent 62%), radial-gradient(ellipse at 25% -10%, rgb(var(--c-accent) / 0.12) 0%, transparent 58%)',
          }}
        >
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 opacity-55 px-6 text-center">
              <Icon name="PenTool" size={30} className="text-accent" />
              <p className="text-[11px] text-muted">
                Görseli <span className="text-text-dim">public/images/</span> içine koy,
                yolunu <span className="text-text-dim">src/data/drawings.js → image</span> alanına yaz
              </p>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="eyebrow mb-1">{item.category}</p>
              <h3 className="font-display text-xl font-semibold text-text leading-snug">
                {item.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Kapat"
              className="flex-shrink-0 p-1.5 rounded-soft text-muted hover:text-text hover:bg-text/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <p className="text-text-dim text-sm leading-relaxed mb-5">
            {item.description}
          </p>

          {item.tool && (
            <div className="flex items-center gap-2">
              <Icon name="Wrench" size={13} className="text-muted flex-shrink-0" />
              <span className="text-xs text-muted mr-1">Tool:</span>
              <Tag variant="muted">{item.tool}</Tag>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
