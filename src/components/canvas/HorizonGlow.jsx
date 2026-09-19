import { useEffect, useState } from 'react'
import { theme } from '../../config/theme.config'

/**
 * Fırlatma rampasının sıcak şafak ışığı — ekranın altında durur.
 * Sayfanın başında güçlüdür; aşağı indikçe (yükseldikçe)
 * geride kalır ve söner.
 * Ayarlar: theme.config.js → horizonGlow
 */
export default function HorizonGlow() {
  const [p, setP] = useState(0)

  useEffect(() => {
    if (!theme.horizonGlow.enabled) return
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight
      setP(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  if (!theme.horizonGlow.enabled) return null

  const { intensity, fadeBy = 0.45 } = theme.horizonGlow
  // Rampadan uzaklaştıkça söner
  const strength = Math.max(0, 1 - p / fadeBy) * intensity

  return (
    <div aria-hidden="true" className="fixed inset-x-0 bottom-0 pointer-events-none z-0">
      {/* İnce ufuk çizgisi — sadece yerdeyken belirgin */}
      <div
        className="horizon-line"
        style={{ opacity: Math.max(0, 1 - p / (fadeBy * 0.6)) * intensity }}
      />
      <div
        style={{
          height: 'var(--horizon-height)',
          opacity: strength,
          background:
            'radial-gradient(ellipse 130% 100% at 50% 100%, rgb(var(--c-horizon) / 0.5) 0%, rgb(var(--c-warm) / 0.2) 38%, transparent 72%)',
          transition: 'opacity 0.25s linear',
        }}
      />
    </div>
  )
}
