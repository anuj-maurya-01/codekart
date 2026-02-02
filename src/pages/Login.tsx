import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const { login, loading } = useAuth()
  const [formState, setFormState] = useState({ email: '', password: '' })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await login(formState.email, formState.password)
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-400">Log in to access your downloads and orders.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
          Email
          <input
            type="email"
            value={formState.email}
            onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
            className="h-12 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 text-sm text-slate-100"
          />
        </label>
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
          Password
          <input
            type="password"
            value={formState.password}
            onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
            className="h-12 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 text-sm text-slate-100"
          />
        </label>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
      <p className="text-center text-xs text-slate-400">
        Don’t have an account?{' '}
        <Link to="/signup" className="font-semibold text-cyan-300">
          Create one
        </Link>
      </p>
    </div>
  )
}

export default Login
