/* ══════════════════════════════════════════════════════════════
   SİTE AYARLARI · kim olduğun, bağlantıların, dosyaların

   Buradaki her şey metin. Değiştir, kaydet, site güncellenir.
   ══════════════════════════════════════════════════════════════ */

export const site = {
  /* ---- Kimlik ---- */
  name: 'Derin',
  surname: 'İzmirli',
  fullName: 'Derin İzmirli',
  initial: 'D',                       // logo ve footer'daki harf
  role: 'Aerospace Engineering · METU NCC',   // hero'daki üst etiket
  tagline: 'I study how air behaves around wings and bodies, from 30 m/s to Mach 1.5.',
  university: 'B.Sc. Aerospace Engineering, Middle East Technical University, Northern Cyprus Campus',
  location: 'Türkiye · Northern Cyprus',
  availability: 'Open to internships and research projects',

  /* Hero'daki küçük durum etiketi (yanında radar noktası atar).
     Gizlemek için: null */
  status: 'Open to internships & research',

  /* Hero'nun altındaki ince bilgi şeridi (monospace).
     Her satır bir parça; aralarına ayraç konur. */
  telemetry: ['CFD · ANSYS Fluent · COMSOL', 'TEKNOFEST Fighter UAV', '3rd year', 'TR · EN C1'],

  /* ---- Tarayıcı sekmesi / SEO ---- */
  meta: {
    title: 'Derin İzmirli | Aerospace Engineering',
    description:
      'Derin İzmirli, aerospace engineering student at METU NCC. CFD work on airfoils, 3D wings and the Ahmed body in ANSYS Fluent.',
  },

  /* ---- İletişim ---- */
  email: 'derin.izmirli@metu.edu.tr',
  linkedin: 'https://www.linkedin.com/in/derinizmirli',

  /* ---- DOSYALAR ----
     Dosyayı public/ klasörüne koy, yolunu buraya yaz.
     İstemiyorsan null yap, ilgili buton otomatik kaybolur.

     Örnek: public/cv/derin-cv.pdf  →  '/cv/derin-cv.pdf'          */
  files: {
    cv: '/cv/derin-cv.pdf',
  },

  /* ---- SOSYAL BAĞLANTILAR ----
     icon: src/components/ui/icons.js içindeki bir isim           */
  socials: [
    { label: 'LinkedIn', icon: 'Linkedin', href: 'https://www.linkedin.com/in/derinizmirli', handle: 'in/derinizmirli' },
    { label: 'GitHub',   icon: 'Github',   href: 'https://github.com/drnzmrl',              handle: 'drnzmrl' },
    { label: 'Email',    icon: 'Mail',     href: 'mailto:derin.izmirli@metu.edu.tr',        handle: 'derin.izmirli@metu.edu.tr' },
  ],

  /* ---- HERO BUTONLARI ----
     kind: 'scroll'  → sayfada bir bölüme kaydırır (target: bölüm anahtarı)
     kind: 'file'    → yukarıdaki files.* içinden bir dosyayı indirir
     kind: 'link'    → dış bağlantı açar (href yaz)
     kind: 'contact' → rehbere kaydet (vCard) indirir               */
  heroButtons: [
    { label: 'See my work', kind: 'scroll', target: 'projects', style: 'solid' },
    { label: 'Download CV', kind: 'file', target: 'cv', style: 'outline', icon: 'Download' },
    { label: 'Save contact', kind: 'contact', style: 'ghost', icon: 'UserPlus' },
  ],

  /* ---- İMLEÇ EFEKTİ ----
     'rocket' → imleci takip eden roket, arkasında alev/duman izi
     'plane'  → imleci takip eden jet, arkasında uçak izi
     'none'   → kapalı                                             */
  cursorCraft: 'rocket',

  /* ---- Footer ---- */
  footer: {
    note: 'Aerospace Engineering',
    credit: 'Built with React, three.js and real star catalogues',
    showCredit: true,
  },

  /* ---- Genel açma/kapama ---- */
  features: {
    scrollProgress: true,   // en üstteki ilerleme çubuğu
    navbarCvButton: true,   // menüdeki CV butonu
    backToTop: true,        // sağ altta, kaydırma ilerlemesini gösteren yukarı çık butonu
    qr: true,               // menüde ve iletişimde QR kod (siteyi telefondan açtırmak için)
  },

  /* ---- ARAYÜZ EFEKTLERİ ----
     Her biri tek tek kapatılabilir; kapatınca içerik
     hareketsiz ama tam olarak görünür kalır.            */
  effects: {
    magnetic: true,     // butonlar imlece doğru çekilir
    tilt: true,         // kartlar imlece göre 3B eğilir
    borderTrail: true,  // kart kenarında dolaşan ışık
    textReveal: true,   // hero metni harf harf belirir
  },
}

export default site
