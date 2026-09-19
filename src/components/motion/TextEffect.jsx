import { motion } from 'framer-motion'
import { theme } from '../../config/theme.config'
import { dur, motionOff } from '../../config/applyTheme'

/**
 * Metni harf harf veya kelime kelime ortaya çıkarır.
 *
 *   <TextEffect per="char" preset="lift">Derin</TextEffect>
 *   <TextEffect per="word" delay={0.4}>{site.tagline}</TextEffect>
 *
 * Kaynak fikir: motion-primitives (MIT) — projeye uyarlandı.
 */

/* ⚠ Gradyanlı başlıklarda (text-gradient) `filter` CANLANDIRMA.
   Framer animasyon bitince elementte `filter: blur(0px)` bırakıyor;
   sıfır bile olsa bir filter değeri yeni bir kapsayıcı blok yaratıyor
   ve üst elementteki `background-clip: text` o harf için bozuluyor —
   harf kayboluyor. Bu yüzden `launch` blur yerine ölçek kullanıyor.
   `blur` ön ayarı yalnızca düz renkli metinler için.            */
const PRESETS = {
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  },
  lift: {
    hidden: { opacity: 0, y: '0.45em' },
    show: { opacity: 1, y: 0 },
  },
  // Fırlatma hissi: aşağıdan, hafifçe büyüyerek gelir
  launch: {
    hidden: { opacity: 0, y: '0.7em', scale: 0.86 },
    show: { opacity: 1, y: 0, scale: 1 },
  },
  // Sadece düz renkli metinlerde kullan — gradyanlı başlıkta değil
  blur: {
    hidden: { opacity: 0, filter: 'blur(8px)' },
    show: { opacity: 1, filter: 'blur(0px)' },
  },
}

export default function TextEffect({
  children,
  per = 'word',
  preset = 'lift',
  delay = 0,
  stagger = 0.045,
  duration = 0.6,
  as: Tag = 'span',
  className = '',
  trigger = 'mount', // 'mount' | 'inView'
}) {
  const text = String(children ?? '')
  const variant = PRESETS[preset] || PRESETS.lift

  // Hareket kapalıysa düz metin bas — okunabilirlik önce gelir
  if (motionOff()) {
    return <Tag className={className}>{text}</Tag>
  }

  const pieces = per === 'char' ? Array.from(text) : text.split(' ')

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: dur(stagger),
        delayChildren: dur(delay),
      },
    },
  }

  const child = {
    hidden: variant.hidden,
    show: {
      ...variant.show,
      transition: { duration: dur(duration), ease: theme.motion.ease },
    },
  }

  const MotionTag = motion[Tag] || motion.span
  const animateProps =
    trigger === 'inView'
      ? { whileInView: 'show', viewport: { once: true, margin: '-60px' } }
      : { animate: 'show' }

  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      {...animateProps}
      aria-label={text}
    >
      {/* overflow:hidden YOK - negatif harf araligi (tracking-tight) ve
          olcek animasyonuyla birlikte son harfi kirpiyordu. */}
      {pieces.map((piece, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          variants={child}
          style={{ display: 'inline-block', willChange: 'transform, opacity' }}
        >
          {piece}
          {per === 'word' && i < pieces.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </MotionTag>
  )
}
