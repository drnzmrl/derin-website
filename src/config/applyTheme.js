import { theme } from './theme.config'

/** '#1B2547' → '27 37 71'  (Tailwind'in /opacity kısayolları için) */
function channels(hex) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}

/** theme.sky durakları → tek bir CSS linear-gradient */
function skyGradient(stops) {
  const sorted = [...stops].sort((a, b) => a.at - b.at)
  const parts = sorted.map((s) => `${s.color} ${(s.at * 100).toFixed(1)}%`)
  return `linear-gradient(to bottom, ${parts.join(', ')})`
}

/**
 * theme.config.js içindeki değerleri CSS değişkenlerine yazar.
 * Uygulama açılırken bir kez çağrılır (main.jsx).
 */
export function applyTheme(t = theme) {
  const root = document.documentElement
  const set = (k, v) => root.style.setProperty(k, v)

  for (const [name, hex] of Object.entries(t.colors)) {
    set(`--c-${name}`, channels(hex))
  }

  set('--sky', skyGradient(t.sky))
  set('--font-display', t.fonts.display)
  set('--font-body', t.fonts.body)

  set('--radius', t.shape.radius)
  set('--radius-sm', t.shape.radiusSmall)
  set('--border-alpha', String(t.shape.borderAlpha))
  set('--surface-alpha', String(t.shape.surfaceAlpha))
  set('--blur', t.shape.blur)

  set('--horizon-height', t.horizonGlow.height)
  set('--horizon-intensity', String(t.horizonGlow.enabled ? t.horizonGlow.intensity : 0))

  // Hareket kapalıysa tüm CSS geçişlerini kısalt
  root.dataset.motion = t.motion.enabled ? 'on' : 'off'
}

/** Kullanıcı "hareketi azalt" demişse veya tema kapattıysa true. */
export function motionOff(t = theme) {
  if (!t.motion.enabled) return true
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Animasyon süresini theme.motion.speed ile ölçekler. */
export const dur = (seconds, t = theme) =>
  motionOff(t) ? 0 : seconds / (t.motion.speed || 1)

export default applyTheme
