import type { ChangeEvent } from 'react'
import { difficultyOptions, techCategories } from '../lib/constants'

interface Props {
  values: {
    search: string
    tech: string
    difficulty: string
    sort: string
  }
  onChange: (values: Partial<Props['values']>) => void
}

const FiltersBar = ({ values, onChange }: Props) => {
  const handleInput = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    onChange({ [name]: value })
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-4">
        <input
          type="search"
          name="search"
          value={values.search}
          onChange={handleInput}
          placeholder="Search projects"
          className="h-12 w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          name="tech"
          value={values.tech}
          onChange={handleInput}
          className="h-12 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 text-sm text-slate-100"
        >
          <option value="">All tech</option>
          {techCategories.map((tech) => (
            <option key={tech} value={tech}>
              {tech}
            </option>
          ))}
        </select>
        <select
          name="difficulty"
          value={values.difficulty}
          onChange={handleInput}
          className="h-12 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 text-sm text-slate-100"
        >
          <option value="">All difficulty</option>
          {difficultyOptions.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty}
            </option>
          ))}
        </select>
        <select
          name="sort"
          value={values.sort}
          onChange={handleInput}
          className="h-12 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 text-sm text-slate-100"
        >
          <option value="">Sort</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>
  )
}

export default FiltersBar
