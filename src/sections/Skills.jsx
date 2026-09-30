import Section from '../components/layout/Section'
import Icon from '../components/ui/Icon'
import ToolLoop from '../components/effects/ToolLoop'
import { AnimatedGroup } from '../components/motion'
import { skillGroups, toolbelt, evidence } from '../data/skills'

function SkillGroup({ group }) {
  return (
    <div className="panel panel-hover p-6 h-full">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-soft bg-accent/10 flex items-center justify-center flex-shrink-0">
          <Icon name={group.icon} size={16} className="text-accent" />
        </div>
        <h3 className="font-display font-semibold text-text text-sm">{group.category}</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {group.skills.map((skill) => {
          const used = evidence.has(skill)
          return (
            <span
              key={skill}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all duration-300 cursor-default ${
                used
                  ? 'bg-accent/10 border-accent/30 text-text hover:border-warm/50'
                  : 'bg-text/5 border-text/10 text-text-dim hover:border-warm/35 hover:text-warm'
              }`}
            >
              {used && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />}
              {skill}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default function Skills({ config }) {
  return (
    <Section config={config}>
      {toolbelt?.length > 0 && (
        <div className="-mx-6 mb-10">
          <ToolLoop items={toolbelt} />
        </div>
      )}

      <p className="mb-6 flex items-center gap-2 text-xs text-text-dim">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
        Highlighted skills are the ones behind the projects on this page.
      </p>

      <AnimatedGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" stagger={0.09}>
        {skillGroups.map((group) => (
          <SkillGroup key={group.category} group={group} />
        ))}
      </AnimatedGroup>

      <div className="mt-24 horizon-line" />
    </Section>
  )
}
