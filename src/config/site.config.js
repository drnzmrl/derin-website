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
  role: 'Aerospace Engineering · METU Northern Cyprus Campus',   // hero'daki üst etiket
  roleShort: 'Aerospace Engineering · METU NCC',                // telefonda
  university: 'B.Sc. Aerospace Engineering, Middle East Technical University, Northern Cyprus Campus',
  location: 'Türkiye · Northern Cyprus',
  availability: 'Open to internships and research projects',

  /* Hero cümlesi: sabit başlangıç + sırayla değişen ifadeler.
     Hareket azaltılmışsa taglineStill gösterilir. */
  tagline: {
    lead: 'I simulate',
    rotate: [
      'shock waves at Mach 1.5.',
      'wing-tip vortices.',
      'the wake behind a car body.',
      'lift, then check it against NASA data.',
    ],
    still: 'I simulate shock waves, wing-tip vortices and wakes, then check them against experiment.',
  },

  /* Hero'daki durum etiketi. Tıklanınca İletişim'e kaydırır.
     Gizlemek için: status: null */
  status: { label: 'Available', text: 'Internships & research projects' },

  /* Hero'nun altındaki bilgi şeridi (monospace). */
  telemetry: ['3rd year', 'ANSYS Fluent · COMSOL', '30 m/s to Mach 1.5', 'TEKNOFEST Fighter UAV'],

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
