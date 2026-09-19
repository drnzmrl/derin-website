import Section from '../components/layout/Section'
import Icon from '../components/ui/Icon'
import Tag from '../components/ui/Tag'
import { AnimatedGroup, Tilt } from '../components/motion'
import { projects, projectCategoryIcons } from '../data/projects'

/** Görsel yoksa: kategoriye göre yumuşak gradyan + ikon */
function Placeholder({ category, icon }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        background:
          'radial-gradient(ellipse at 50% 120%, rgb(var(--c-warm) / 0.14) 0%, transparent 60%), radial-gradient(ellipse at 30% -10%, rgb(var(--c-accent) / 0.12) 0%, transparent 55%)',
      }}
    >
      <div className="flex flex-col items-center gap-3 opacity-45">
        <Icon name={icon} size={30} className="text-accent" />
        <p className="text-[10px] text-text-dim tracking-[0.15em] uppercase">
          {category}
        </p>
      </div>
    </div>
  )
}

function ProjectCard({ project }) {
  const icon = projectCategoryIcons[project.category] || 'Wind'

  return (
    <Tilt className="group relative panel panel-hover overflow-hidden h-full">
      <div className="relative w-full aspect-video overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <Placeholder category={project.category} icon={icon} />
        )}

        <div className="absolute top-3 left-3">
          <span className="glass px-2.5 py-1 rounded-full text-[10px] text-accent tracking-wide border border-accent/20">
            {project.category}
          </span>
        </div>

        {project.year && (
          <div className="absolute top-3 right-3">
            <span className="glass px-2 py-1 rounded-full text-[10px] text-text-dim">
              {project.year}
            </span>
          </div>
        )}

        {/* Sonuç metni — üzerine gelince yumuşakça belirir */}
        {project.outcome && (
          <div className="absolute inset-0 flex items-center justify-center p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-400 bg-space/85 backdrop-blur-sm">
            <p className="text-text text-sm text-center leading-relaxed">
              {project.outcome}
            </p>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-display text-base font-semibold text-text mb-2 leading-snug group-hover:text-accent transition-colors duration-300">
          {project.title}
        </h3>
        {project.description && (
          <p className="text-text-dim text-sm leading-relaxed mb-4">
            {project.description}
          </p>
        )}
        {project.tools?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tools.map((tool) => (
              <Tag key={tool} variant="muted">
                {tool}
              </Tag>
            ))}
          </div>
        )}
      </div>
    </Tilt>
  )
}

export default function Projects({ config }) {
  return (
    <Section config={config}>
      <AnimatedGroup
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        from="up"
        stagger={0.08}
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </AnimatedGroup>

      <div className="mt-24 horizon-line" />
    </Section>
  )
}
