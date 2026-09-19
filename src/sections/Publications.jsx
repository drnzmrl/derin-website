import { motion } from 'framer-motion'
import { FileText, BookOpen, Newspaper, ExternalLink, Download } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import { publications } from '../data/publications'

const typeConfig = {
  'Research Paper': { icon: BookOpen, color: 'text-accent', bg: 'bg-accent-dim border-accent/20' },
  'Technical Report': { icon: FileText, color: 'text-gold', bg: 'bg-amber-900/20 border-amber-500/20' },
  'Article': { icon: Newspaper, color: 'text-emerald-400', bg: 'bg-emerald-900/20 border-emerald-500/20' },
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

function PublicationRow({ pub }) {
  const config = typeConfig[pub.type] || typeConfig['Research Paper']
  const Icon = config.icon

  return (
    <motion.div
      variants={rowVariants}
      className="group relative bg-surface border border-border rounded-2xl p-6 md:p-7 hover:border-accent/25 transition-all duration-300"
      whileHover={{ y: -2 }}
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-6 bottom-6 w-0.5 rounded-full bg-accent/0 group-hover:bg-accent/40 transition-all duration-300" />

      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Type badge */}
        <div className="flex-shrink-0">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium border ${config.bg} ${config.color}`}>
            <Icon size={11} />
            {pub.type}
          </span>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
            <h3 className="font-display text-base md:text-lg font-semibold text-text leading-snug group-hover:text-accent transition-colors duration-200">
              {pub.title}
            </h3>
          </div>

          <p className="font-mono text-xs text-muted mb-3">
            {pub.venue} · {pub.year}
          </p>

          <p className="text-text-dim text-sm leading-relaxed line-clamp-2">
            {pub.abstract}
          </p>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-2 md:flex-col md:items-end">
          {pub.link && (
            <a
              href={pub.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
            >
              <ExternalLink size={13} />
              Read
            </a>
          )}
          {pub.pdf && (
            <a
              href={pub.pdf}
              download
              className="inline-flex items-center gap-1.5 text-xs font-medium text-text-dim hover:text-text transition-colors"
            >
              <Download size={13} />
              PDF
            </a>
          )}
          {!pub.link && !pub.pdf && (
            <span className="font-mono text-[10px] text-border">on request</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Publications() {
  return (
    <section id="publications" className="py-28 px-6 section-grid">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          label="Writing"
          title="Articles & Papers"
          subtitle="Research papers, technical reports, and articles I've authored or co-authored."
        />

        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {publications.map((pub) => (
            <PublicationRow key={pub.id} pub={pub} />
          ))}
        </motion.div>
      </div>

      <div className="mt-24 horizon-line max-w-6xl mx-auto" />
    </section>
  )
}
