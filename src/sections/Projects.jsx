import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Section from '../components/layout/Section'
import Icon from '../components/ui/Icon'
import Tag from '../components/ui/Tag'
import Lightbox from '../components/ui/Lightbox'
import ProjectCover from '../components/effects/ProjectCovers'
import { AnimatedGroup, ShineCard } from '../components/motion'
import { projects, projectCategoryIcons } from '../data/projects'

function Meta({ project }) {
  const icon = projectCategoryIcons[project.category] || 'Wind'
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-[11px]">
      <span className="inline-flex items-center gap-1.5 text-accent/90">
        <Icon name={icon} size={12} />
        {project.category}
      </span>
      {project.year && <span className="text-muted">{project.year}</span>}
    </div>
  )
}

function Outcome({ text }) {
  if (!text) return null
  return (
    <div className="mt-4 border-l-2 border-warm/50 pl-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-warm/80 mb-1">Result</p>
      <p className="text-sm text-text leading-relaxed">{text}</p>
    </div>
  )
}

function Metrics({ items }) {
  if (!items?.length) return null
  return (
    <div className="mt-5 grid grid-cols-3 gap-2">
      {items.map((m) => (
        <div key={m.label} className="rounded-soft border border-text/10 bg-text/[0.03] px-3 py-2">
          <p className="font-display text-base sm:text-lg font-semibold text-text leading-none whitespace-nowrap">{m.value}</p>
          <p className="mt-1 text-[10px] text-muted leading-tight">{m.label}</p>
        </div>
      ))}
    </div>
  )
}

function PlayButton({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="play-cta relative z-30 mt-5 inline-block self-start"
    >
      <span className="flex items-center gap-3 rounded-[0.9rem] bg-space px-4 py-2.5 transition-colors hover:bg-atmosphere">
        <img src="/images/shared/google-play-logo.png" alt="" className="h-6 w-auto" />
        <span className="text-left leading-tight">
          <span className="block text-[10px] font-medium uppercase tracking-wider text-muted">Get it on</span>
          <span className="block text-base font-semibold text-text">Google Play</span>
        </span>
        <Icon name="ArrowUpRight" size={15} className="ml-2 text-muted" />
      </span>
    </a>
  )
}

function Actions({ project, onOpen }) {
  const hasGallery = project.gallery?.length > 0
  if (!hasGallery && !project.links?.length) return null
  return (
    <div className="relative z-30 mt-5 flex flex-wrap items-center gap-2">
      {hasGallery && (
        <button
          onClick={onOpen}
          className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-xs font-medium text-accent hover:bg-accent/20 transition-colors"
        >
          <Icon name="Images" size={13} />
          View {project.gallery.length} figures
        </button>
      )}
      {project.links?.map((l) => (
        <a
          key={l.href}
          href={l.href}
          onClick={(e) => {
            if (l.href.startsWith('#')) {
              e.preventDefault()
              document.getElementById(l.href.slice(1))?.scrollIntoView({ behavior: 'smooth' })
            }
          }}
          target={l.href.startsWith('http') ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-text/15 px-3.5 py-1.5 text-xs font-medium text-text-dim hover:text-text hover:border-warm/40 transition-colors"
        >
          {l.icon && <Icon name={l.icon} size={13} />}
          {l.label}
        </a>
      ))}
    </div>
  )
}

/** En üstteki geniş kart */
function FeaturedCard({ project, onOpen }) {
  return (
    <ShineCard className="panel panel-hover grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]" max={3}>
      <button
        onClick={onOpen}
        className="relative block aspect-[16/10] lg:aspect-auto lg:min-h-[420px] overflow-hidden border-b lg:border-b-0 lg:border-r border-text/10 text-left"
        aria-label={`Open figures for ${project.title}`}
      >
        <ProjectCover cover={project.cover} alt={project.title} />
        <span className="absolute left-4 top-4 z-10 glass rounded-full border border-warm/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-warm">
          Featured
        </span>
        <span className="absolute bottom-4 left-4 z-10 inline-flex items-center gap-1.5 font-mono text-[10px] text-text/70">
          <Icon name="Maximize2" size={11} /> tap for {project.gallery.length} figures
        </span>
      </button>
      <div className="p-6 md:p-8 flex flex-col">
        <Meta project={project} />
        <h3 className="mt-3 font-display text-2xl md:text-3xl font-semibold tracking-tight text-text leading-tight">
          {project.title}
        </h3>
        {project.credit && <p className="mt-2 font-mono text-[11px] text-muted">{project.credit}</p>}
        <p className="mt-4 text-sm md:text-[15px] text-text-dim leading-relaxed">{project.description}</p>
        <Outcome text={project.outcome} />
        <Metrics items={project.metrics} />
        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.tools?.map((t) => (
            <Tag key={t} variant="muted">{t}</Tag>
          ))}
        </div>
        <Actions project={project} onOpen={onOpen} />
      </div>
    </ShineCard>
  )
}

function ProjectCard({ project, onOpen }) {
  const clickable = project.gallery?.length > 0
  return (
    <ShineCard className="panel panel-hover h-full flex flex-col">
      <div
        className={`relative w-full aspect-video overflow-hidden border-b border-text/10 ${clickable ? 'cursor-zoom-in' : ''}`}
        onClick={clickable ? onOpen : undefined}
      >
        <ProjectCover cover={project.cover} alt={project.title} />
        {project.playStore && (
          <a
            href={project.playStore}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute left-3 top-3 z-30 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-space/70 px-3 py-1 text-[11px] font-semibold text-emerald-200 backdrop-blur-md hover:border-emerald-300/60"
          >
            <span className="radar-dot" aria-hidden="true" />
            Live on Google Play
          </a>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <Meta project={project} />
        <h3 className="mt-3 font-display text-lg font-semibold text-text leading-snug group-hover:text-accent transition-colors duration-300">
          {project.title}
        </h3>
        {project.credit && <p className="mt-1 font-mono text-[11px] text-muted">{project.credit}</p>}
        <p className="mt-3 text-text-dim text-sm leading-relaxed">{project.description}</p>
        <Outcome text={project.outcome} />
        <Metrics items={project.metrics} />
        {project.playStore && <PlayButton href={project.playStore} />}
        <div className="mt-auto pt-5 flex flex-wrap gap-1.5">
          {project.tools?.map((t) => (
            <Tag key={t} variant="muted">{t}</Tag>
          ))}
        </div>
        <Actions project={project} onOpen={onOpen} />
      </div>
    </ShineCard>
  )
}

export default function Projects({ config }) {
  const [open, setOpen] = useState(null)
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <Section config={config}>
      <div className="space-y-6">
        {featured.map((p) => (
          <FeaturedCard key={p.id} project={p} onOpen={() => setOpen(p)} />
        ))}
      </div>

      <AnimatedGroup className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" from="up" stagger={0.08}>
        {rest.map((p) => (
          <ProjectCard key={p.id} project={p} onOpen={() => setOpen(p)} />
        ))}
      </AnimatedGroup>

      <div className="mt-24 horizon-line" />

      <AnimatePresence>
        {open && (
          <Lightbox title={open.title} items={open.gallery} credit={open.figureCredit} onClose={() => setOpen(null)} />
        )}
      </AnimatePresence>
    </Section>
  )
}
