import { icons } from './icons'

/**
 * Ayar dosyalarında ikonlar metin olarak yazılır ('Rocket', 'Mail').
 * Bu bileşen o metni gerçek ikona çevirir.
 *
 * Kullanılabilecek isimler: src/components/ui/icons.js
 * (yeni ikon eklemek de orada anlatılıyor)
 */
export default function Icon({ name, fallback = 'Circle', ...props }) {
  const Cmp = icons[name] || icons[fallback]

  if (!Cmp) return null

  if (!icons[name] && import.meta.env.DEV && name) {
    console.warn(
      `[Icon] "${name}" kayitli degil. ` +
        `src/components/ui/icons.js dosyasina ekle.`
    )
  }

  return <Cmp {...props} />
}
