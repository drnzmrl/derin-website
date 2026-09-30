import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { theme } from '../../config/theme.config'
import { dur } from '../../config/applyTheme'

/**
 * Görsel galerisi. Oklarla / kaydırarak gezilir, Esc ile kapanır.
 *
 *   <Lightbox title="..." items={[{ src, caption, cutout, plot }]} start={0} onClose={...} />
 *
 * cutout → arka planı saydam görsel (koyu zeminde gösterilir)
 * plot   → beyaz zeminli grafik (kağıt gibi çerçevelenir)
 */
export default function Lightbox({ title, items, start = 0, onClose }) {
  const [i, setI] = useState(start)
  const [dir, setDir] = useState(0)
  const n = items.length
  const go = useCallback(
    (d) => {
      setDir(d)
      setI((v) => (v + d + n) % n)
    },
    [n]
  )

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [go, onClose])

  const item = items[i]

  // body'ye taşınır: main'in katman bağlamı menünün altında bırakmasın
  return createPortal(
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: dur(0.25) }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-space/90 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 flex items-center justify-between gap-4 px-4 sm:px-8 pt-4 sm:pt-6">
        <div className="min-w-0">
          <p className="eyebrow truncate">{title}</p>
          <p className="font-mono text-[11px] text-muted mt-1">
            {i + 1} / {n}
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="flex-shrink-0 grid h-10 w-10 place-items-center rounded-full border border-text/10 text-text-dim hover:text-text hover:bg-text/10 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center px-2 sm:px-16 py-4">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.figure
            key={item.src}
            custom={dir}
            initial={{ opacity: 0, x: dir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -60 }}
            transition={{ duration: dur(0.35), ease: theme.motion.ease }}
            drag={n > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1)
              else if (info.offset.x > 60) go(-1)
            }}
            className="max-w-5xl w-full max-h-full flex flex-col items-center"
          >
            <div
              className={`relative w-full flex items-center justify-center rounded-card overflow-hidden ${
                item.plot ? 'bg-white p-2 sm:p-4' : item.cutout ? 'lightbox-stage p-4 sm:p-8' : ''
              }`}
            >
              <img
                src={item.src}
                alt={item.caption || title}
                draggable="false"
                className="max-h-[62vh] w-auto max-w-full object-contain select-none"
              />
            </div>
            {item.caption && (
              <figcaption className="mt-4 max-w-2xl text-center text-sm text-text-dim leading-relaxed px-4">
                {item.caption}
              </figcaption>
            )}
          </motion.figure>
        </AnimatePresence>

        {n > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 hidden sm:grid h-11 w-11 place-items-center rounded-full border border-text/10 bg-space/60 text-text-dim hover:text-text hover:border-accent/40 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 hidden sm:grid h-11 w-11 place-items-center rounded-full border border-text/10 bg-space/60 text-text-dim hover:text-text hover:border-accent/40 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* küçük resimler */}
      {n > 1 && (
        <div className="relative z-10 px-4 pb-4 sm:pb-6 overflow-x-auto">
          <div className="flex gap-2 justify-start sm:justify-center min-w-max mx-auto">
            {items.map((it, k) => (
              <button
                key={it.src}
                onClick={() => {
                  setDir(k > i ? 1 : -1)
                  setI(k)
                }}
                aria-label={`Image ${k + 1}`}
                className={`h-12 w-16 sm:h-14 sm:w-20 flex-shrink-0 overflow-hidden rounded-md border transition-all ${
                  k === i ? 'border-warm opacity-100' : 'border-text/10 opacity-50 hover:opacity-90'
                } ${it.plot ? 'bg-white' : 'bg-atmosphere/60'}`}
              >
                <img src={it.src} alt="" loading="lazy" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>,
    document.body
  )
}
