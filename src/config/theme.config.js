/* ══════════════════════════════════════════════════════════════
   TEMA AYARLARI — "Fırlatma / Şafaktan Yörüngeye"

   Bu dosyadaki değerleri değiştir, tüm site anında değişir.
   Başka hiçbir yerde renk kodu yazmana gerek yok.

   Sayfa bir fırlatma gibi okunur: en üstte şafak vakti rampa
   (açık, sıcak) → aşağı indikçe atmosfer inceliyor → en altta
   derin uzay (koyu, yıldızlı).
   ══════════════════════════════════════════════════════════════ */

export const theme = {
  /* ---- Ana renkler (hex yaz, gerisini sistem halleder) ---- */
  colors: {
    space:      '#060912', // en üst: uzay siyahı
    atmosphere: '#1B2547', // orta: üst atmosfer
    dawn:       '#3D3155', // alt: şafak moru
    horizon:    '#FFB37A', // sıcak gün doğumu çizgisi
    accent:     '#9DBEFF', // ana vurgu (yumuşak gökyüzü mavisi)
    warm:       '#FFA86B', // ikincil vurgu (roket egzozu)
    text:       '#EEF2FB', // ana metin
    textDim:    '#AEB8D4', // ikincil metin
    muted:      '#7C88AB', // en soluk metin
  },

  /* ---- Sayfa boyunca dikey gökyüzü gradyanı ----
     at: sayfanın yüzde kaçı (0 = en üst, 1 = en alt)
     Üstte şafak (açık) → altta uzay (koyu). Durak ekleyip
     çıkarabilir, sırayı ters çevirebilirsin.              */
  sky: [
    { at: 0.00, color: '#54405F' }, // rampa: şafak moru
    { at: 0.12, color: '#453757' },
    { at: 0.32, color: '#2E2A4E' }, // troposfer
    { at: 0.55, color: '#1B2547' }, // stratosfer
    { at: 0.78, color: '#0E1528' }, // mezosfer
    { at: 1.00, color: '#060912' }, // yörünge: derin uzay
  ],

  /* ---- GERÇEK GÖKYÜZÜ (3B) ----
     Gerçek astronomik kataloglardan çizilir:
       • 8.920 yıldız  — HYG v4.4 (Hipparcos + Yale BSC + Gliese)
       • 6.442 derin gök cismi — OpenNGC (5.500'ü gerçek galaksi)
     Konumlar, renkler ve parlaklıklar gerçek — takımyıldızlar
     olması gereken yerde çıkar.

     enabled: false yaparsan aşağıdaki 2B yıldız alanına düşer
     (daha hafif ama procedural).                              */
  space: {
    enabled: true,
    opacity: 0.9,

    /* Sol tarafta kaydırdıkça tırmanan araç.
       'rocket' | 'probe' | 'satellite' | false (kapalı) */
    craft: 'rocket',
    craftSide: 'left',   // 'left' | 'right' — hero'da ismin hangi yanında
    craftFlame: true,    // roketin egzoz alevi
    orbiter: true,       // arkada yerinde yavaşça dönen uydu
  },

  /* ---- 2B yıldız alanı (3B kapalıyken yedek) ----
     Rampada görünmez, yükseldikçe ortaya çıkar. */
  stars: {
    enabled: true,
    count: 140,         // yıldız sayısı
    twinkle: true,      // yanıp sönsün mü
    shootingStars: true,
    appearFrom: 0.25,   // bu orandan sonra yıldızlar belirmeye başlar
    fullBy: 0.7,        // bu oranda tam parlaklığa ulaşır
  },

  /* ---- Ufuk parıltısı ----
     Fırlatma rampasının sıcak ışığı. Başta güçlü,
     yükseldikçe geride kalır. */
  horizonGlow: {
    enabled: true,
    intensity: 0.75,   // 0 = kapalı, 1 = çok güçlü
    height: '55vh',
    fadeBy: 0.45,      // sayfanın bu oranında tamamen kaybolur
  },

  /* ---- Yazı tipleri ----
     Değiştirirsen index.html'deki Google Fonts satırını da güncelle. */
  fonts: {
    display: "'Space Grotesk', system-ui, sans-serif", // başlıklar
    body:    "'Inter', system-ui, sans-serif",          // gövde metni
  },

  /* ---- Yumuşaklık ayarları ---- */
  shape: {
    radius:      '1rem',    // kartların köşe yuvarlaklığı
    radiusSmall: '0.625rem',
    borderAlpha: 0.10,      // kart kenarlıklarının belirginliği (0–1)
    surfaceAlpha: 0.045,    // kart zeminlerinin opaklığı (0–1)
    blur:        '14px',    // cam efekti bulanıklığı
  },

  /* ---- Hareket ---- */
  motion: {
    enabled: true,   // false → tüm animasyonlar kapanır
    speed: 1,        // 0.5 = iki kat yavaş, 2 = iki kat hızlı
    ease: [0.16, 1, 0.3, 1],
  },
}

export default theme
