/* ══════════════════════════════════════════════════════════════
   İKON KAYIT DEFTERİ

   Ayar dosyalarında ikonlar metin olarak yazılıyor ('Rocket').
   Burada hangi ikonların pakete gireceğini belirliyoruz.

   ⚠ Tümünü birden (`import * as Lucide`) almak paketi ~800 KB
     şişiriyordu — o yüzden tek tek alıyoruz.

   YENİ İKON EKLEME:
     1) https://lucide.dev/icons adresinden adını bul (PascalCase)
     2) Aşağıdaki import listesine ekle
     3) icons nesnesine ekle
     4) Artık her ayar dosyasında o adı kullanabilirsin
   ══════════════════════════════════════════════════════════════ */

import {
  // Genel
  ArrowDown,
  ArrowUpRight,
  ChevronRight,
  Circle,
  Download,
  ExternalLink,
  Eye,
  Maximize2,
  Menu,
  Send,
  Wrench,
  X,
  // Sosyal / iletişim
  BookMarked,
  Github,
  Linkedin,
  Mail,
  // Yayın türleri
  BookOpen,
  FileText,
  Newspaper,
  // Yetenek grupları
  Code2,
  Globe,
  Monitor,
  // Havacılık / uzay kategorileri
  Cpu,
  Flame,
  FlaskConical,
  Navigation,
  Orbit,
  PenTool,
  Plane,
  Rocket,
  Satellite,
  Thermometer,
  Wind,
  Zap,
} from 'lucide-react'

export const icons = {
  ArrowDown,
  ArrowUpRight,
  ChevronRight,
  Circle,
  Download,
  ExternalLink,
  Eye,
  Maximize2,
  Menu,
  Send,
  Wrench,
  X,
  BookMarked,
  Github,
  Linkedin,
  Mail,
  BookOpen,
  FileText,
  Newspaper,
  Code2,
  Globe,
  Monitor,
  Cpu,
  Flame,
  FlaskConical,
  Navigation,
  Orbit,
  PenTool,
  Plane,
  Rocket,
  Satellite,
  Thermometer,
  Wind,
  Zap,
}

export default icons
