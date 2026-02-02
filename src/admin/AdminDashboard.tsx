import DashboardStats from '../components/DashboardStats'

const AdminDashboard = () => {
  const stats = [
    { title: 'Total sales', value: '$24,600', description: 'Gross revenue last 30 days' },
    { title: 'Orders', value: 186, description: 'Total order requests received' },
    { title: 'Conversion rate', value: '18%', description: 'Marketplace visits → Orders' },
    { title: 'Delivery SLA', value: '94%', description: 'Orders delivered within 24h' },
  ]

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-white md:text-3xl">Admin overview</h1>
        <p className="mt-2 text-sm text-slate-400">Monitor marketplace performance, manage products, and fulfill orders.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <DashboardStats key={stat.title} {...stat} />
        ))}
      </div>
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
        <h2 className="text-lg font-semibold text-white">Recent activity</h2>
        <ul className="mt-4 space-y-3">
          <li>• Alex M. purchased "React SaaS Kit" - awaiting delivery.</li>
          <li>• Admin added new category "AI Automation".</li>
          <li>• Monthly newsletter scheduled for January 20.</li>
        </ul>
      </div>
    </div>
  )
}

export default AdminDashboard
