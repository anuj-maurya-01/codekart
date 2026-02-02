import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const floatingRects = Array.from({ length: 8 }).map((_, index) => ({
  id: index,
  delay: index * 0.2,
  left: `${10 + index * 10}%`,
  top: `${20 + (index % 3) * 15}%`,
}))

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 lg:flex-row lg:items-center lg:py-20">
        <div className="max-w-2xl space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400" /> New drop: SaaS starters
          </p>
          <h1 className="text-3xl font-bold leading-tight text-white md:text-5xl">
            Buy ready-made coding projects & ship faster with <span className="text-cyan-400">CodeKart</span>
          </h1>
          <p className="text-base text-slate-300 md:text-lg">
            Curated React, Node, and full-stack templates crafted for students, freelancers, and startups. Customize, deploy, and impress—without reinventing the wheel.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:scale-105 hover:from-cyan-300 hover:to-purple-400"
            >
              Browse marketplace
            </Link>
            <Link
              to="/products?sort=price-desc"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              View premium builds
            </Link>
          </div>
          <dl className="grid grid-cols-2 gap-4 text-slate-200 sm:grid-cols-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-4 text-center">
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Projects</dt>
              <dd className="text-2xl font-semibold text-cyan-400">120+</dd>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-4 text-center">
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Stacks</dt>
              <dd className="text-2xl font-semibold text-cyan-400">25</dd>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-4 text-center">
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Customers</dt>
              <dd className="text-2xl font-semibold text-cyan-400">9.5k</dd>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-4 text-center">
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Delivery</dt>
              <dd className="text-2xl font-semibold text-cyan-400">Instant</dd>
            </div>
          </dl>
        </div>

        <div className="relative flex-1">
          <div className="relative mx-auto aspect-square w-full max-w-md rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-2xl">
            <div className="grid h-full place-items-center rounded-2xl border border-slate-800 bg-slate-950/80">
              <div className="space-y-3 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Code preview</p>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-left shadow-inner">
                  <pre className="text-xs text-cyan-300">
                    {`const deploy = async () => {
  const project = await import('codekart/project')
  return project.launch()
}`}
                  </pre>
                </div>
              </div>
            </div>
            {floatingRects.map((rect) => (
              <motion.span
                key={rect.id}
                className="absolute h-14 w-14 rounded-2xl border border-cyan-500/30 bg-slate-950/80"
                style={{ left: rect.left, top: rect.top }}
                animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 6, delay: rect.delay }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
