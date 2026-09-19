import { motion } from 'framer-motion'
import Section from '../components/layout/Section'
import Icon from '../components/ui/Icon'
import { AnimatedNumber, BorderTrail } from '../components/motion'
import { about } from '../data/about'
import { site } from '../config/site.config'
import { theme } from '../config/theme.config'
import { dur } from '../config/applyTheme'

const ease = theme.motion.ease

/** Paragrafı, highlight alanı vurgulanmış şekilde basar */
function Paragraph({ tone, text, highlight }) {
  const cls = {
    strong: 'text-text leading-relaxed text-base md:text-lg',
    soft: 'text-text-dim leading-relaxed',
    accent: 'text-warm font-medium text-sm',
  }[tone || 'soft']

  if (!highlight || !text.includes(highlight)) {
    return <p className={cls}>{text}</p>
  }

  const [before, after] = text.split(highlight)
  return (
    <p className={cls}>
      {before}
      <span className="text-accent font-medium">{highlight}</span>
      {after}
    </p>
  )
}

export default function About({ config }) {
  return (
    <Section config={config}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Fotoğraf */}
        <motion.div
          className="flex justify-center lg:justify-start"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: dur(0.8), ease }}
        >
          <div className="relative">
            {/* Yumuşak şafak halesi */}
            <div className="absolute -inset-3 rounded-[1.6rem] bg-gradient-to-br from-accent/20 via-transparent to-warm/20 blur-2xl" />

            <div className="relative w-72 h-80 md:w-80 md:h-96 rounded-card overflow-hidden panel">
              {about.photo ? (
                <img
                  src={about.photo}
                  alt={about.photoAlt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 30%, rgb(var(--c-accent) / 0.12), transparent 65%)',
                  }}
                >
                  <div className="w-24 h-24 rounded-full border border-accent/25 bg-accent/10 flex items-center justify-center">
                    <span className="font-display text-3xl font-semibold text-accent">
                      {site.initial}
                    </span>
                  </div>
                  <p className="text-xs text-muted tracking-wide">
                    src/data/about.js → photo
                  </p>
                </div>
              )}
            </div>

            {about.badge && (
              <motion.div
                className="absolute -bottom-4 -right-4 panel px-4 py-2 rounded-soft"
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: dur(0.4), duration: dur(0.5), ease }}
              >
                <p className="text-xs text-muted">{about.badge.label}</p>
                <p className="font-display text-sm font-semibold text-text">
                  {about.badge.value}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Metin */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: dur(0.8), ease }}
        >
          <div className="space-y-5 mb-10">
            {about.intro.map((p, i) => (
              <Paragraph key={i} {...p} />
            ))}
          </div>

          {about.currentWork?.items?.length > 0 && (
            <div className="mb-8">
              <p className="eyebrow mb-4">{about.currentWork.title}</p>
              <div className="space-y-3">
                {about.currentWork.items.map((item) => (
                  <div key={item.title} className="panel panel-hover p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name={item.icon} size={14} className="text-warm" />
                      <p className="font-display font-semibold text-text text-sm">
                        {item.title}
                      </p>
                    </div>
                    <ul className="space-y-1">
                      {item.items.map((line) => (
                        <li
                          key={line}
                          className="text-xs text-text-dim flex items-start gap-2"
                        >
                          <span className="text-accent/70 mt-px">›</span>
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {about.stats?.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {about.stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="panel panel-hover p-4 flex items-center gap-3 relative overflow-hidden"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: dur(0.2 + i * 0.08), duration: dur(0.5), ease }}
                >
                  {/* Kenarda dolaşan ışık — sadece ilk kutuda, dikkat dağıtmasın */}
                  {i === 0 && <BorderTrail duration={7} />}
                  <div className="w-9 h-9 rounded-soft bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon name={stat.icon} size={16} className="text-accent" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-text text-lg leading-none">
                      <AnimatedNumber value={stat.value} />
                    </p>
                    <p className="text-xs text-muted mt-1">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <div className="mt-24 horizon-line" />
    </Section>
  )
}
