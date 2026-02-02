import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, ShoppingCart, User as UserIcon } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import MobileMenu from './MobileMenu'

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const { totalItems } = useCart()
  const { user, logout } = useAuth()

  const toggleMobile = () => setMobileOpen((prev) => !prev)

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-slate-950/80 backdrop-blur border-b border-slate-800">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <button
          className="rounded-2xl border border-slate-800 p-2 text-slate-200 lg:hidden"
          onClick={toggleMobile}
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-slate-100">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 font-bold tracking-tight text-white shadow-lg">
            CK
          </span>
          <div className="hidden flex-col leading-none sm:flex">
            <span className="text-sm uppercase tracking-[0.3em] text-cyan-400">CodeKart</span>
            <span className="text-xs text-slate-400">Ready-made coding projects</span>
          </div>
        </Link>

        <div className="hidden flex-1 items-center gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 px-4 py-2 lg:flex">
          <input
            type="search"
            placeholder="Search projects, stacks, UI kits..."
            className="h-10 w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <button className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400">
            Search
          </button>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 lg:flex">
          <NavLink to="/products" className={({ isActive }) => (isActive ? 'text-cyan-400' : '')}>
            Products
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'text-cyan-400' : '')}>
            Dashboard
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => (isActive ? 'text-cyan-400' : '')}>
            My Orders
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/cart')}
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 text-slate-100 transition hover:border-cyan-400 hover:text-cyan-300"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-cyan-500 px-2 text-xs font-semibold text-slate-900">
                {totalItems}
              </span>
            )}
          </button>

          {user ? (
            <button
              onClick={logout}
              className="hidden rounded-2xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300 lg:inline-flex"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="hidden rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:from-cyan-300 hover:to-blue-400 lg:inline-flex"
            >
              Login / Signup
            </button>
          )}

          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 text-slate-100 transition hover:border-cyan-400 hover:text-cyan-300"
          >
            <UserIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={toggleMobile} />
    </header>
  )
}

export default Header
