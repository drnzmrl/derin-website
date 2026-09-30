/**
 * Bölüm içindeki ikinci grup için küçük başlık.
 *   <SubHeading title="Coursework & self-study" note="..." />
 */
export default function SubHeading({ title, note, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 ${className}`}>
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-gradient-to-r from-accent/60 to-warm/60" aria-hidden="true" />
        <h3 className="font-display text-lg md:text-xl font-semibold tracking-tight text-text">{title}</h3>
      </div>
      {note && <p className="text-xs text-muted">{note}</p>}
    </div>
  )
}
