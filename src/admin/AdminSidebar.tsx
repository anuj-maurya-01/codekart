import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag } from 'lucide-react'

const links = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
]

const AdminSidebar = () => {
  return (
    <aside className="flex gap-4 overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/60 p-4 lg:flex-col lg:p-6">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              isActive ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:bg-slate-900'
            }`
          }
        >
          <Icon className="h-5 w-5" />
          {label}
        </NavLink>
      ))}
    </aside>
  )
}

export default AdminSidebar
