import { Outlet } from 'react-router-dom'
import AdminSidebar from '../admin/AdminSidebar'
import ScrollToTop from '../components/ScrollToTop'

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <ScrollToTop />
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row">
        <AdminSidebar />
        <div className="flex-1 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
