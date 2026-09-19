import { lazy, Suspense } from 'react'
import { site } from './config/site.config'
import { theme } from './config/theme.config'
import { enabledSections } from './config/sections.config'
import registry from './sections/registry'

import Starfield from './components/canvas/Starfield'
import HorizonGlow from './components/canvas/HorizonGlow'
import CursorCraft from './components/canvas/CursorCraft'
import ScrollProgress from './components/ui/ScrollProgress'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

/* three.js ve kataloglar ayrı parça olarak yüklensin —
   ilk açılış hızı etkilenmesin. */
const SpaceScene = lazy(() => import('./components/space/SpaceScene'))

export default function App() {
  const list = enabledSections()
  const space3d = theme.space?.enabled

  return (
    /* .sky = tüm belge boyunca uzanan gökyüzü gradyanı
       (şafak → uzay). Ayarı theme.config.js → sky */
    <div className="sky relative min-h-screen text-text">
      {space3d ? (
        <Suspense fallback={null}>
          <SpaceScene />
        </Suspense>
      ) : (
        <Starfield />
      )}
      <HorizonGlow />
      <CursorCraft />
      {site.features.scrollProgress && <ScrollProgress />}
      <Navbar />

      <main className="relative z-10">
        {list.map((cfg) => {
          const Cmp = registry[cfg.key]
          if (!Cmp) {
            // Ayar dosyasında var ama registry.js'te karşılığı yok
            if (import.meta.env.DEV) {
              console.warn(
                `[sections] "${cfg.key}" bileşeni bulunamadı. ` +
                  `src/sections/registry.js dosyasına eklemeyi unutma.`
              )
            }
            return null
          }
          return <Cmp key={cfg.key} config={cfg} />
        })}
      </main>

      <Footer />
    </div>
  )
}
