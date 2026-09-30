import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Section from '../components/layout/Section'
import Icon from '../components/ui/Icon'
import Modal from '../components/ui/Modal'
import SubHeading from '../components/ui/SubHeading'
import Blueprint from '../components/effects/Blueprints'
import { AnimatedGroup, Tilt } from '../components/motion'
import { drawings, drawingCategoryIcons } from '../data/drawings'

/** Görsel ya da teknik çizim. Beyaz zeminli CAD görüntüleri küçük
 *  resimde "karanlık mod" gibi ters çevrilir; büyütünce orijinali açılır. */
export function DrawingArt({ drawing }) {
  if (drawing.image) {
    return (
      <div className="absolute inset-0 bg-[#0b0f1c]">
        <img
          src={drawing.image}
          alt={drawing.title}
          loading="lazy"
          className={`w-full h-full transition-transform duration-700 group-hover:scale-[1.04] ${
            drawing.light ? 'object-contain p-3 invert-[0.92] hue-rotate-180 contrast-[1.1]' : 'object-cover'
          }`}
        />
      </div>
    )
  }
  if (drawing.blueprint) return <Blueprint name={drawing.blueprint} className="absolute inset-0" />
  return null
}

function Thumbnail({ drawing, onClick }) {
  const icon = drawingCategoryIcons[drawing.category] || 'PenTool'

  return (
    <Tilt
      className="group relative aspect-video panel panel-hover overflow-hidden cursor-zoom-in"
      max={5}
      onClick={() => onClick(drawing)}
      role="button"
      tabIndex={0}
      aria-label={`Open ${drawing.title}`}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(drawing)}
    >
      <DrawingArt drawing={drawing} />

      <div className="absolute top-2.5 left-3 z-10">
        <span className="inline-flex items-center gap-1.5 rounded-full glass border border-text/10 px-2 py-0.5 text-[10px] text-text-dim tracking-[0.12em] uppercase">
          <Icon name={icon} size={10} />
          {drawing.category}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-space/95 via-space/70 to-transparent px-4 pb-3 pt-8">
        <p className="font-display text-sm font-medium text-text leading-snug">{drawing.title}</p>
        <p className="font-mono text-[10px] text-muted mt-0.5">{drawing.tool}</p>
      </div>

      <div className="absolute right-3 top-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Icon name="Maximize2" size={15} className="text-warm" />
      </div>
    </Tilt>
  )
}

export default function Drawings({ config }) {
  const [selected, setSelected] = useState(null)
  const cfd = drawings.filter((d) => d.track !== 'coursework')
  const coursework = drawings.filter((d) => d.track === 'coursework')

  return (
    <Section config={config}>
      <SubHeading className="mb-6" title="From my CFD work" note="Domains, meshes and geometry from the ASE 342 study." />
      <AnimatedGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" from="scale" stagger={0.06}>
        {cfd.map((drawing) => (
          <Thumbnail key={drawing.id} drawing={drawing} onClick={setSelected} />
        ))}
      </AnimatedGroup>

      {coursework.length > 0 && (
        <>
          <SubHeading className="mt-14 mb-6" title="Coursework & self-study" note="Technical drawings from courses and practice." />
          <AnimatedGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" from="scale" stagger={0.05}>
            {coursework.map((drawing) => (
              <Thumbnail key={drawing.id} drawing={drawing} onClick={setSelected} />
            ))}
          </AnimatedGroup>
        </>
      )}

      <div className="mt-24 horizon-line" />

      <AnimatePresence>
        {selected && <Modal item={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </Section>
  )
}
