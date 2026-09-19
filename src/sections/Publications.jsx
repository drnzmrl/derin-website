import Section from '../components/layout/Section'
import Icon from '../components/ui/Icon'
import { AnimatedGroup } from '../components/motion'
import { publications, publicationTypes } from '../data/publications'

const FALLBACK = { icon: 'BookOpen', tone: 'accent' }

const TONE = {
  accent: 'bg-accent/10 border-accent/25 text-accent',
  warm: 'bg-warm/10 border-warm/25 text-warm',
  horizon: 'bg-horizon/10 border-horizon/25 text-horizon',
}

function PublicationRow({ pub }) {
  const cfg = publicationTypes[pub.type] || FALLBACK
  const tone = TONE[cfg.tone] || TONE.accent

  return (
    <div className="group relative panel panel-hover p-6 md:p-7">
      {/* Solda, üzerine gelince beliren ince vurgu */}
      <div className="absolute left-0 top-6 bottom-6 w-0.5 rounded-full bg-warm/0 group-hover:bg-warm/50 transition-all duration-300" />

      <div className="flex flex-col md:flex-row md:items-start gap-4">
        <div className="flex-shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${tone}`}
          >
            <Icon name={cfg.icon} size={11} />
            {pub.type}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display text-base md:text-lg font-semibold text-text leading-snug mb-2 group-hover:text-accent transition-colors duration-300">
            {pub.title}
          </h3>
          <p className="text-xs text-muted mb-3">
            {pub.venue} · {pub.year}
          </p>
          <p className="text-text-dim text-sm leading-relaxed">{pub.abstract}</p>
        </div>

        <div className="flex-shrink-0 flex items-center gap-3 md:flex-col md:items-end">
          {pub.link && (
            <a
              href={pub.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-warm transition-colors"
            >
              <Icon name="ExternalLink" size={13} />
              Read
            </a>
          )}
          {pub.pdf && (
            <a
              href={pub.pdf}
              download
              className="inline-flex items-center gap-1.5 text-xs font-medium text-text-dim hover:text-text transition-colors"
            >
              <Icon name="Download" size={13} />
              PDF
            </a>
          )}
          {!pub.link && !pub.pdf && (
            <span className="text-[10px] text-muted/60">on request</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Publications({ config }) {
  return (
    <Section config={config} width="max-w-4xl">
      <AnimatedGroup className="space-y-4" from="left" stagger={0.09}>
        {publications.map((pub) => (
          <PublicationRow key={pub.id} pub={pub} />
        ))}
      </AnimatedGroup>

      <div className="mt-24 horizon-line" />
    </Section>
  )
}
