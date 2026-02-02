const OrderSuccess = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-8 text-center text-slate-100">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/10 text-3xl">🎉</div>
      <h1 className="text-3xl font-semibold text-white">Order request received!</h1>
      <p className="text-sm text-slate-300">
        A confirmation email is on its way. Our admin will share your download link once your request is approved. You can track the status from your orders dashboard.
      </p>
    </div>
  )
}

export default OrderSuccess
