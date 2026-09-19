/* Gökyüzü matematiği — katalog koordinatlarını 3B sahneye çevirir. */

const DEG = Math.PI / 180

/**
 * Ekvatoral koordinat (RA saat, Dec derece) → gök küresi üzerinde 3B nokta.
 * Kamera kürenin merkezinde durur, biz içeriden bakarız.
 */
export function raDecToVec3(raHours, decDeg, radius = 1) {
  const ra = raHours * 15 * DEG
  const dec = decDeg * DEG
  const cd = Math.cos(dec)
  return [
    radius * cd * Math.cos(ra),
    radius * Math.sin(dec),
    -radius * cd * Math.sin(ra),
  ]
}

/**
 * B-V renk indeksi → yaklaşık yüzey sıcaklığı (Kelvin).
 * Ballesteros (2012) formülü.
 */
export function bvToKelvin(bv) {
  const b = Math.min(Math.max(bv, -0.4), 2.0)
  return 4600 * (1 / (0.92 * b + 1.7) + 1 / (0.92 * b + 0.62))
}

/**
 * Renk sıcaklığı → RGB (0–1). Tanner Helland yaklaşımının sadeleştirilmişi.
 * Sıcak mavi devlerden soğuk kırmızı cücelere gerçekçi yıldız renkleri verir.
 */
export function kelvinToRgb(kelvin) {
  const t = Math.min(Math.max(kelvin, 1000), 40000) / 100
  let r, g, b

  if (t <= 66) {
    r = 255
    g = 99.4708025861 * Math.log(t) - 161.1195681661
  } else {
    r = 329.698727446 * Math.pow(t - 60, -0.1332047592)
    g = 288.1221695283 * Math.pow(t - 60, -0.0755148492)
  }

  if (t >= 66) b = 255
  else if (t <= 19) b = 0
  else b = 138.5177312231 * Math.log(t - 10) - 305.0447927307

  const c = (v) => Math.min(Math.max(v, 0), 255) / 255
  return [c(r), c(g), c(b)]
}

/** B-V renk indeksinden doğrudan RGB */
export function bvToRgb(bv) {
  return kelvinToRgb(bvToKelvin(bv))
}

/**
 * Görünür kadir → çizim boyutu.
 * Kadir ölçeği ters ve logaritmiktir: küçük sayı = parlak yıldız.
 */
export function magToSize(mag, { brightest = -1.5, faintest = 6.5, min = 0.6, max = 5 } = {}) {
  const t = 1 - (mag - brightest) / (faintest - brightest)
  return min + Math.pow(Math.max(0, Math.min(1, t)), 1.8) * (max - min)
}

/** Görünür kadir → parlaklık (0–1) */
export function magToBrightness(mag, faintest = 6.5) {
  const t = 1 - mag / faintest
  return Math.max(0.12, Math.min(1, t))
}

/** Derin gök cismi türüne göre renk (0–1 RGB) */
export const DEEP_SKY_COLORS = {
  g: [0.78, 0.82, 1.0],   // galaksi — soluk mavi-beyaz
  n: [1.0, 0.55, 0.62],   // bulutsu — Hα kırmızısı
  o: [0.72, 0.85, 1.0],   // açık küme — genç mavi yıldızlar
  c: [1.0, 0.88, 0.7],    // küresel küme — yaşlı sarı yıldızlar
  p: [0.55, 1.0, 0.85],   // gezegenimsi bulutsu — OIII yeşil-turkuaz
}
