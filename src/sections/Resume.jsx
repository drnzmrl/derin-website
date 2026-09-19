import { motion } from 'framer-motion'
import { Download, FileText, Eye } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'

export default function Resume() {
  return (
    <section id="resume" className="py-28 px-6 section-grid">
      <div className="max-w-3xl mx-auto text-center">
        <SectionHeading
          label="CV"
          title="Curriculum Vitae"
          subtitle="My full academic and professional record — available to download."
        />

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Glass card frame */}
          <div className="relative bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl">
            {/* Top bar decoration */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-surface-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-border" />
                <div className="w-3 h-3 rounded-full bg-border" />
                <div className="w-3 h-3 rounded-full bg-border" />
              </div>
              <span className="font-mono text-xs text-muted ml-2">derin-cv.pdf</span>
            </div>

            {/* Preview area */}
            <div className="relative aspect-[1/1.3] md:aspect-[1/1.1] bg-surface blueprint-grid flex items-center justify-center overflow-hidden">
              {/* PDF iframe — uncomment when CV file exists */}
              {/* <iframe
                src="/cv/derin-cv.pdf"
                className="absolute inset-0 w-full h-full"
                title="Derin CV"
              /> */}

              {/* Placeholder content — shows when PDF not available */}
              <CVPreviewPlaceholder />
            </div>
          </div>

          {/* Glow under card */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-accent/5 blur-2xl rounded-full pointer-events-none" />
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href="/cv/derin-cv.pdf"
            download
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-background rounded-xl font-display font-semibold text-sm tracking-wide hover:bg-accent/90 transition-all duration-200 shadow-lg shadow-accent/20"
          >
            <Download size={17} />
            Download CV
          </a>
          <a
            href="/cv/derin-cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 border border-accent/35 text-accent rounded-xl font-display font-semibold text-sm tracking-wide hover:bg-accent/10 transition-all duration-200"
          >
            <Eye size={17} />
            Open in browser
          </a>
        </motion.div>
      </div>

      <div className="mt-24 horizon-line max-w-6xl mx-auto" />
    </section>
  )
}

function CVPreviewPlaceholder() {
  return (
    <div className="w-full h-full flex flex-col items-start justify-start p-8 md:p-12 font-mono text-accent/20 text-[10px] leading-relaxed select-none">
      {/* Simulated CV layout */}
      <div className="w-full space-y-5">
        <div className="space-y-1">
          <div className="h-4 bg-accent/15 rounded w-1/3" />
          <div className="h-2 bg-accent/08 rounded w-1/2" />
          <div className="h-2 bg-accent/08 rounded w-2/5" />
        </div>
        <div className="h-px bg-accent/15 w-full" />
        <div className="space-y-1.5">
          <div className="h-2.5 bg-accent/12 rounded w-1/4" />
          <div className="h-1.5 bg-accent/06 rounded w-full" />
          <div className="h-1.5 bg-accent/06 rounded w-5/6" />
          <div className="h-1.5 bg-accent/06 rounded w-4/5" />
        </div>
        <div className="space-y-1.5">
          <div className="h-2.5 bg-accent/12 rounded w-1/4" />
          <div className="h-1.5 bg-accent/06 rounded w-full" />
          <div className="h-1.5 bg-accent/06 rounded w-3/4" />
        </div>
        <div className="space-y-1.5">
          <div className="h-2.5 bg-accent/12 rounded w-1/4" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-2">
              <div className="h-1.5 bg-accent/08 rounded w-1/4" />
              <div className="h-1.5 bg-accent/05 rounded flex-1" />
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          <div className="h-2.5 bg-accent/12 rounded w-1/5" />
          <div className="flex flex-wrap gap-1.5">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className="h-4 bg-accent/08 rounded px-3" style={{ width: `${40 + i * 8}px` }} />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 opacity-50">
          <FileText size={36} className="text-accent/40" />
          <p className="font-mono text-xs text-muted">Add your CV to /public/cv/derin-cv.pdf</p>
        </div>
      </div>
    </div>
  )
}
