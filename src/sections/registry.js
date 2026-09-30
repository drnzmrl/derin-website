/* ══════════════════════════════════════════════════════════════
   BÖLÜM KAYIT DEFTERİ

   Anahtar → bileşen eşlemesi. sections.config.js içindeki
   her 'key' değerinin burada bir karşılığı olmalı.

   Yeni bölüm eklerken: import et + listeye bir satır ekle.
   ══════════════════════════════════════════════════════════════ */

import Hero from './Hero'
import About from './About'
import FlowLab from './FlowLab'
import Projects from './Projects'
import Drawings from './Drawings'
import Publications from './Publications'
import Skills from './Skills'
import Beyond from './Beyond'
import Resume from './Resume'
import Contact from './Contact'

export const registry = {
  hero: Hero,
  about: About,
  flowlab: FlowLab,
  projects: Projects,
  drawings: Drawings,
  publications: Publications,
  skills: Skills,
  beyond: Beyond,
  resume: Resume,
  contact: Contact,
}

export default registry
