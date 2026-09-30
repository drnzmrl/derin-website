import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { motionOff } from '../../config/applyTheme'

/**
 * Sırayla değişen ifade. Genişlik en uzun ifadeye göre sabitlenir
 * (hepsi aynı ızgara hücresinde görünmez olarak durur), böylece
 * değişirken satır zıplamaz.
 *
 *   <Rotator items={['bir', 'iki']} every={2.8} />
 */
export default function Rotator({ items, every = 2.8, delay = 0, className = '', base = 'inline-grid text-left align-top' }) {
  const [i, setI] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (motionOff() || items.length < 2) return
    let id
    const start = setTimeout(() => {
      setStarted(true)
      id = setInterval(() => setI((v) => (v + 1) % items.length), every * 1000)
    }, delay * 1000)
    return () => {
      clearTimeout(start)
      clearInterval(id)
    }
  }, [items.length, every, delay])

  return (
    <span className={`${base} ${className}`} aria-live="polite">
      {items.map((t) => (
        <span key={t} aria-hidden="true" className="invisible col-start-1 row-start-1">
          {t}
        </span>
      ))}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={items[i]}
          className="col-start-1 row-start-1"
          initial={started ? { opacity: 0, y: '0.45em', filter: 'blur(6px)' } : false}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: '-0.45em', filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {items[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
