import { motion } from 'framer-motion'
import { theme } from '../../config/theme.config'
import { dur } from '../../config/applyTheme'

export default function SectionHeading({ label, title, subtitle }) {
  return (
    <motion.div
      className="mb-16"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: dur(0.7), ease: theme.motion.ease }}
    >
      {label && <p className="eyebrow mb-3">{label}</p>}
      {title && (
        <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-gradient">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-text-dim text-base md:text-lg max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="mt-6 horizon-line w-24" />
    </motion.div>
  )
}
