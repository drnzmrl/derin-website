import { motion } from 'framer-motion'
import Icon from './Icon'

export default function Button({
  children,
  variant = 'solid',
  onClick,
  href,
  download,
  icon,
  className = '',
}) {
  const base =
    'inline-flex items-center gap-2 px-7 py-3.5 rounded-soft font-display font-semibold text-sm tracking-wide transition-all duration-300 cursor-pointer'

  const variants = {
    solid: 'bg-accent text-space hover:bg-accent/90 glow-soft',
    warm: 'bg-warm text-space hover:bg-warm/90 glow-warm',
    outline: 'border border-text/15 text-text hover:border-accent/50 hover:bg-accent/10',
    ghost: 'text-text-dim hover:text-text hover:bg-text/5',
  }

  const cls = `${base} ${variants[variant] || variants.solid} ${className}`

  const content = (
    <>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </>
  )

  const motionProps = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
  }

  if (href) {
    return (
      <motion.a href={href} download={download} className={cls} {...motionProps}>
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button onClick={onClick} className={cls} {...motionProps}>
      {content}
    </motion.button>
  )
}
