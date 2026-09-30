import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Section from '../components/layout/Section'
import Icon from '../components/ui/Icon'
import QrModal, { QrPanel } from '../components/ui/QrModal'
import { site } from '../config/site.config'
import { theme } from '../config/theme.config'
import { dur, motionOff } from '../config/applyTheme'
import { canShare, copyText, downloadVCard, sharePage } from '../lib/contact'

const ease = theme.motion.ease

/** Harf harf yazılan başlık (Barış Alkan'ın portfolyosundan uyarlandı) */
function TypeTitle({ text }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [shown, setShown] = useState(motionOff() ? text : '')

  useEffect(() => {
    if (!inView || motionOff()) return
    let i = 0
    const id = setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, 50)
    return () => clearInterval(id)
  }, [inView, text])

  return (
    <h3 ref={ref} className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-text min-h-[1.2em]" aria-label={text}>
      <span aria-hidden="true">{shown}</span>
      <motion.span
        aria-hidden="true"
        className="text-warm"
        animate={motionOff() ? undefined : { opacity: [0, 1, 0] }}
        transition={{ duration: 0.9, repeat: Infinity }}
      >
        |
      </motion.span>
    </h3>
  )
}

function Row({ icon, label, value, href, onClick, download, children }) {
  const external = href?.startsWith('http') || href?.endsWith('.pdf')
  const Cmp = href ? 'a' : 'button'
  return (
    <div className="flex items-center gap-2 rounded-card border border-text/10 bg-space/30 pr-2 transition-colors hover:border-accent/35">
      <Cmp
        href={href}
        onClick={onClick}
        {...(download ? { download } : {})}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-soft border border-accent/20 bg-accent/10 text-accent">
          <Icon name={icon} size={16} />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium text-text">{label}</span>
          <span className="block truncate font-mono text-[11px] text-muted">{value}</span>
        </span>
      </Cmp>
      {children}
    </div>
  )
}

function CopyButton({ value }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    const ok = await copyText(value)
    if (!ok) {
      window.location.href = `mailto:${value}`
      return
    }
    setDone(true)
    setTimeout(() => setDone(false), 1800)
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-soft text-muted transition hover:bg-text/5 hover:text-text"
      aria-label={done ? 'Email copied' : 'Copy email address'}
    >
      <Icon name={done ? 'Check' : 'Copy'} size={15} className={done ? 'text-emerald-300' : ''} />
    </button>
  )
}

export default function Contact({ config }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [qr, setQr] = useState(false)
  const [share, setShare] = useState(false)
  useEffect(() => setShare(canShare()), [])

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    // Sunucu yok: mesajı ziyaretçinin kendi e-posta uygulamasında açar
    const subject = encodeURIComponent(`Message from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n${form.name}\n${form.email}`)
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  const linkedin = site.socials.find((s) => s.label === 'LinkedIn')
  const github = site.socials.find((s) => s.label === 'GitHub')

  return (
    <Section config={config} width="max-w-5xl">
      <motion.div
        className="relative overflow-hidden rounded-3xl border border-text/10 bg-gradient-to-b from-atmosphere/60 to-space/50 p-6 sm:p-10 backdrop-blur-md"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: dur(0.7), ease }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-warm/10 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <TypeTitle text="Let's talk aerodynamics." />
            <p className="mt-4 max-w-xl leading-relaxed text-text-dim">
              I'm looking for internships and research projects in aerodynamics, CFD and space systems. If you work on
              any of these, I would love to hear what your team is building.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Row icon="Mail" label="Email" value={site.email} href={`mailto:${site.email}`}>
                <CopyButton value={site.email} />
              </Row>
              {linkedin && <Row icon="Linkedin" label="LinkedIn" value={linkedin.handle} href={linkedin.href} />}
              {site.files.cv && <Row icon="FileText" label="CV" value="PDF, one page" href={site.files.cv} />}
              <Row icon="UserPlus" label="Save contact" value="Add me to your phone" onClick={downloadVCard} />
              {github && <Row icon="Github" label="GitHub" value={github.handle} href={github.href} />}
              {site.features.qr && (
                <Row icon="QrCode" label="QR code" value="Open this page on another phone" onClick={() => setQr(true)} />
              )}
            </div>

            {share && (
              <button
                type="button"
                onClick={sharePage}
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-full border border-text/15 bg-text/[0.04] px-5 text-sm font-medium text-text transition hover:bg-text/[0.08] lg:hidden"
              >
                <Icon name="Share2" size={15} />
                Share this page
              </button>
            )}
          </div>

          {site.features.qr && (
            <div className="hidden lg:block">
              <QrPanel />
            </div>
          )}
        </div>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
        <motion.div
          className="panel p-6"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: dur(0.7), ease }}
        >
          {sent ? (
            <div className="h-full flex flex-col items-start justify-center gap-4 py-6">
              <div className="w-12 h-12 rounded-card bg-warm/10 border border-warm/30 flex items-center justify-center">
                <Icon name="Send" size={20} className="text-warm" />
              </div>
              <h3 className="font-display text-xl font-semibold text-text">Opening your email app…</h3>
              <p className="text-text-dim text-sm">
                Your message is ready to send there. If nothing opened,{' '}
                <a href={`mailto:${site.email}`} className="text-accent hover:underline">
                  write to me directly
                </a>
                .
              </p>
              <button onClick={() => setSent(false)} className="text-sm font-medium text-muted hover:text-text transition-colors">
                Write another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <p className="eyebrow">Or write here</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="block text-xs text-muted mb-1.5">Name</label>
                  <input id="c-name" type="text" name="name" value={form.name} onChange={change} required placeholder="Your name" className="field" />
                </div>
                <div>
                  <label htmlFor="c-email" className="block text-xs text-muted mb-1.5">Email</label>
                  <input id="c-email" type="email" name="email" value={form.email} onChange={change} required placeholder="you@company.com" className="field" />
                </div>
              </div>
              <div>
                <label htmlFor="c-msg" className="block text-xs text-muted mb-1.5">Message</label>
                <textarea id="c-msg" name="message" value={form.message} onChange={change} required rows={4} placeholder="Hi Derin, …" className="field resize-none" />
              </div>
              <motion.button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-space rounded-soft font-display font-semibold text-sm tracking-wide hover:bg-accent/90 transition-all duration-300 glow-soft"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Icon name="Send" size={15} />
                Send message
              </motion.button>
            </form>
          )}
        </motion.div>

        <motion.div
          className="panel p-6 flex flex-col justify-center"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: dur(0.7), ease }}
        >
          <p className="eyebrow mb-3">Location</p>
          <p className="text-text font-display font-medium flex items-center gap-2">
            <Icon name="MapPin" size={15} className="text-warm" />
            {site.location}
          </p>
          <p className="text-text-dim text-sm mt-2">{site.availability}.</p>
        </motion.div>
      </div>

      <QrModal open={qr} onClose={() => setQr(false)} />
    </Section>
  )
}
