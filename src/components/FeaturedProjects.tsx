import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { formatCurrency } from '../lib/utils'

interface Props {
  projects: Product[]
}

const FeaturedProjects = ({ projects }: Props) => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white md:text-3xl">Featured marketplace picks</h2>
          <p className="mt-2 text-sm text-slate-400">Curated bestsellers updated weekly by the CodeKart team</p>
        </div>
        <Link to="/products" className="hidden rounded-2xl border border-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300 md:inline-flex">
          View all
        </Link>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project._id}
            to={`/products/${project._id}`}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl transition hover:border-cyan-500/40 hover:shadow-cyan-500/20"
          >
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                {project.difficulty}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <h3 className="text-lg font-semibold text-white">{project.title}</h3>
              <p className="line-clamp-2 text-sm text-slate-400">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.techStack.slice(0, 3).map((tech) => (
                  <span key={tech} className="rounded-full border border-slate-800 px-3 py-1 text-xs text-cyan-300">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-cyan-400">{formatCurrency(project.price)}</p>
                <span className="text-xs uppercase tracking-[0.3em] text-slate-500">CodeKart</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default FeaturedProjects
