import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Section from '../components/layout/Section'
import Icon from '../components/ui/Icon'
import { Magnetic } from '../components/motion'
import { site } from '../config/site.config'
import { theme } from '../config/theme.config'
import { dur } from '../config/applyTheme'

const ease = theme.motion.ease

/** Telefonda (ya da PDF gömülemediğinde) gösterilen CV kapağı */
function CVCover() {
  const rows = [
    ['Education', 'B.Sc. Aerospace Engineering, METU NCC, 2023 to now'],
    ['Research', 'ANSYS Fluent: 3D wing & Ahmed body, NACA 0012 / 2415'],
    ['Team', 'TEKNOFEST Fighter UAV, CFD and YOLO vision'],
    ['Software', 'Quadra Rotate (Google Play), Campus Collab'],
    ['Languages', 'Turkish, English C1, Spanish, German'],
  ]
  return (
    <div className="absolute inset-0 p-6 md:p-10 flex flex-col">
      <p className="font-display text-2xl font-semibold text-text">{site.fullName}</p>
      <p className="mt-1 font-mono text-[11px] text-muted">{site.email}</p>
      <div className="my-5 h-px bg-text/10" />
      <dl className="space-y-4">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="eyebrow">{k}</dt>
            <dd className="mt-1 text-sm text-text-dim leading-relaxed">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-auto pt-6 font-mono text-[10px] text-muted">Full CV: one page, PDF</p>
    </div>
  )
}

export default function Resume({ config }) {
  const cv = site.files.cv
  const fileName = cv ? cv.split('/').pop() : 'cv.pdf'
  // Mobil tarayıcıların çoğu PDF'i sayfa içine gömmez
  const [embed, setEmbed] = useState(false)
  useEffect(() => {
    setEmbed(!!cv && window.matchMedia('(min-width: 768px) and (pointer: fine)').matches)
  }, [cv])

  return (
    <Section config={config} width="max-w-3xl" className="text-center">
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: dur(0.7), ease }}
      >
        <div className="relative panel overflow-hidden text-left">
          {/* Üst şerit */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-text/10">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-text/15" />
              <div className="w-2.5 h-2.5 rounded-full bg-text/15" />
              <div className="w-2.5 h-2.5 rounded-full bg-text/15" />
            </div>
            <span className="text-xs text-muted ml-2">{fileName}</span>
          </div>

          <div className={`relative overflow-hidden ${embed ? 'aspect-[1/1.1]' : 'min-h-[420px]'}`}>
            {embed ? (
              <object
                data={`${cv}#toolbar=0&navpanes=0`}
                type="application/pdf"
                className="absolute inset-0 w-full h-full"
                aria-label="CV preview"
              >
                <CVCover />
              </object>
            ) : (
              <CVCover />
            )}
          </div>
        </div>

        {/* Kartın altındaki yumuşak parıltı */}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-warm/10 blur-3xl rounded-full pointer-events-none" />
      </motion.div>

      {cv && (
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: dur(0.2), duration: dur(0.6), ease }}
        >
          <Magnetic>
            <a
              href={cv}
              download
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-space rounded-soft font-display font-semibold text-sm tracking-wide hover:bg-accent/90 transition-all duration-300 glow-soft"
            >
              <Icon name="Download" size={17} />
              Download CV
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={cv}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 border border-text/15 text-text rounded-soft font-display font-semibold text-sm tracking-wide hover:border-warm/50 hover:bg-warm/10 transition-all duration-300"
            >
              <Icon name="Eye" size={17} />
              Open in browser
            </a>
          </Magnetic>
        </motion.div>
      )}

      <div className="mt-24 horizon-line" />
    </Section>
  )
}
