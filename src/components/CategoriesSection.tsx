import { techCategories } from '../lib/constants'

const gradientPool = [
  'from-cyan-400 via-blue-500 to-purple-500',
  'from-fuchsia-500 via-purple-500 to-sky-500',
  'from-emerald-400 via-cyan-500 to-blue-500',
  'from-orange-400 via-pink-500 to-purple-500',
]

const CategoriesSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white md:text-3xl">Shop by tech stack</h2>
          <p className="mt-2 text-sm text-slate-400">
            Explore tailwind-ready dashboards, Next.js templates, eCommerce starters, and more.
          </p>
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {techCategories.map((category, index) => (
          <article
            key={category}
            className={`group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl transition hover:border-cyan-400/60`}
          >
            <div
              className={`absolute inset-0 -z-10 opacity-0 transition duration-500 group-hover:opacity-100 bg-gradient-to-br ${gradientPool[index % gradientPool.length]}`}
            />
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{category}</h3>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-500">12 builds</span>
            </div>
            <p className="mt-3 text-sm text-slate-300">
              High-quality {category} projects with docs, best practices, and deployment scripts.
            </p>
            <button className="mt-4 inline-flex items-center text-sm font-semibold text-cyan-300">
              Browse templates →
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CategoriesSection
