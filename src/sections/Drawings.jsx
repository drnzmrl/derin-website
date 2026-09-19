import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Section from '../components/layout/Section'
import Icon from '../components/ui/Icon'
import Modal from '../components/ui/Modal'
import { AnimatedGroup, Tilt } from '../components/motion'
import { drawings, drawingCategoryIcons } from '../data/drawings'

function Thumbnail({ drawing, onClick }) {
  const icon = drawingCategoryIcons[drawing.category] || 'PenTool'

  return (
    <Tilt
      className="group relative aspect-video panel panel-hover overflow-hidden cursor-pointer"
      max={5}
      onClick={() => onClick(drawing)}
    >
      {drawing.image ? (
        <img
          src={drawing.image}
          alt={drawing.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background:
              'radial-gradient(ellipse at 50% 115%, rgb(var(--c-warm) / 0.12) 0%, transparent 62%), radial-gradient(ellipse at 25% -15%, rgb(var(--c-accent) / 0.1) 0%, transparent 58%)',
          }}
        >
          <Icon name={icon} size={28} className="text-accent/45" />
        </div>
      )}

      <div className="absolute top-2.5 left-3">
        <span className="text-[10px] text-text-dim/70 tracking-[0.12em] uppercase">
          {drawing.category}
        </span>
      </div>

      {/* Üzerine gelince başlık ve araç */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 bg-space/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Icon name="Maximize2" size={19} className="text-warm" />
        <p className="font-display text-xs font-medium text-text text-center leading-snug">
          {drawing.title}
        </p>
        <p className="text-[10px] text-muted">{drawing.tool}</p>
      </div>
    </Tilt>
  )
}

export default function Drawings({ config }) {
  const [selected, setSelected] = useState(null)

  return (
    <Section config={config}>
      <AnimatedGroup
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        from="scale"
        stagger={0.07}
      >
        {drawings.map((drawing) => (
          <Thumbnail key={drawing.id} drawing={drawing} onClick={setSelected} />
        ))}
      </AnimatedGroup>

      <div className="mt-24 horizon-line" />

      <AnimatePresence>
        {selected && <Modal item={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </Section>
  )
}
