import type { FormEvent } from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'

const NewsletterSection = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email) {
      toast.error('Please enter your email')
      return
    }
    toast.success('You are subscribed!')
    setEmail('')
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20">
      <div className="overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-purple-500/10 p-8 text-center shadow-2xl md:p-12">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">Be the first to unlock new drops</h2>
        <p className="mt-3 text-sm text-slate-200">
          Subscribe for premium templates, discount codes, and bi-weekly developer resources.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col justify-center gap-4 md:flex-row">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="h-12 rounded-2xl border border-slate-700 bg-slate-950/70 px-4 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-cyan-500 px-6 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  )
}

export default NewsletterSection
