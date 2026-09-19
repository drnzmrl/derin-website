import { motion } from 'framer-motion'
import { Rocket, Monitor, Code2, BookOpen, Globe } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import { skillGroups } from '../data/skills'

const iconMap = { Rocket, Monitor, Code2, BookOpen, Globe }

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const groupVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

const tagVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  }),
}

function SkillGroup({ group, groupIndex }) {
  const Icon = iconMap[group.icon] || Rocket

  return (
    <motion.div
      variants={groupVariants}
      className="bg-surface border border-border rounded-2xl p-6 hover:border-accent/25 transition-colors duration-300"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center flex-shrink-0">
          <Icon size={16} className="text-accent" />
        </div>
        <h3 className="font-display font-semibold text-text text-sm">{group.category}</h3>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {group.skills.map((skill, i) => (
          <motion.span
            key={skill}
            custom={i}
            variants={tagVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="px-3 py-1.5 rounded-lg bg-surface-2 border border-border text-text-dim text-xs font-mono hover:border-accent/30 hover:text-accent transition-all duration-200 cursor-default"
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="py-28 px-6 bg-surface/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="Expertise"
          title="Skills & Tools"
          subtitle="Engineering disciplines, software tools, programming languages, and research skills I work with."
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {skillGroups.map((group, i) => (
            <SkillGroup key={group.category} group={group} groupIndex={i} />
          ))}
        </motion.div>
      </div>

      <div className="mt-24 horizon-line max-w-6xl mx-auto" />
    </section>
  )
}
