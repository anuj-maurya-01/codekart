import { Facebook, Github, Linkedin, Twitter } from 'lucide-react'
import { siteLinks } from '../lib/constants'

const socialLinks = [
  { icon: Github, href: 'https://github.com' },
  { icon: Linkedin, href: 'https://linkedin.com' },
  { icon: Twitter, href: 'https://twitter.com' },
  { icon: Facebook, href: 'https://facebook.com' },
]

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16">
        <div className="grid gap-10 md:grid-cols-[2fr,1fr,1fr,1fr]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 text-lg font-bold text-white shadow-lg">
                CK
              </span>
              <div>
                <p className="font-semibold tracking-[0.3em] text-cyan-400">CodeKart</p>
                <p className="text-sm text-slate-400">Ready-made coding projects for developers</p>
              </div>
            </div>
            <p className="max-w-sm text-sm text-slate-400">
              Discover production-ready templates, micro-SaaS starters, and advanced UI kits built to help
              learners, freelancers, and teams ship faster.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 text-slate-400 transition hover:border-cyan-400 hover:text-cyan-300"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(siteLinks).map(([title, links]) => (
            <div key={title}>
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">{title}</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="transition hover:text-cyan-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} CodeKart. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="transition hover:text-cyan-300">
              Terms
            </a>
            <a href="#" className="transition hover:text-cyan-300">
              Privacy
            </a>
            <a href="#" className="transition hover:text-cyan-300">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
