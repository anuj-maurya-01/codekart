import DashboardStats from '../components/DashboardStats'

const UserDashboard = () => {
  const stats = [
    { title: 'Downloads', value: 12, description: 'Projects you have purchased' },
    { title: 'Wishlist', value: 5, description: 'Templates saved for later' },
    { title: 'Credits', value: 45, description: 'Reward credits available for next order' },
  ]

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-white md:text-3xl">Welcome back to CodeKart</h1>
        <p className="mt-2 text-sm text-slate-400">Track downloads, manage your orders, and discover new drops.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <DashboardStats key={stat.title} {...stat} />
        ))}
      </div>
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
        <h2 className="text-lg font-semibold text-white">Latest updates</h2>
        <ul className="mt-4 space-y-3">
          <li>• New AI automation bundle dropped this week.</li>
          <li>• Premium members now get early access to marketplace drops.</li>
          <li>• Refer a friend and earn 30 credits towards your next order.</li>
        </ul>
      </div>
    </div>
  )
}

export default UserDashboard
