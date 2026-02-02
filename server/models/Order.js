import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
})

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    notes: { type: String },
    status: { type: String, enum: ['pending', 'delivered'], default: 'pending' },
    deliveryLink: { type: String },
    total: { type: Number, required: true },
  },
  { timestamps: true },
)

const Order = mongoose.model('Order', orderSchema)

export default Order
