import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: { type: [String], default: [] },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    gallery: { type: [String], default: [] },
    deliveryType: { type: String, default: 'Instant download' },
    categories: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
)

const Product = mongoose.model('Product', productSchema)

export default Product
