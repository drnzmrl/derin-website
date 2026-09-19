import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Maximize2 } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import Modal from '../components/ui/Modal'
import { drawings } from '../data/drawings'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

function DrawingThumbnail({ drawing, onClick }) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative aspect-video rounded-xl overflow-hidden border border-border cursor-pointer hover:border-accent/40 transition-all duration-300"
      onClick={() => onClick(drawing)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25 }}
    >
      {/* Blueprint background */}
      <div className="absolute inset-0 blueprint-grid" />

      {/* Thumbnail image or placeholder */}
      {drawing.image ? (
        <img
          src={drawing.image}
          alt={drawing.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <ThumbnailSketch id={drawing.id} />
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-background/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4">
        <Maximize2 size={20} className="text-accent" />
        <p className="font-display text-xs font-medium text-text text-center leading-snug">{drawing.title}</p>
        <p className="font-mono text-[10px] text-muted">{drawing.tool}</p>
      </div>

      {/* Category label */}
      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-0">
        {/* hidden — shown in overlay */}
      </div>

      {/* Always-visible corner label */}
      <div className="absolute top-2 left-2">
        <span className="font-mono text-[9px] text-accent/60 tracking-wider">{drawing.category}</span>
      </div>
    </motion.div>
  )
}

function ThumbnailSketch({ id }) {
  // Unique simple SVG sketch per drawing id
  const sketches = {
    1: (
      <svg viewBox="0 0 200 100" className="w-full h-full opacity-25" fill="none">
        <path d="M10,50 Q60,15 100,45 Q140,75 190,50 Q140,44 100,46 Q60,48 10,50Z" stroke="#4FC3F7" strokeWidth="0.8"/>
        <line x1="10" y1="50" x2="190" y2="50" stroke="#4FC3F7" strokeWidth="0.4" strokeDasharray="4 4"/>
        <line x1="100" y1="10" x2="100" y2="90" stroke="#4FC3F7" strokeWidth="0.4" strokeDasharray="4 4"/>
      </svg>
    ),
    2: (
      <svg viewBox="0 0 200 100" className="w-full h-full opacity-25" fill="none">
        <rect x="40" y="15" width="120" height="70" stroke="#4FC3F7" strokeWidth="0.8"/>
        <rect x="55" y="30" width="90" height="40" stroke="#4FC3F7" strokeWidth="0.5"/>
        <line x1="55" y1="15" x2="55" y2="85" stroke="#4FC3F7" strokeWidth="0.3" strokeDasharray="2 2"/>
        <line x1="145" y1="15" x2="145" y2="85" stroke="#4FC3F7" strokeWidth="0.3" strokeDasharray="2 2"/>
        <circle cx="100" cy="50" r="3" stroke="#4FC3F7" strokeWidth="0.5"/>
      </svg>
    ),
    3: (
      <svg viewBox="0 0 200 100" className="w-full h-full opacity-25" fill="none">
        <ellipse cx="100" cy="50" rx="70" ry="30" stroke="#4FC3F7" strokeWidth="0.8"/>
        <path d="M170,50 Q180,50 185,55 L185,70 Q180,75 170,75 L170,50Z" stroke="#4FC3F7" strokeWidth="0.6" fill="none"/>
        <line x1="30" y1="50" x2="170" y2="50" stroke="#4FC3F7" strokeWidth="0.4" strokeDasharray="4 4"/>
      </svg>
    ),
    4: (
      <svg viewBox="0 0 200 100" className="w-full h-full opacity-25" fill="none">
        <path d="M100,20 L170,80 L30,80 Z" stroke="#4FC3F7" strokeWidth="0.8"/>
        <line x1="100" y1="20" x2="100" y2="80" stroke="#4FC3F7" strokeWidth="0.4" strokeDasharray="3 3"/>
        <rect x="85" y="70" width="30" height="10" stroke="#4FC3F7" strokeWidth="0.5"/>
      </svg>
    ),
    5: (
      <svg viewBox="0 0 200 100" className="w-full h-full opacity-25" fill="none">
        <path d="M100,20 Q130,20 150,50 Q130,80 100,80 Q70,80 50,50 Q70,20 100,20Z" stroke="#4FC3F7" strokeWidth="0.8"/>
        <ellipse cx="100" cy="50" rx="20" ry="10" stroke="#4FC3F7" strokeWidth="0.5"/>
        <line x1="100" y1="10" x2="100" y2="90" stroke="#4FC3F7" strokeWidth="0.3" strokeDasharray="3 3"/>
      </svg>
    ),
    6: (
      <svg viewBox="0 0 200 100" className="w-full h-full opacity-25" fill="none">
        <path d="M100,80 L20,80 L100,20 L180,80 Z" stroke="#4FC3F7" strokeWidth="0.8"/>
        <line x1="100" y1="80" x2="100" y2="20" stroke="#4FC3F7" strokeWidth="0.4" strokeDasharray="3 3"/>
        <circle cx="100" cy="86" r="6" stroke="#4FC3F7" strokeWidth="0.5"/>
      </svg>
    ),
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {sketches[id] || sketches[1]}
    </div>
  )
}

export default function Drawings() {
  const [selected, setSelected] = useState(null)

  return (
    <section id="drawings" className="py-28 px-6 blueprint-grid">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="Design Work"
          title="Technical Drawings"
          subtitle="CAD drawings, design studies, and engineering schematics — click any drawing to view details."
          light
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {drawings.map((drawing) => (
            <DrawingThumbnail key={drawing.id} drawing={drawing} onClick={setSelected} />
          ))}
        </motion.div>
      </div>

      <div className="mt-24 horizon-line max-w-6xl mx-auto" />

      {/* Modal */}
      <AnimatePresence>
        {selected && <Modal item={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  )
}
