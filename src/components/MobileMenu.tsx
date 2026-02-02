import { Link, NavLink } from 'react-router-dom'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
}

const MobileMenu = ({ open, onClose }: Props) => {
  return (
    <div
      className={`fixed inset-0 z-50 transform bg-slate-950/95 transition duration-300 lg:hidden ${
        open ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
          <Link to="/" className="text-lg font-semibold text-cyan-400" onClick={onClose}>
            CodeKart
          </Link>
          <button onClick={onClose} className="rounded-xl border border-slate-800 p-2 text-slate-300">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-2 px-4 py-6 text-lg font-semibold text-slate-200">
          <NavLink to="/products" onClick={onClose} className="rounded-2xl px-4 py-3 text-slate-300 hover:bg-slate-900/70">
            Products
          </NavLink>
          <NavLink to="/dashboard" onClick={onClose} className="rounded-2xl px-4 py-3 text-slate-300 hover:bg-slate-900/70">
            Dashboard
          </NavLink>
          <NavLink to="/orders" onClick={onClose} className="rounded-2xl px-4 py-3 text-slate-300 hover:bg-slate-900/70">
            My Orders
          </NavLink>
          <NavLink to="/login" onClick={onClose} className="rounded-2xl px-4 py-3 text-cyan-300 hover:bg-slate-900/70">
            Login / Signup
          </NavLink>
        </nav>
      </div>
    </div>
  )
}

export default MobileMenu
