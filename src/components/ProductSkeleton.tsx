const ProductSkeleton = () => {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-900 bg-slate-900/60">
      <div className="h-48 animate-pulse bg-slate-800/60" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded-full bg-slate-800/60" />
        <div className="h-4 w-full animate-pulse rounded-full bg-slate-800/60" />
        <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-800/60" />
        <div className="mt-auto flex items-center justify-between">
          <div className="h-5 w-1/3 animate-pulse rounded-full bg-slate-800/60" />
          <div className="h-10 w-24 animate-pulse rounded-2xl bg-slate-800/60" />
        </div>
      </div>
    </div>
  )
}

export default ProductSkeleton
