import Section from '../components/layout/Section'
import Icon from '../components/ui/Icon'
import { AnimatedGroup } from '../components/motion'
import { skillGroups } from '../data/skills'

function SkillGroup({ group }) {
  return (
    <div className="panel panel-hover p-6 h-full">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-soft bg-accent/10 flex items-center justify-center flex-shrink-0">
          <Icon name={group.icon} size={16} className="text-accent" />
        </div>
        <h3 className="font-display font-semibold text-text text-sm">
          {group.category}
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {group.skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1.5 rounded-full bg-text/5 border border-text/10 text-text-dim text-xs hover:border-warm/35 hover:text-warm transition-all duration-300 cursor-default"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Skills({ config }) {
  return (
    <Section config={config}>
      <AnimatedGroup
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        stagger={0.09}
      >
        {skillGroups.map((group) => (
          <SkillGroup key={group.category} group={group} />
        ))}
      </AnimatedGroup>

      <div className="mt-24 horizon-line" />
    </Section>
  )
}
