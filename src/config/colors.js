import { theme } from './theme.config'

/** '#9DBEFF' → { r: 157, g: 190, b: 255 } */
export function hexToRgb(hex) {
  const h = String(hex).replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

/** Tema renginin kanalları — canvas çizimleri için. rgb('accent') */
export const rgb = (name, t = theme) => hexToRgb(t.colors[name] ?? '#ffffff')

/** Hazır rgba dizesi. rgba('warm', 0.4) → 'rgba(255,168,107,0.4)' */
export function rgba(name, alpha = 1, t = theme) {
  const { r, g, b } = rgb(name, t)
  return `rgba(${r},${g},${b},${alpha})`
}
