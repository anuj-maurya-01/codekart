import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import FiltersBar from '../components/FiltersBar'
import ProductCard from '../components/ProductCard'
import ProductSkeleton from '../components/ProductSkeleton'
import { fetchProducts } from '../services/productService'
import type { Product } from '../types'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const filters = useMemo(
    () => ({
      search: searchParams.get('search') ?? '',
      tech: searchParams.get('tech') ?? '',
      difficulty: searchParams.get('difficulty') ?? '',
      sort: searchParams.get('sort') ?? '',
    }),
    [searchParams],
  )

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        const data = await fetchProducts(filters)
        setProducts(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [filters])

  const handleFilterChange = (values: Partial<typeof filters>) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(values).forEach(([key, value]) => {
      if (!value) newParams.delete(key)
      else newParams.set(key, value)
    })
    setSearchParams(newParams)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-white md:text-3xl">CodeKart marketplace</h1>
        <p className="max-w-2xl text-sm text-slate-400">
          Explore ready-made coding projects spanning SaaS dashboards, portfolio sites, e-commerce starters, and more. Filters help you quickly find the perfect stack and complexity level.
        </p>
      </div>

      <FiltersBar values={filters} onChange={handleFilterChange} />

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
          {products.length === 0 && (
            <p className="col-span-full rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-center text-sm text-slate-300">
              No projects found. Try adjusting filters.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default Products
