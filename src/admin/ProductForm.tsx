import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createProduct, fetchProduct, updateProduct } from '../services/productService'
import { difficultyOptions, techCategories } from '../lib/constants'
import toast from 'react-hot-toast'

interface Props {
  mode: 'create' | 'edit'
}

const ProductForm = ({ mode }: Props) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    price: '',
    difficulty: 'Intermediate',
    deliveryType: 'Instant download',
    techStack: [] as string[],
    thumbnail: '',
    gallery: [] as string[],
  })

  useEffect(() => {
    const loadProduct = async () => {
      if (mode === 'edit' && id) {
        try {
          const data = await fetchProduct(id)
          setFormState({
            title: data.title,
            description: data.description,
            price: String(data.price),
            difficulty: data.difficulty,
            deliveryType: data.deliveryType,
            techStack: data.techStack,
            thumbnail: data.thumbnail,
            gallery: data.gallery,
          })
        } catch (error) {
          toast.error('Failed to load product')
        }
      }
    }
    loadProduct()
  }, [id, mode])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    try {
      const payload = new FormData()
      payload.append('title', formState.title)
      payload.append('description', formState.description)
      payload.append('price', formState.price)
      payload.append('difficulty', formState.difficulty)
      payload.append('deliveryType', formState.deliveryType)
      payload.append('techStack', JSON.stringify(formState.techStack))
      payload.append('thumbnail', formState.thumbnail)
      payload.append('gallery', JSON.stringify(formState.gallery))

      if (mode === 'create') {
        await createProduct(payload)
        toast.success('Product created')
      } else if (mode === 'edit' && id) {
        await updateProduct(id, payload)
        toast.success('Product updated')
      }
      navigate('/admin/products')
    } catch (error) {
      toast.error('Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  const toggleTech = (tech: string) => {
    setFormState((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter((item) => item !== tech)
        : [...prev.techStack, tech],
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white md:text-3xl">
          {mode === 'create' ? 'Add new product' : 'Edit product'}
        </h1>
        <p className="mt-2 text-sm text-slate-400">Upload assets, pricing, and delivery details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
            Title
            <input
              type="text"
              value={formState.title}
              onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
              className="h-12 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 text-sm text-slate-100"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
            Price (USD)
            <input
              type="number"
              value={formState.price}
              onChange={(event) => setFormState((prev) => ({ ...prev, price: event.target.value }))}
              className="h-12 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 text-sm text-slate-100"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-500 sm:col-span-2">
            Description
            <textarea
              value={formState.description}
              onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
              className="min-h-[120px] rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
            Difficulty
            <select
              value={formState.difficulty}
              onChange={(event) => setFormState((prev) => ({ ...prev, difficulty: event.target.value }))}
              className="h-12 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 text-sm text-slate-100"
            >
              {difficultyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
            Delivery type
            <input
              type="text"
              value={formState.deliveryType}
              onChange={(event) => setFormState((prev) => ({ ...prev, deliveryType: event.target.value }))}
              className="h-12 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 text-sm text-slate-100"
            />
          </label>
        </div>

        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Tech stack</p>
          <div className="flex flex-wrap gap-3">
            {techCategories.map((tech) => (
              <button
                type="button"
                key={tech}
                onClick={() => toggleTech(tech)}
                className={`rounded-2xl border px-4 py-2 text-xs font-semibold transition ${
                  formState.techStack.includes(tech)
                    ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                    : 'border-slate-700 text-slate-300'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
            Thumbnail URL
            <input
              type="url"
              value={formState.thumbnail}
              onChange={(event) => setFormState((prev) => ({ ...prev, thumbnail: event.target.value }))}
              className="h-12 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 text-sm text-slate-100"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
            Gallery URLs (comma separated)
            <input
              type="text"
              value={formState.gallery.join(', ')}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, gallery: event.target.value.split(',').map((item) => item.trim()) }))
              }
              className="h-12 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 text-sm text-slate-100"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Saving...' : 'Save product'}
        </button>
      </form>
    </div>
  )
}

export default ProductForm
