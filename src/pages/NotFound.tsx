import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-300">
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">404</p>
      <h1 className="text-3xl font-semibold text-white">Oops! The page you are looking for does not exist.</h1>
      <p className="text-sm text-slate-400">You might have mistyped the address or the page may have moved.</p>
      <Link to="/" className="inline-flex items-center rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900">
        Back to home
      </Link>
    </div>
  )
}

export default NotFound
