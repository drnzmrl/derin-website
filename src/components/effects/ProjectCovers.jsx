import Blueprint from './Blueprints'

/* ══════════════════════════════════════════════════════════════
   PROJE KAPAKLARI

   projects.js → cover.kind değerine göre seçilir.
   DetectionCover ve PhonesCover, Barış Alkan'ın portfolyosundaki
   kapaklardan Derin'in renklerine uyarlandı.
   ══════════════════════════════════════════════════════════════ */

/** Düz görsel */
function ImageCover({ cover, alt }) {
  return (
    <>
      <img
        src={cover.src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-right transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-space/70 via-transparent to-transparent" />
    </>
  )
}

/** Arka planı saydam 3B akış görseli, renkli kontur zemin üzerinde süzülür */
function CutoutCover({ cover, alt }) {
  return (
    <>
      <div className="absolute inset-0 bg-space" />
      {cover.backdrop && (
        <img
          src={cover.backdrop}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-right opacity-[0.22] grayscale contrast-150 scale-110"
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 45% 55%, rgb(var(--c-accent) / 0.16), transparent 70%), radial-gradient(ellipse 90% 60% at 50% 110%, rgb(var(--c-warm) / 0.18), transparent 60%), radial-gradient(ellipse 80% 85% at 50% 50%, transparent 40%, rgb(var(--c-space) / 0.8) 100%)',
        }}
      />
      <div className="absolute inset-0 cover-grid opacity-50" />
      <img
        src={cover.src}
        alt={alt}
        loading="lazy"
        className="cutout-float absolute inset-[8%] w-[84%] h-[84%] object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)] transition-transform duration-700 group-hover:scale-[1.05]"
      />
    </>
  )
}

/** YOLO hedef kutusu: beklerken TRACKING, kart üzerindeyken LOCKED */
function DetectionCover({ cover, alt }) {
  const { box } = cover
  const corner = 'absolute h-3 w-3 transition-colors duration-300 border-accent group-hover:border-warm'
  return (
    <>
      <img
        src={cover.src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover brightness-[0.8] saturate-[0.75] transition duration-700 group-hover:scale-[1.04] group-hover:brightness-95 group-hover:saturate-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-space/85 via-space/10 to-space/30" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
        <div
          className="absolute animate-pulse group-hover:animate-none"
          style={{ left: `${box.left}%`, top: `${box.top}%`, width: `${box.width}%`, height: `${box.height}%` }}
        >
          <span className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
          <span className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
          <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
          <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
          <span className="absolute left-0 top-full mt-1.5 whitespace-nowrap rounded-sm bg-accent/90 group-hover:bg-warm px-1.5 py-px font-mono text-[10px] font-semibold text-space transition-colors duration-300">
            <span className="group-hover:hidden">TRACKING · uav 0.91</span>
            <span className="hidden group-hover:inline">LOCKED · uav 0.97</span>
          </span>
        </div>
        <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 opacity-40">
          <span className="absolute left-1/2 top-0 h-full w-px bg-accent" />
          <span className="absolute left-0 top-1/2 h-px w-full bg-accent" />
        </div>
        <p className="absolute bottom-3 left-4 font-mono text-[10px] tracking-wider text-accent/70">
          CAM-01 · OBJECT DETECTION
        </p>
      </div>
      {cover.badge && (
        <span className="absolute bottom-3 right-3 z-10 rounded-lg bg-white/90 px-1.5 py-1 shadow-lg">
          <img src={cover.badge} alt="TEKNOFEST" className="h-6 w-auto" loading="lazy" />
        </span>
      )}
      {cover.credit && (
        <span className="absolute top-3 right-3 z-10 font-mono text-[9px] text-text/50">{cover.credit}</span>
      )}
    </>
  )
}

/** Üç telefon yelpaze gibi açılır; gerçek Play Store ekran görüntüleri */
function PhonesCover({ cover }) {
  const layout = [
    'z-0 -translate-x-2 translate-y-5 -rotate-[9deg] scale-[0.84] opacity-80 group-hover:-translate-x-5 group-hover:-rotate-[13deg]',
    'z-10 translate-y-2 group-hover:-translate-y-1',
    'z-0 translate-x-2 translate-y-5 rotate-[9deg] scale-[0.84] opacity-80 group-hover:translate-x-5 group-hover:rotate-[13deg]',
  ]
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(120% 90% at 20% 10%, rgb(var(--c-accent) / 0.22), transparent 55%), radial-gradient(90% 80% at 90% 100%, rgb(var(--c-warm) / 0.2), transparent 60%), rgb(var(--c-space) / 0.6)',
      }}
    >
      <div className="absolute inset-0 opacity-60 cover-grid" />
      <div className="absolute -bottom-10 left-1/2 h-40 w-3/4 -translate-x-1/2 rounded-full bg-warm/20 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 top-8 flex items-start justify-center">
        {cover.shots.map((src, i) => (
          <div
            key={src}
            className={`-mx-3 w-[27%] max-w-[150px] overflow-hidden rounded-[1.1rem] border-[3px] border-atmosphere bg-black shadow-[0_20px_40px_-12px_rgba(0,0,0,0.8)] transition-transform duration-700 sm:rounded-[1.4rem] ${layout[i]}`}
          >
            <img src={src} alt="" loading="lazy" className="block aspect-[9/16] w-full object-cover object-top" />
          </div>
        ))}
      </div>
      {cover.icon && (
        <img
          src={cover.icon}
          alt=""
          loading="lazy"
          className="absolute bottom-3 right-3 z-20 h-11 w-11 rounded-xl shadow-[0_10px_30px_-8px_rgb(var(--c-warm)/0.8)] ring-1 ring-white/20"
        />
      )}
    </div>
  )
}

function BlueprintCover({ cover }) {
  return <Blueprint name={cover.draw} className="absolute inset-0" />
}

const COVERS = {
  image: ImageCover,
  cutout: CutoutCover,
  detection: DetectionCover,
  phones: PhonesCover,
  blueprint: BlueprintCover,
}

export default function ProjectCover({ cover, alt = '' }) {
  const Cmp = COVERS[cover?.kind]
  if (!Cmp) return <Blueprint name="naca2412" className="absolute inset-0" />
  return <Cmp cover={cover} alt={alt} />
}
