import { motion, useScroll, useTransform } from 'framer-motion'
import { theme } from '../../config/theme.config'

/**
 * Ekranın altındaki şafak: kavisli atmosfer kenarı ve sıcak ışık.
 * Sayfanın başında güçlüdür; aşağı indikçe (yükseldikçe) söner.
 * Kavisli kenar fikri Barış Alkan'ın portfolyosundaki hero'dan.
 * Ayarlar: theme.config.js → horizonGlow
 */
export default function HorizonGlow() {
  const { scrollYProgress } = useScroll()
  const { enabled, intensity = 0.75, fadeBy = 0.45 } = theme.horizonGlow
  const glow = useTransform(scrollYProgress, [0, fadeBy], [intensity, 0])
  const limb = useTransform(scrollYProgress, [0, fadeBy * 0.5], [1, 0])
  const sink = useTransform(scrollYProgress, [0, fadeBy * 0.5], ['0%', '40%'])

  if (!enabled) return null

  return (
    <div aria-hidden="true" className="fixed inset-x-0 bottom-0 pointer-events-none z-0 h-[55vh] overflow-hidden">
      {/* sıcak ışık */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: glow,
          background:
            'radial-gradient(ellipse 130% 100% at 50% 100%, rgb(var(--c-horizon) / 0.5) 0%, rgb(var(--c-warm) / 0.2) 38%, transparent 72%)',
        }}
      />
      {/* kavisli atmosfer kenarı */}
      <motion.div className="absolute inset-x-0 bottom-0 h-[34svh] min-h-52" style={{ opacity: limb, y: sink }}>
        <div className="absolute left-1/2 top-1/2 h-[26rem] w-[160vw] -translate-x-1/2 rounded-[100%] bg-horizon/10 blur-3xl" />
        <div
          className="absolute left-1/2 top-[62%] aspect-square w-[300vw] -translate-x-1/2 rounded-full sm:w-[320vw] lg:w-[360vw]"
          style={{
            borderTop: '1px solid rgb(var(--c-horizon) / 0.55)',
            background: 'linear-gradient(to bottom, rgb(var(--c-dawn) / 0.55), rgb(var(--c-space) / 0.2) 8%)',
            boxShadow: '0 -1px 18px rgb(var(--c-horizon) / 0.45), 0 -18px 90px rgb(var(--c-warm) / 0.22)',
          }}
        />
      </motion.div>
    </div>
  )
}
