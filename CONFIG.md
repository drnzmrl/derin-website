# Siteyi Nasıl Değiştiririm

Kod yazmadan değiştirebileceğin her şey **üç ayar dosyasında** ve **veri dosyalarında**.
Dosyayı kaydettiğin anda site güncellenir (dev sunucusu açıksa).

```
src/config/
  site.config.js      → sen kimsin, bağlantıların, dosyaların, efektler
  theme.config.js     → renkler, gökyüzü, yazı tipleri, 3B sahne
  sections.config.js  → hangi bölüm var, sırası, başlıkları

src/data/
  about.js            → Hakkımda metinleri, fotoğraf, istatistikler
  projects.js         → projeler
  drawings.js         → teknik çizimler
  publications.js     → yayınlar
  skills.js           → yetenekler
```

---

## Bölüm ekleme / çıkarma / sıralama

Hepsi `src/config/sections.config.js` içinde.

**Gizlemek** — satırdaki `enabled` değerini değiştir:
```js
{ key: 'drawings', enabled: false, ... }
```

**Sırasını değiştirmek** — satırı listede yukarı/aşağı taşı. Sayfadaki sıra listedeki sıradır.

**Menüden çıkarmak ama sayfada bırakmak**:
```js
{ key: 'resume', enabled: true, inNav: false, ... }
```

**Başlığını değiştirmek** — bileşen dosyasını açma, burada yazıyor:
```js
{
  key: 'projects',
  label: 'Selected Work',    // küçük üst etiket
  title: 'Projects',         // büyük başlık
  subtitle: 'Simulation, analysis and design work...',
}
```

**Yeni bölüm eklemek** — 3 adım:

1. Bileşeni yaz — `src/sections/Awards.jsx`:
```jsx
import Section from '../components/layout/Section'

export default function Awards({ config }) {
  return (
    <Section config={config}>
      <p className="text-text-dim">İçerik buraya.</p>
    </Section>
  )
}
```

2. `src/sections/registry.js` dosyasına kaydet:
```js
import Awards from './Awards'
export const registry = { ...,  awards: Awards }
```

3. `sections.config.js` içine bir satır ekle:
```js
{ key: 'awards', enabled: true, inNav: true, navLabel: 'Awards',
  label: 'Recognition', title: 'Awards', subtitle: '...' }
```

---

## Dosya ekleme / çıkarma

Dosyayı `public/` altına koy, yolunu `site.config.js` içine yaz.
`public/cv/derin-cv.pdf` dosyasının yolu `/cv/derin-cv.pdf` olur.

```js
files: {
  cv: '/cv/derin-cv.pdf',
  transcript: '/docs/transcript.pdf',   // yeni dosya
}
```

`null` yaparsan ilgili buton **kendiliğinden kaybolur** — ayrıca bir şey silmen gerekmez.

**Görseller:**
- Profil fotoğrafı → `src/data/about.js` → `photo: '/images/derin.jpg'`
- Proje görseli → `src/data/projects.js` → ilgili projenin `image` alanı
- Çizim görseli → `src/data/drawings.js` → ilgili çizimin `image` alanı

Hepsinde `null` bırakırsan yer tutucu görünür, sayfa bozulmaz.

---

## Renkler ve tema

`src/config/theme.config.js`. Renk kodunu değiştir, tüm site değişir —
başka hiçbir dosyada renk yazmıyor.

```js
colors: {
  space:      '#060912',  // en koyu uç
  atmosphere: '#1B2547',
  dawn:       '#3D3155',
  horizon:    '#FFB37A',  // sıcak gün doğumu
  accent:     '#9DBEFF',  // ana vurgu
  warm:       '#FFA86B',  // ikincil vurgu
  ...
}
```

**Gökyüzü geçişi** — sayfa boyunca uzanan dikey gradyan.
`at` sayfanın yüzde kaçı olduğunu söyler (0 = tepe, 1 = dip):
```js
sky: [
  { at: 0.00, color: '#54405F' },  // üst: şafak
  { at: 1.00, color: '#060912' },  // alt: derin uzay
]
```
Durak ekleyip çıkarabilirsin. Sırayı ters çevirirsen yön de ters döner.

**Yumuşaklık:**
```js
shape: {
  radius: '1rem',        // köşe yuvarlaklığı
  borderAlpha: 0.10,     // kenarlık belirginliği
  surfaceAlpha: 0.045,   // kart zemini opaklığı
  blur: '14px',          // cam efekti
}
```

**Hareket** — `motion.enabled: false` tüm animasyonları kapatır.
`motion.speed: 0.5` her şeyi iki kat yavaşlatır.

---

## 3B gökyüzü sahnesi

