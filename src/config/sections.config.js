/* ══════════════════════════════════════════════════════════════
   BÖLÜM AYARLARI — sitenin sırası ve içeriği

   ▸ Bölümü GİZLE      : enabled: false
   ▸ Bölümü TAŞI       : satırı listede yukarı/aşağı sürükle
   ▸ Bölümü MENÜDEN ÇIKAR : inNav: false  (bölüm sayfada kalır)
   ▸ Bölümü SİL        : satırı komple sil
   ▸ YENİ bölüm ekle   : aşağıdaki "YENİ BÖLÜM EKLEME" notuna bak

   Başlık/alt başlık metinleri de burada — bileşen dosyalarını
   açmana gerek yok.
   ══════════════════════════════════════════════════════════════ */

export const sections = [
  {
    key: 'hero',           // sections/registry.js içindeki bileşen anahtarı
    enabled: true,
    inNav: false,          // hero menüde görünmez (logo zaten oraya götürür)
    navLabel: 'Home',
  },
  {
    key: 'about',
    enabled: true,
    inNav: true,
    navLabel: 'About',
    label: 'Who I Am',
    title: 'About',
    subtitle: 'Aerospace engineering student with a focus on aerodynamics, propulsion and spacecraft structures.',
  },
  {
    key: 'projects',
    enabled: true,
    inNav: true,
    navLabel: 'Projects',
    label: 'Selected Work',
    title: 'Projects',
    subtitle: 'Simulation, analysis and design work across aerodynamics, propulsion and flight mechanics.',
  },
  {
    key: 'drawings',
    enabled: true,
    inNav: true,
    navLabel: 'Drawings',
    label: 'Technical Drawing',
    title: 'Drawings',
    subtitle: 'CAD models and engineering drawings produced in SolidWorks, CATIA and AutoCAD.',
  },
  {
    key: 'publications',
    enabled: true,
    inNav: true,
    navLabel: 'Publications',
    label: 'Writing',
    title: 'Publications',
    subtitle: 'Research papers, technical reports and articles.',
  },
  {
    key: 'skills',
    enabled: true,
    inNav: true,
    navLabel: 'Skills',
    label: 'Toolbox',
    title: 'Skills',
    subtitle: 'Engineering domains, simulation software and programming tools.',
  },
  {
    key: 'resume',
    enabled: true,
    inNav: false,
    navLabel: 'Resume',
    label: 'Background',
    title: 'Resume',
    subtitle: 'Education, experience and achievements.',
  },
  {
    key: 'contact',
    enabled: true,
    inNav: true,
    navLabel: 'Contact',
    label: 'Get in Touch',
    title: 'Contact',
    subtitle: 'Open to research collaborations, internships, and new opportunities.',
  },
]

/* ──────────────────────────────────────────────────────────────
   YENİ BÖLÜM EKLEME — 3 adım

   1) Bileşeni yaz:  src/sections/Awards.jsx
        import Section from '../components/layout/Section'
        export default function Awards({ config }) {
          return (
            <Section config={config}>
              ...içerik...
            </Section>
          )
        }

   2) Kaydet:  src/sections/registry.js dosyasına ekle
        import Awards from './Awards'
        export const registry = { ..., awards: Awards }

   3) Buraya bir satır ekle:
        { key: 'awards', enabled: true, inNav: true, navLabel: 'Awards',
          label: 'Recognition', title: 'Awards', subtitle: '...' }

   Sıra bu listedeki sıradır — nereye koyarsan orada görünür.
   ────────────────────────────────────────────────────────────── */

/** Sadece açık olan bölümler, listedeki sırayla. */
export const enabledSections = () => sections.filter((s) => s.enabled !== false)

/** Menüde görünecek bölümler. */
export const navSections = () =>
  enabledSections().filter((s) => s.inNav !== false)

/** Bir bölümün ayarını anahtarıyla getirir. */
export const sectionConfig = (key) =>
  sections.find((s) => s.key === key) || { key }

export default sections
