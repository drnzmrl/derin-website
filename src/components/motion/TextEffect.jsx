import { useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { theme } from '../../config/theme.config'
import { dur, motionOff } from '../../config/applyTheme'

/**
 * Metni harf harf veya kelime kelime ortaya çıkarır.
 *
 *   <TextEffect per="char" preset="launch" gradient>Derin</TextEffect>
 *   <TextEffect per="word" delay={0.4}>{site.tagline}</TextEffect>
 *
 * Kaynak fikir: motion-primitives (MIT) — projeye uyarlandı.
 */

/* ⚠ GRADYAN + HAREKET TUZAĞI
   `background-clip: text` gradyanı üst elemente uygulanır ve yalnızca
   kendi katmanında boyanır. Bir alt element `transform`, `filter` veya
   `will-change` alırsa kendi stacking context'ine geçer; üstteki
   gradyan oraya ulaşmaz ve harf ŞEFFAF kalır — yani kaybolur.

   Harf harf canlandırma zorunlu olarak transform kullandığı için
   çözüm, gradyanı üst elemente değil HER HARFE ayrı ayrı vermek:
   aşağıdaki useLayoutEffect her harfin başlık içindeki yatay
   konumunu ölçüp gradyanın o dilimini harfe atıyor. Sonuç görsel
   olarak tek parça bir gradyan, ama her harf serbestçe hareket
   edebiliyor.                                                      */

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
  // `filter` kullanır → gradient={true} ile BİRLİKTE KULLANMA
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
  gradient = false,
  trigger = 'mount', // 'mount' | 'inView'
}) {
  const text = String(children ?? '')
  const variant = PRESETS[preset] || PRESETS.lift
  const ref = useRef(null)

  /** Gradyanı parçalara bölüp her harfe kendi dilimini ver */
  useLayoutEffect(() => {
    if (!gradient) return
    const host = ref.current
    if (!host) return

    const paint = () => {
      // offsetLeft/offsetWidth kullanılıyor, getBoundingClientRect DEĞİL:
      // ikincisi transform'u da hesaba katıyor ve harfler animasyonun
      // başında ölçeklenmiş olduğu için dilimler kayıyordu.
      const width = host.offsetWidth
      if (!width) return
      const base = host.offsetLeft
      for (const el of host.children) {
        el.style.backgroundImage = 'var(--text-gradient)'
        el.style.backgroundSize = `${width}px 100%`
        el.style.backgroundPosition = `${-(el.offsetLeft - base)}px 0`
        el.style.backgroundRepeat = 'no-repeat'
        el.style.webkitBackgroundClip = 'text'
        el.style.backgroundClip = 'text'
        el.style.webkitTextFillColor = 'transparent'
      }
    }

    paint()
    // Yazı tipi sonradan gelirse harf genişlikleri değişir
    document.fonts?.ready.then(paint)

    const ro = new ResizeObserver(paint)
    ro.observe(host)
    return () => ro.disconnect()
  }, [gradient, text, per])

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
      ref={ref}
      className={className}
      variants={container}
      initial="hidden"
      {...animateProps}
      aria-label={text}
    >
      {/* overflow:hidden ve will-change YOK — ilki negatif harf
          aralığında son harfi kırpıyor, ikincisi stacking context
          yaratıp gradyanı bozuyordu. */}
      {pieces.map((piece, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          variants={child}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {piece}
          {per === 'word' && i < pieces.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </MotionTag>
  )
}
