import SectionHeading from '../ui/SectionHeading'

/**
 * Her bölümün ortak kabuğu: id, boşluklar, genişlik ve başlık.
 * Başlık metinleri config/sections.config.js dosyasından gelir.
 */
export default function Section({
  config = {},
  children,
  width = 'max-w-6xl',
  className = '',
  showHeading = true,
}) {
  return (
    <section id={config.key} className={`relative py-28 px-6 ${className}`}>
      <div className={`${width} mx-auto`}>
        {showHeading && (config.title || config.label) && (
          <SectionHeading
            label={config.label}
            title={config.title}
            subtitle={config.subtitle}
          />
        )}
        {children}
      </div>
    </section>
  )
}
