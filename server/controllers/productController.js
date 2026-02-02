import asyncHandler from 'express-async-handler'
import Product from '../models/Product.js'

export const getProducts = asyncHandler(async (req, res) => {
  const { search, tech, difficulty, sort } = req.query
  const query = {}

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ]
  }

  if (tech) {
    query.techStack = { $in: [tech] }
  }

  if (difficulty) {
    query.difficulty = difficulty
  }

  let productsQuery = Product.find(query)

  if (sort === 'price-asc') {
    productsQuery = productsQuery.sort({ price: 1 })
  } else if (sort === 'price-desc') {
    productsQuery = productsQuery.sort({ price: -1 })
  } else if (sort === 'newest') {
    productsQuery = productsQuery.sort({ createdAt: -1 })
  }

  const products = await productsQuery.exec()
  res.json(products)
})

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }
  res.json(product)
})

export const createProduct = asyncHandler(async (req, res) => {
  const { title, description, techStack, difficulty, price, thumbnail, gallery, deliveryType } = req.body

  const product = await Product.create({
    title,
    description,
    techStack: techStack ? JSON.parse(techStack) : [],
    difficulty,
    price,
    thumbnail,
    gallery: gallery ? JSON.parse(gallery) : [],
    deliveryType,
  })

  res.status(201).json(product)
})

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  const { title, description, techStack, difficulty, price, thumbnail, gallery, deliveryType } = req.body

  product.title = title ?? product.title
  product.description = description ?? product.description
  product.techStack = techStack ? JSON.parse(techStack) : product.techStack
  product.difficulty = difficulty ?? product.difficulty
  product.price = price ?? product.price
  product.thumbnail = thumbnail ?? product.thumbnail
  product.gallery = gallery ? JSON.parse(gallery) : product.gallery
  product.deliveryType = deliveryType ?? product.deliveryType

  const updated = await product.save()
  res.json(updated)
})

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  await product.deleteOne()
  res.json({ message: 'Product removed' })
})
