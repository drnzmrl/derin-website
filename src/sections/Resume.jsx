import { motion } from 'framer-motion'
import Section from '../components/layout/Section'
import Icon from '../components/ui/Icon'
import { Magnetic } from '../components/motion'
import { site } from '../config/site.config'
import { theme } from '../config/theme.config'
import { dur } from '../config/applyTheme'

const ease = theme.motion.ease

/** CV dosyası yokken gösterilen sayfa taslağı */
function CVPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12 select-none">
      <div className="w-full space-y-5 opacity-45">
        <div className="space-y-1.5">
          <div className="h-4 rounded bg-text/15 w-1/3" />
          <div className="h-2 rounded bg-text/10 w-1/2" />
          <div className="h-2 rounded bg-text/10 w-2/5" />
        </div>
        <div className="h-px bg-text/15 w-full" />
        {[1, 2, 3].map((s) => (
          <div key={s} className="space-y-1.5">
            <div className="h-2.5 rounded bg-warm/25 w-1/4" />
            <div className="h-1.5 rounded bg-text/10 w-full" />
            <div className="h-1.5 rounded bg-text/10 w-5/6" />
            <div className="h-1.5 rounded bg-text/10 w-3/4" />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 px-6 text-center">
          <Icon name="FileText" size={34} className="text-accent/50" />
          <p className="text-xs text-muted">
            CV dosyasını <span className="text-text-dim">public/cv/</span> içine koy,
            yolunu <span className="text-text-dim">site.config.js → files.cv</span> içine yaz
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Resume({ config }) {
  const cv = site.files.cv
  const fileName = cv ? cv.split('/').pop() : 'cv.pdf'

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

          <div className="relative aspect-[1/1.3] md:aspect-[1/1.1] overflow-hidden">
            {cv ? (
              // Dosya tanımlıysa tarayıcının kendi PDF önizlemesi
              <object
                data={`${cv}#toolbar=0&navpanes=0`}
                type="application/pdf"
                className="absolute inset-0 w-full h-full"
                aria-label="CV önizleme"
              >
                <CVPlaceholder />
              </object>
            ) : (
              <CVPlaceholder />
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
