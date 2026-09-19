import { motion } from 'framer-motion'
import { Rocket, BookOpen, FlaskConical, Globe, Zap, Code2 } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'

const currentWork = [
  {
    icon: Zap,
    title: 'High-Speed Aerodynamics',
    items: ['3D wing & Ahmed body CFD (ANSYS Fluent — supersonic)', 'TEKNOFEST critical design report + CFD analysis'],
  },
  {
    icon: Rocket,
    title: 'Propulsion Studies',
    items: ['Turbojet & turbofan cycle calculations', 'Propulsive efficiency, thrust specific fuel consumption'],
  },
  {
    icon: Code2,
    title: 'Software Projects',
    items: ['Campus Collab — student collaboration platform', 'Mindmap — psychology-based mobile app (in dev)'],
  },
]

const stats = [
  { icon: Rocket, value: '3rd Year', label: 'B.Sc. Student' },
  { icon: FlaskConical, value: '3+', label: 'CFD Projects' },
  { icon: BookOpen, value: 'TEKNOFEST', label: 'Stage 1 Passed' },
  { icon: Globe, value: '4', label: 'Languages' },
]

export default function About() {
  return (
    <section id="about" className="py-28 px-6 section-grid">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="About Me"
          title="Who I Am"
          subtitle="A brief introduction to my background, interests, and goals."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Photo column */}
          <motion.div
            className="flex justify-center lg:justify-start"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-accent/30 via-transparent to-accent/10 blur-sm" />
              {/* Photo frame */}
              <div className="relative w-72 h-80 md:w-80 md:h-96 rounded-2xl overflow-hidden border border-accent/20 bg-surface-2">
                {/* Placeholder when no image */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 blueprint-grid">
                  <div className="w-24 h-24 rounded-full bg-accent-dim border border-accent/30 flex items-center justify-center">
                    <span className="font-display text-3xl font-semibold text-accent">D</span>
                  </div>
                  <p className="font-mono text-xs text-muted">profile photo</p>
                </div>
                {/* Real image — uncomment and set src when ready */}
                {/* <img src="/images/profile/derin.jpg" alt="Derin" className="w-full h-full object-cover" /> */}
              </div>

              {/* Floating badge */}
              <motion.div
                className="absolute -bottom-4 -right-4 bg-surface border border-border rounded-xl px-4 py-2 shadow-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="font-mono text-xs text-muted">Based in</p>
                <p className="font-display text-sm font-semibold text-text">Turkey 🇹🇷</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-5 mb-10">
              <p className="text-text leading-relaxed text-base md:text-lg">
                I'm Derin — a third-year aerospace engineering student focused on{' '}
                <span className="text-accent font-medium">high-speed aerodynamics, CFD, and data-driven problem-solving</span>.
                I like turning complex flow physics into clear, actionable results.
              </p>
              <p className="text-text-dim leading-relaxed">
                I've run CFD simulations on airfoils and aerodynamic bodies across subsonic, transonic, and supersonic regimes —
                validating against NASA data with under 5% error. I also build software on the side, from a published mobile game to student platforms.
              </p>
              <p className="text-accent/80 font-medium text-sm">
                Open to internships and research opportunities in aerospace engineering.
              </p>
            </div>

            {/* Currently Working On */}
            <div className="mb-8">
              <p className="font-mono text-xs text-muted uppercase tracking-widest mb-4">Currently Working On</p>
              <div className="space-y-3">
                {currentWork.map((item) => (
                  <div key={item.title} className="bg-surface border border-border rounded-xl p-4 hover:border-accent/30 transition-colors duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon size={13} className="text-accent" />
                      <p className="font-display font-semibold text-text text-sm">{item.title}</p>
                    </div>
                    <ul className="space-y-1">
                      {item.items.map((line) => (
                        <li key={line} className="font-mono text-xs text-muted flex items-start gap-2">
                          <span className="text-accent mt-0.5">›</span>{line}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="bg-surface border border-border rounded-xl p-4 flex items-center gap-3 hover:border-accent/30 transition-colors duration-300"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center flex-shrink-0">
                    <stat.icon size={16} className="text-accent" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-text text-lg leading-none">{stat.value}</p>
                    <p className="font-mono text-xs text-muted mt-0.5">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-24 horizon-line max-w-6xl mx-auto" />
    </section>
  )
}
