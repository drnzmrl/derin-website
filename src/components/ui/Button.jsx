import { motion } from 'framer-motion'

export default function Button({ children, variant = 'primary', onClick, href, className = '', icon }) {
  const base = 'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-medium text-sm tracking-wide transition-all duration-200 cursor-pointer'

  const variants = {
    primary: 'bg-accent text-background hover:bg-accent/90 shadow-lg shadow-accent/20',
    outline: 'border border-accent/40 text-accent hover:bg-accent/10 hover:border-accent/70',
    ghost: 'text-text-dim hover:text-text hover:bg-surface-2',
  }

  const cls = `${base} ${variants[variant]} ${className}`

  const content = (
    <>
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </>
  )

  if (href) {
    return (
      <motion.a
        href={href}
        className={cls}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      onClick={onClick}
      className={cls}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {content}
    </motion.button>
  )
}