`theme.config.js` → `space`. Gerçek astronomik kataloglardan çiziliyor:
**8.920 gerçek yıldız** (HYG v4.4) ve **6.442 gerçek gök cismi**
(OpenNGC — 5.500'ü galaksi). Konumlar, renkler ve parlaklıklar gerçek,
yani takımyıldızlar olması gereken yerde.

```js
space: {
  enabled: true,      // false → hafif 2B yıldız alanına düşer
  opacity: 1,

  starMag: 5.2,       // yıldız kadir sınırı (aşağıya bak)
  starBoost: 1.8,     // kalan yıldızların parlaklık çarpanı
  deepSkyMag: 10.5,   // galaksi/bulutsu kadir sınırı
  deepSkyBoost: 1.6,

  autoQuality: true,  // yavaş cihazda kendini otomatik kıssın

  craft: {
    rocket: true,     // hero'da ismin yanından başlayıp yıldızlara iner
    plane: true,      // hero'nun tepesinden geçen uçak
    satellite: true,  // sağ kenarda duran minik uydu
    astronaut: true,  // sayfanın ortasında süzülen astronot
    probe: true,      // aşağılarda, uzakta derin uzay sondası
  },
  rocketSide: 'left', // 'left' | 'right'
  rocketFlame: true,
}
```

### Kasıyorsa ne yapmalı

En pahalı şey nokta sayısı değil, **noktaların kapladığı piksel alanı**
(toplamalı karışım üst üste biniyor). En etkili ayar kadir sınırları —
sayıyı düşürmek yıldız sayısını hızla azaltır:

| `starMag` | yıldız sayısı |
|---|---|
| 6.5 | 8920 (çıplak göz sınırı) |
| 5.2 | 2072 ← şu anki |
| 4.5 | 925 (az ama iri ve parlak) |

| `deepSkyMag` | gök cismi |
|---|---|
| 14.5 | 6442 |
| 10.5 | 713 ← şu anki |

Azaltırken `starBoost` / `deepSkyBoost` değerlerini artır — daha az ama
daha parlak yıldız, genelde daha iyi de duruyor.

Hâlâ ağırsa sırayla: `craft.astronaut` / `craft.probe` kapat →
`deepSkyMag: 9` → `space.enabled: false` (2B yıldız alanına düşer).

Sahne zaten mobilde kendiliğinden sadeleşiyor, sekme arkaya geçince
çizmeyi durduruyor, sistem "hareketi azalt" diyorsa hiç açılmıyor ve
ilk 3 saniyede 45 fps altını görürse galaksileri atıp çözünürlüğü
düşürüyor. three.js ayrı parça — ilk açılışı yavaşlatmaz.

Veri dosyaları `public/data/` altında; oradaki `README.md` kaynakları
ve alanları anlatıyor. Her ikisi de CC BY-SA 4.0, atıf altbilgide.

---

## Arayüz efektleri

`site.config.js` → `effects`. Her biri tek tek kapatılabilir; kapatınca
içerik hareketsiz ama tam görünür kalır.

```js
effects: {
  magnetic: true,     // butonlar imlece doğru çekilir
  tilt: true,         // kartlar imlece göre 3B eğilir
  borderTrail: true,  // kart kenarında dolaşan ışık
  textReveal: true,   // hero metni harf harf belirir
}
```

Bu bileşenler [motion-primitives](https://github.com/ibelick/motion-primitives)
(MIT) fikirlerinden uyarlandı, `src/components/motion/` altında.
Kendi bölümlerinde de kullanabilirsin:

```jsx
import { InView, Tilt, Magnetic, AnimatedNumber } from '../components/motion'

<InView from="left" delay={0.1}>...</InView>
<Tilt className="panel p-6">...</Tilt>
<Magnetic><button>Tıkla</button></Magnetic>
<AnimatedNumber value="3+" />
```

---

## İkonlar

Ayar dosyalarında ikonlar metin olarak yazılır (`icon: 'Rocket'`).
Kullanılabilir isimler `src/components/ui/icons.js` içinde listeli.

Yeni ikon eklemek: [lucide.dev/icons](https://lucide.dev/icons) adresinden
adını bul, o dosyadaki iki listeye de ekle. (Hepsini birden almıyoruz,
yoksa paket ~800 KB şişiyor.)

---

## Hazır CSS sınıfları

Kendi bölümlerini yazarken işine yarar:

| Sınıf | Ne yapar |
|---|---|
| `panel` | Yumuşak cam kart zemini + kenarlık |
| `panel-hover` | Üzerine gelince aydınlanır |
| `eyebrow` | Küçük, geniş aralıklı üst etiket |
| `field` | Form girdisi |
| `text-gradient` | Başlıklarda mavi→turuncu geçiş |
| `horizon-line` | İnce ufuk ayıracı |
| `glow-soft` / `glow-warm` | Yumuşak gölge |

Renk sınıfları: `text-accent`, `text-warm`, `bg-space`, `border-text/10`,
`text-text-dim`, `text-muted` — hepsi tema dosyasından besleniyor.

---

## Çalıştırma

```bash
npm run dev
```

```bash
npm run build
```
