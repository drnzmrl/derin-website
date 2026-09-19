import { useEffect, useRef } from 'react'

/**
 * Sayfa kaydırma ilerlemesini (0–1) bir ref içinde tutar.
 * State kullanmaz — her kaydırmada React yeniden çizilmesin diye.
 * Animasyon döngüleri `ref.current` okur.
 */
export function useScrollProgress() {
  const ref = useRef(0)

  useEffect(() => {
    const update = () => {
      const max = document.body.scrollHeight - window.innerHeight
      ref.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return ref
}

export default useScrollProgress
