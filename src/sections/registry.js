/* ══════════════════════════════════════════════════════════════
   BÖLÜM KAYIT DEFTERİ

   Anahtar → bileşen eşlemesi. sections.config.js içindeki
   her 'key' değerinin burada bir karşılığı olmalı.

   Yeni bölüm eklerken: import et + listeye bir satır ekle.
   ══════════════════════════════════════════════════════════════ */

import Hero from './Hero'
import About from './About'
import Projects from './Projects'
import Drawings from './Drawings'
import Publications from './Publications'
import Skills from './Skills'
import Resume from './Resume'
import Contact from './Contact'

export const registry = {
  hero: Hero,
  about: About,
  projects: Projects,
  drawings: Drawings,
  publications: Publications,
  skills: Skills,
  resume: Resume,
  contact: Contact,
}

export default registry
