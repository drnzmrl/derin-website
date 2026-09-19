export default function Tag({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-accent-dim text-accent border border-accent/20',
    muted: 'bg-surface-2 text-text-dim border border-border',
    gold: 'bg-amber-900/20 text-gold border border-amber-500/20',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-mono font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}
