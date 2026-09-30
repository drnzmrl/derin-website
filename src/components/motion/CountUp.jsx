import { useEffect, useState } from 'react'
import { motionOff } from '../../config/applyTheme'

/**
 * Açılışta (görünürlüğü beklemeden) sayarak yükselen değer.
 * "0.8%", "Mach 1.5", "Stage 1" gibi metinlerde sayıyı bulur,
 * ön ve son ekleri ve ondalık basamak sayısını korur.
 *
 *   <CountUp value="0.8%" delay={1.6} />
 */
export default function CountUp({ value, delay = 0, duration = 1.4, className = '' }) {
  const raw = String(value ?? '')
  const m = raw.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/)
  const target = m ? parseFloat(m[2]) : null
  const decimals = m && m[2].includes('.') ? m[2].split('.')[1].length : 0
  const [v, setV] = useState(target === null || motionOff() ? target : 0)

  useEffect(() => {
    if (target === null || motionOff()) return
    let raf
    const t0 = performance.now() + delay * 1000
    const step = (now) => {
      const k = Math.min(1, Math.max(0, (now - t0) / (duration * 1000)))
      setV(target * (1 - Math.pow(1 - k, 3)))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, delay, duration])

  if (target === null) return <span className={className}>{raw}</span>
  return (
    <span className={`tabular-nums ${className}`}>
      {m[1]}
      {v.toFixed(decimals)}
      {m[3]}
    </span>
  )
}
