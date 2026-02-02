import { howItWorks } from '../lib/constants'

const HowItWorks = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Process</p>
        <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">Ship production-grade projects in hours</h2>
        <p className="mt-3 text-sm text-slate-400">
          Choose your stack, place an order, and receive a custom-fit download link once the CodeKart team confirms delivery.
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {howItWorks.map((step, index) => (
          <article key={step.title} className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
            <span className="text-5xl font-bold text-slate-800">{index + 1}</span>
            <h3 className="mt-6 text-lg font-semibold text-white">{step.title}</h3>
            <p className="mt-3 text-sm text-slate-300">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks
