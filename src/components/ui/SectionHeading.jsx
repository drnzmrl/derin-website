import { motion } from 'framer-motion'

export default function SectionHeading({ label, title, subtitle, light = false }) {
  return (
    <motion.div
      className="mb-16"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {label && (
        <p className="font-mono text-xs tracking-widest text-accent uppercase mb-3">
          {label}
        </p>
      )}
      <h2 className={`font-display text-3xl md:text-4xl font-semibold tracking-tight mb-4 ${light ? 'text-text' : 'text-gradient'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-text-dim text-base md:text-lg max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="mt-6 horizon-line w-24" />
    </motion.div>
  )
}
