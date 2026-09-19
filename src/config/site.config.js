/* ══════════════════════════════════════════════════════════════
   SİTE AYARLARI — kim olduğun, bağlantıların, dosyaların

   Buradaki her şey metin. Değiştir, kaydet, site güncellenir.
   ══════════════════════════════════════════════════════════════ */

export const site = {
  /* ---- Kimlik ---- */
  name: 'Derin',
  initial: 'D',                       // logo ve footer'daki harf
  role: 'Aerospace Engineering',      // hero'daki üst etiket
  tagline: 'Aspiring researcher and aerospace engineer.',
  university: 'B.Sc. Aerospace Engineering — Middle East Technical University (NCC)',
  location: 'Turkey 🇹🇷',
  availability: 'Available for remote positions worldwide',

  /* ---- Tarayıcı sekmesi / SEO ---- */
  meta: {
    title: 'Derin | Aerospace Engineer',
    description: 'Derin — Aerospace Engineering Student Portfolio',
  },

  /* ---- İletişim ---- */
  email: 'derin@email.com',

  /* ---- DOSYALAR ----
     Dosyayı public/ klasörüne koy, yolunu buraya yaz.
     İstemiyorsan null yap — ilgili buton otomatik kaybolur.

     Örnek: public/cv/derin-cv.pdf  →  '/cv/derin-cv.pdf'          */
  files: {
    cv: '/cv/derin-cv.pdf',
    // transcript: '/docs/transcript.pdf',   ← böyle yenisini ekleyebilirsin
  },

  /* ---- SOSYAL BAĞLANTILAR ----
     Sıralarını değiştirebilir, silebilir, yenisini ekleyebilirsin.
     icon: lucide-react ikon adı → https://lucide.dev/icons        */
  socials: [
    { label: 'LinkedIn',      icon: 'Linkedin',   href: 'https://linkedin.com/in/derin' },
    { label: 'GitHub',        icon: 'Github',     href: 'https://github.com/derin' },
    { label: 'Email',         icon: 'Mail',       href: 'mailto:derin@email.com' },
    { label: 'ResearchGate',  icon: 'BookMarked', href: 'https://researchgate.net/profile/derin' },
  ],

  /* ---- HERO BUTONLARI ----
     kind: 'scroll' → sayfada bir bölüme kaydırır (target: bölüm anahtarı)
     kind: 'file'   → yukarıdaki files.* içinden bir dosyayı indirir
     kind: 'link'   → dış bağlantı açar (href yaz)                  */
  heroButtons: [
    { label: 'View Projects', kind: 'scroll', target: 'projects', style: 'solid' },
    { label: 'Download CV',   kind: 'file',   target: 'cv',       style: 'outline', icon: 'Download' },
  ],

  /* ---- İMLEÇ EFEKTİ ----
     'rocket' → imleci takip eden roket, arkasında alev/duman izi
     'plane'  → imleci takip eden jet, arkasında uçak izi
     'none'   → kapalı                                             */
  cursorCraft: 'rocket',

  /* ---- Footer ---- */
  footer: {
    note: 'Aerospace Engineering Portfolio',
    credit: 'Built with React + Framer Motion',
    showCredit: true,
  },

  /* ---- Genel açma/kapama ---- */
  features: {
    scrollProgress: true,   // en üstteki ilerleme çubuğu
    navbarCvButton: true,   // menüdeki CV butonu
  },

  /* ---- ARAYÜZ EFEKTLERİ ----
     motion-primitives'ten uyarlanan bileşenler.
     Her biri tek tek kapatılabilir; kapatınca içerik
     hareketsiz ama tam olarak görünür kalır.            */
  effects: {
    magnetic: true,     // butonlar imlece doğru çekilir
    tilt: true,         // kartlar imlece göre 3B eğilir
    borderTrail: true,  // kart kenarında dolaşan ışık
    textReveal: true,   // hero metni kelime kelime belirir
  },
}

export default site
