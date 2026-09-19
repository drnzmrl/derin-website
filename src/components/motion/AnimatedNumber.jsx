import { useEffect, useRef, useState } from 'react'
import { useInView, useSpring, useMotionValueEvent } from 'framer-motion'
import { motionOff } from '../../config/applyTheme'

/**
 * Görünür olunca hedef sayıya kadar sayar.
 * Sayı olmayan değerlerde (ör. "TEKNOFEST") olduğu gibi basar,
 * "3+" / "10k" gibi eklerini korur.
 *
 *   <AnimatedNumber value="3+" />
 *
 * Kaynak fikir: motion-primitives (MIT) — projeye uyarlandı.
 */
export default function AnimatedNumber({ value, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  const raw = String(value ?? '')
  const match = raw.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/)
  const target = match ? parseFloat(match[2]) : null
  const decimals = match && match[2].includes('.') ? 1 : 0

  const [shown, setShown] = useState(target === null ? raw : '0')
  const spring = useSpring(0, { stiffness: 70, damping: 22, mass: 0.7 })

  useMotionValueEvent(spring, 'change', (v) => {
    if (target === null) return
    setShown(v.toFixed(decimals))
  })

  useEffect(() => {
    if (target === null) return
    if (motionOff()) {
      setShown(target.toFixed(decimals))
      return
    }
    if (inView) spring.set(target)
  }, [inView, target, decimals, spring])

  if (target === null) {
    return (
      <span ref={ref} className={className}>
        {raw}
      </span>
    )
  }

  return (
    <span ref={ref} className={className}>
      {match[1]}
      {shown}
      {match[3]}
    </span>
  )
}
