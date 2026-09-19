export default function Tag({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-accent/10 text-accent border-accent/20',
    muted: 'bg-text/5 text-text-dim border-text/10',
    warm: 'bg-warm/10 text-warm border-warm/25',
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-xs font-medium tracking-wide ${variants[variant]}`}
    >
      {children}
    </span>
  )
}
