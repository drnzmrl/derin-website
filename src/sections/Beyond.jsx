import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Section from '../components/layout/Section'
import Icon from '../components/ui/Icon'
import { beyond } from '../data/beyond'
import { theme } from '../config/theme.config'
import { dur } from '../config/applyTheme'

/**
 * Mühendislik dışı deneyimler. Masaüstünde yatay bir zaman
 * çizgisi, telefonda dikey. Çizgi ekrana girince soldan uzar.
 */
export default function Beyond({ config }) {
  const ease = theme.motion.ease
  // Çizgi scale(0) ile başladığı için kendi görünürlüğünü ölçemez;
  // tetikleyici kapsayıcı
  const wrap = useRef(null)
  const inView = useInView(wrap, { once: true, margin: '-80px' })

  return (
    <Section config={config}>
      <div ref={wrap} className="relative">
        {/* çizgi: mobilde solda dikey, geniş ekranda üstte yatay */}
        <motion.div
          className="absolute left-[15px] top-2 bottom-2 w-px lg:left-0 lg:right-0 lg:top-[15px] lg:bottom-auto lg:h-px lg:w-auto origin-top lg:origin-left"
          style={{ background: 'linear-gradient(90deg, rgb(var(--c-accent) / 0.5), rgb(var(--c-horizon) / 0.6))' }}
          initial={{ scale: 0 }}
          animate={{ scale: inView ? 1 : 0 }}
          transition={{ duration: dur(1.2), ease }}
        />

        <ol className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-5">
          {beyond.map((item, i) => (
            <motion.li
              key={item.title}
              className="relative pl-12 lg:pl-0 lg:pt-12"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: dur(0.2 + i * 0.12), duration: dur(0.6), ease }}
            >
              {/* düğüm */}
              <span className="absolute left-0 top-0 grid h-[31px] w-[31px] place-items-center rounded-full border border-text/15 bg-space text-warm">
                <Icon name={item.icon} size={14} />
              </span>

              <div className="panel panel-hover p-5 h-full">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-mono text-[11px] text-accent/90">{item.when}</p>
                  {item.logo && (
                    <img src={item.logo} alt="" loading="lazy" className="h-6 w-auto rounded bg-white/90 p-0.5" />
                  )}
                </div>
                <h3 className="mt-2 font-display text-base font-semibold text-text leading-snug">{item.title}</h3>
                <p className="mt-0.5 text-xs text-muted">{item.place}</p>
                <p className="mt-3 text-sm text-text-dim leading-relaxed">{item.text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>

      <div className="mt-24 horizon-line" />
    </Section>
  )
}
