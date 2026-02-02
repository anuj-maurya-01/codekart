import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <ScrollToTop />
      <Header />
      <main className="pb-24 pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
