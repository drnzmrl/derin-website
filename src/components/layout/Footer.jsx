import { site } from '../../config/site.config'
import Icon from '../ui/Icon'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-text/10 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
        <p className="font-display font-semibold text-text">
          {site.initial}
          <span className="text-warm">.</span>
        </p>

        <div className="flex items-center gap-3">
          {site.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-9 h-9 rounded-full border border-text/10 flex items-center justify-center text-text-dim hover:text-warm hover:border-warm/40 transition-all duration-300"
            >
              <Icon name={s.icon} size={15} />
            </a>
          ))}
        </div>

        <div className="text-center md:text-right">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {site.fullName || site.name} · {site.footer.note}
          </p>
          {site.footer.showCredit && (
            <p className="text-xs text-muted/70 mt-1">{site.footer.credit}</p>
          )}
          {/* CC BY-SA 4.0 atfı — gök verisi gerçek kataloglardan geliyor */}
          <p className="text-[11px] text-muted/60 mt-1">
            Sky data:{' '}
            <a
              href="https://codeberg.org/astronexus/hyg"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-dim underline underline-offset-2"
            >
              HYG
            </a>{' '}
            &{' '}
            <a
              href="https://github.com/mattiaverga/OpenNGC"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-dim underline underline-offset-2"
            >
              OpenNGC
            </a>{' '}
            (CC BY-SA 4.0) · Planet textures:{' '}
            <a
              href="https://www.solarsystemscope.com/textures/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-dim underline underline-offset-2"
            >
              Solar System Scope
            </a>{' '}
            (CC BY 4.0)
          </p>
          <p className="text-[11px] text-muted/60 mt-1">
            CFD figures: my ANSYS Fluent runs · UAV photo:{' '}
            <a
              href="https://unsplash.com/photos/gE6YqIS5ii0"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-dim underline underline-offset-2"
            >
              Unsplash
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
