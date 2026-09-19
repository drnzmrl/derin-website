import { useState } from 'react'
import { motion } from 'framer-motion'
import Section from '../components/layout/Section'
import Icon from '../components/ui/Icon'
import { Magnetic } from '../components/motion'
import { site } from '../config/site.config'
import { theme } from '../config/theme.config'
import { dur } from '../config/applyTheme'

const ease = theme.motion.ease

export default function Contact({ config }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    // Sunucu yok: mesajı kullanıcının kendi e-posta istemcisinde açar
    const subject = encodeURIComponent(`Portfolio message from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`)
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <Section config={config} width="max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: dur(0.7), ease }}
        >
          {sent ? (
            <div className="h-full flex flex-col items-start justify-center gap-4 py-8">
              <div className="w-12 h-12 rounded-card bg-warm/10 border border-warm/30 flex items-center justify-center">
                <Icon name="Send" size={20} className="text-warm" />
              </div>
              <h3 className="font-display text-xl font-semibold text-text">
                Message sent!
              </h3>
              <p className="text-text-dim text-sm">
                Your email client should have opened. If not,{' '}
                <a href={`mailto:${site.email}`} className="text-accent hover:underline">
                  write directly
                </a>
                .
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-sm font-medium text-muted hover:text-text transition-colors"
              >
                ← Send another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label htmlFor="c-name" className="block eyebrow mb-1.5">
                  Name
                </label>
                <input
                  id="c-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={change}
                  required
                  placeholder="Your name"
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="c-email" className="block eyebrow mb-1.5">
                  Email
                </label>
                <input
                  id="c-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={change}
                  required
                  placeholder="your@email.com"
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="c-msg" className="block eyebrow mb-1.5">
                  Message
                </label>
                <textarea
                  id="c-msg"
                  name="message"
                  value={form.message}
                  onChange={change}
                  required
                  rows={5}
                  placeholder="Your message..."
                  className="field resize-none"
                />
              </div>
              <motion.button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-space rounded-soft font-display font-semibold text-sm tracking-wide hover:bg-accent/90 transition-all duration-300 glow-soft"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Icon name="Send" size={15} />
                Send Message
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Bağlantılar */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: dur(0.7), ease }}
          className="flex flex-col justify-center gap-8"
        >
          <div>
            <p className="eyebrow mb-4">Find me on</p>
            <div className="space-y-3">
              {site.socials.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: dur(i * 0.08), duration: dur(0.4) }}
                >
                  <Magnetic strength={0.18} range={90}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-text-dim hover:text-warm transition-colors duration-300 group"
                    >
                      <span className="w-9 h-9 rounded-soft border border-text/10 flex items-center justify-center group-hover:border-warm/40 transition-colors duration-300">
                        <Icon name={link.icon} size={15} />
                      </span>
                      <span className="text-sm font-medium">{link.label}</span>
                    </a>
                  </Magnetic>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="panel p-5">
            <p className="eyebrow mb-3">Location</p>
            <p className="text-text font-display font-medium">{site.location}</p>
            <p className="text-text-dim text-sm mt-1">{site.availability}</p>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
