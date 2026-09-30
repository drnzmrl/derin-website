/**
 * Sonsuz kayan araç şeridi. Barış Alkan'ın portfolyosundaki
 * LogoLoop'tan (React Bits, MIT) fikir alındı; logolar yerine
 * sade yazı, ekstra paket yok. Üzerine gelince durur,
 * "hareketi azalt" açıksa düz liste olur (CSS'te).
 */
export default function ToolLoop({ items, speed = 38 }) {
  const row = (hidden) => (
    <ul className="tool-loop-row" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <li key={t} className="flex items-center gap-6">
          <span className="font-display text-lg md:text-xl font-medium text-text/75 whitespace-nowrap">{t}</span>
          <span className="text-warm/60" aria-hidden="true">✦</span>
        </li>
      ))}
    </ul>
  )
  return (
    <div className="tool-loop" style={{ '--loop-duration': `${speed}s` }}>
      <div className="tool-loop-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
