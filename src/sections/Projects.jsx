import { motion } from 'framer-motion'
import { ArrowUpRight, Wind, Cpu, Flame, Navigation, Thermometer, FlaskConical } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import Tag from '../components/ui/Tag'
import { projects } from '../data/projects'

const categoryIcons = {
  'CFD / Aerodynamics': Wind,
  'Structural / FEA': Cpu,
  'Propulsion': Flame,
  'Flight Mechanics': Navigation,
  'Thermal / Re-entry': Thermometer,
  'Experimental Aerodynamics': FlaskConical,
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

function ProjectCard({ project }) {
  const Icon = categoryIcons[project.category] || Wind

  return (
    <motion.div
      variants={cardVariants}
      className="group relative bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 transition-all duration-300"
      whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(79,195,247,0.10)' }}
    >
      {/* Image / placeholder */}
      <div className="relative w-full aspect-video overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <ProjectPlaceholder category={project.category} Icon={Icon} />
        )}

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="glass px-2.5 py-1 rounded-md font-mono text-[10px] text-accent tracking-wider border border-accent/20">
            {project.category}
          </span>
        </div>

        {/* Year badge */}
        <div className="absolute top-3 right-3">
          <span className="glass px-2 py-1 rounded-md font-mono text-[10px] text-muted">
            {project.year}
          </span>
        </div>

        {/* Outcome overlay on hover */}
        <div className="absolute inset-0 bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <p className="text-text text-sm text-center leading-relaxed font-medium">
            {project.outcome}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-base font-semibold text-text mb-2 leading-snug group-hover:text-accent transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-text-dim text-sm leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Tools */}
        <div className="flex flex-wrap gap-1.5">
          {project.tools.map((tool) => (
            <Tag key={tool} variant="muted">{tool}</Tag>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function ProjectPlaceholder({ category, Icon }) {
  return (
    <div className="w-full h-full blueprint-grid flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 opacity-30">
        <Icon size={32} className="text-accent" />
        <p className="font-mono text-[9px] text-accent tracking-widest uppercase">{category}</p>
      </div>
    </div>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="py-28 px-6 bg-surface/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="Work"
          title="Projects"
          subtitle="A selection of engineering and research projects — from aerodynamic simulation to spacecraft structures."
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      </div>

      <div className="mt-24 horizon-line max-w-6xl mx-auto" />
    </section>
  )
}
