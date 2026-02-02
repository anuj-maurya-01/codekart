import { testimonials } from '../lib/constants'

const TestimonialsSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Testimonials</p>
        <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">Loved by builders worldwide</h2>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article key={testimonial.name} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
            <p className="text-sm text-slate-300">“{testimonial.quote}”</p>
            <div className="mt-6">
              <p className="font-semibold text-white">{testimonial.name}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{testimonial.role}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default TestimonialsSection
