import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Signup = () => {
  const { signup, loading } = useAuth()
  const [formState, setFormState] = useState({ name: '', email: '', password: '' })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await signup(formState.name, formState.email, formState.password)
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Create your CodeKart account</h1>
        <p className="mt-2 text-sm text-slate-400">Join thousands of developers shipping faster.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
          Name
          <input
            type="text"
            value={formState.name}
            onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
            className="h-12 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 text-sm text-slate-100"
          />
        </label>
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
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
      <p className="text-center text-xs text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-cyan-300">
          Login
        </Link>
      </p>
    </div>
  )
}

export default Signup
