import { Outlet } from 'react-router-dom'
import ScrollToTop from '../components/ScrollToTop'

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <ScrollToTop />
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 shadow-xl backdrop-blur">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
