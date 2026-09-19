import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Linkedin, Github, Mail, BookMarked } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'

const socialLinks = [
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/derin', color: 'hover:text-blue-400' },
  { icon: Github, label: 'GitHub', href: 'https://github.com/derin', color: 'hover:text-text' },
  { icon: Mail, label: 'Email', href: 'mailto:derin@email.com', color: 'hover:text-accent' },
  { icon: BookMarked, label: 'ResearchGate', href: 'https://researchgate.net/profile/derin', color: 'hover:text-emerald-400' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Compose a mailto link as a simple, no-backend contact method
    const subject = encodeURIComponent(`Portfolio message from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`)
    window.location.href = `mailto:derin@email.com?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  return (
    <section id="contact" className="py-28 px-6 bg-surface/30">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          label="Get in Touch"
          title="Contact"
          subtitle="Open to research collaborations, internships, and new opportunities."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: form */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {submitted ? (
              <div className="h-full flex flex-col items-start justify-center gap-4 py-8">
                <div className="w-12 h-12 rounded-xl bg-accent-dim border border-accent/30 flex items-center justify-center">
                  <Send size={20} className="text-accent" />
                </div>
                <h3 className="font-display text-xl font-semibold text-text">Message sent!</h3>
                <p className="text-text-dim text-sm">
                  Your email client should have opened. If not,{' '}
                  <a href="mailto:derin@email.com" className="text-accent hover:underline">
                    write directly
                  </a>
                  .
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sm font-medium text-muted hover:text-text transition-colors"
                >
                  ← Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-xs text-muted mb-1.5 tracking-wider uppercase">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text text-sm placeholder-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-muted mb-1.5 tracking-wider uppercase">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text text-sm placeholder-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-muted mb-1.5 tracking-wider uppercase">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Your message..."
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text text-sm placeholder-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all duration-200 resize-none"
                  />
                </div>
                <motion.button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-background rounded-xl font-display font-semibold text-sm tracking-wide hover:bg-accent/90 transition-all duration-200 shadow-lg shadow-accent/20"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Send size={15} />
                  Send Message
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Right: social links + info */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center gap-8"
          >
            <div>
              <p className="font-mono text-xs text-muted tracking-widest uppercase mb-4">Find me on</p>
              <div className="space-y-3">
                {socialLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 text-text-dim ${link.color} transition-all duration-200 group`}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                  >
                    <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center group-hover:border-accent/30 transition-colors duration-200">
                      <link.icon size={15} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{link.label}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-5">
              <p className="font-mono text-xs text-muted tracking-widest uppercase mb-3">Location</p>
              <p className="text-text font-display font-medium">Turkey 🇹🇷</p>
              <p className="text-text-dim text-sm mt-1">Available for remote positions worldwide</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
