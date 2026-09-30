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
    subtitle: 'Third-year aerospace engineering student. Most of my time goes into CFD and into checking it against real data.',
  },
  {
    key: 'flowlab',
    enabled: true,
    inNav: true,
    navLabel: 'Flow Lab',
    label: 'Interactive',
    title: 'Flow Lab',
    subtitle: 'Pick an airfoil, a Mach number and an angle of attack. The coefficients are the ones my ANSYS Fluent runs produced.',
  },
  {
    key: 'projects',
    enabled: true,
    inNav: true,
    navLabel: 'Work',
    label: 'Selected Work',
    title: 'Projects',
    subtitle: 'Simulations, a competition UAV and a couple of apps. Tap any card with images to open the full figures.',
  },
  {
    key: 'drawings',
    enabled: true,
    inNav: true,
    navLabel: 'Drawings',
    label: 'Geometry & Drawing',
    title: 'Drawings',
    subtitle: 'Computational domains, meshes and technical drawings.',
  },
  {
    key: 'publications',
    enabled: true,
    inNav: true,
    navLabel: 'Writing',
    label: 'Writing',
    title: 'Reports & Papers',
    subtitle: 'Technical reports, papers and articles.',
  },
  {
    key: 'skills',
    enabled: true,
    inNav: true,
    navLabel: 'Skills',
    label: 'Toolbox',
    title: 'Skills',
    subtitle: 'The software I simulate and build with, and the areas I work in.',
  },
  {
    key: 'beyond',
    enabled: true,
    inNav: true,
    navLabel: 'Beyond',
    label: 'Beyond the Lab',
    title: 'Beyond the Lab',
    subtitle: 'Things that shaped how I work with people.',
  },
  {
    key: 'resume',
    enabled: true,
    inNav: false,
    navLabel: 'Resume',
    label: 'Background',
    title: 'Resume',
    subtitle: 'One page, updated for this term.',
  },
  {
    key: 'contact',
    enabled: true,
    inNav: true,
    navLabel: 'Contact',
    label: 'Get in Touch',
    title: 'Contact',
    subtitle: 'Email or LinkedIn reaches me fastest.',
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
