import { sellingPoints } from '../lib/constants'

const WhyChooseUs = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid gap-10 lg:grid-cols-[1.3fr,1fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Why developers trust us</p>
          <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
            Ready-to-run codebases with developer documentation
          </h2>
          <p className="mt-4 text-sm text-slate-400">
            CodeKart delivers polished UI kits, full-stack templates, and automation scripts crafted by senior engineers. Every purchase includes a readme, setup scripts, and lifetime updates.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-6 text-sm text-slate-300">
          <h3 className="text-lg font-semibold text-white">Premium member perks</h3>
          <ul className="mt-4 space-y-3">
            <li>• Unlimited downloads on select categories</li>
            <li>• Priority delivery and SLA-backed support</li>
            <li>• Monthly drop of exclusive templates</li>
            <li>• Dedicated account manager for teams</li>
          </ul>
          <button className="mt-6 inline-flex items-center rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400">
            Join premium →
          </button>
        </div>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sellingPoints.map((point) => (
          <article key={point.title} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white">{point.title}</h3>
            <p className="mt-3 text-sm text-slate-300">{point.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default WhyChooseUs
