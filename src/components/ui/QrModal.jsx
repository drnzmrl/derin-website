import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { X } from 'lucide-react'
import Icon from './Icon'
import { site } from '../../config/site.config'
import { siteUrl, downloadVCard } from '../../lib/contact'
import { dur } from '../../config/applyTheme'

/** Kod kutusu: ekranda okutulacak QR */
export function QrPanel({ size = 148, caption = 'Scan to open this page on your phone' }) {
  const url = siteUrl()
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="rounded-2xl bg-white p-3 shadow-[0_0_40px_-10px_rgb(var(--c-accent)/0.7)]">
        <QRCodeSVG value={url} size={size} bgColor="#ffffff" fgColor="#060912" level="M" marginSize={0} />
      </div>
      {caption && <p className="max-w-[14rem] text-xs leading-relaxed text-muted">{caption}</p>}
    </div>
  )
}

/**
 * Tam ekran QR: biriyle tanışınca telefonu uzatıp siteyi
 * okutmak için. Barış Alkan'ın portfolyosundan uyarlandı.
 */
export default function QrModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // body'ye taşınır: main'in katman bağlamı menünün altında bırakmasın
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="QR code for this page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: dur(0.2) }}
          onClick={onClose}
          className="fixed inset-0 z-[70] grid place-items-center bg-space/90 p-6 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.94, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-3xl border border-text/10 bg-atmosphere/80 p-8 text-center backdrop-blur-xl"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-text/10 hover:text-text"
              aria-label="Close"
            >
              <X size={16} />
            </button>
            <p className="font-display text-xl font-semibold text-text">{site.fullName}</p>
            <p className="mt-1 text-sm text-text-dim">Aerospace Engineering · METU NCC</p>
            <div className="mt-6">
              <QrPanel size={220} caption={null} />
            </div>
            <p className="mt-3 break-all font-mono text-xs text-accent/80">{siteUrl().replace(/^https?:\/\//, '')}</p>
            <button
              onClick={downloadVCard}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-warm/40 px-4 py-2 text-sm font-medium text-warm hover:bg-warm/10 transition-colors"
            >
              <Icon name="UserPlus" size={15} />
              Save contact
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
