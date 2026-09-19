export default function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-display font-semibold text-text">
          D<span className="text-accent">.</span>
        </p>
        <p className="font-mono text-xs text-muted text-center">
          © {new Date().getFullYear()} Derin — Aerospace Engineering Portfolio
        </p>
        <p className="font-mono text-xs text-muted">
          Built with React + Framer Motion
        </p>
      </div>
    </footer>
  )
}
