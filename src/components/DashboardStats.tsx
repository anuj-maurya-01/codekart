interface StatCardProps {
  title: string
  value: string | number
  description: string
}

const DashboardStats = ({ title, value, description }: StatCardProps) => {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{title}</p>
      <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-3 text-sm text-slate-400">{description}</p>
    </article>
  )
}

export default DashboardStats
