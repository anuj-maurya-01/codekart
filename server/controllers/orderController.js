import asyncHandler from 'express-async-handler'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import sendEmail from '../utils/sendEmail.js'

export const createOrder = asyncHandler(async (req, res) => {
  const { items, customerName, customerEmail, notes } = req.body

  if (!items || items.length === 0) {
    res.status(400)
    throw new Error('No order items provided')
  }

  const userId = req.user._id

  const populatedItems = await Promise.all(
    items.map(async (item) => {
      const product = await Product.findById(item.product)
      if (!product) throw new Error('Product not found')
      return {
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      }
    }),
  )

  const total = populatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const order = await Order.create({
    user: userId,
    items: populatedItems,
    customerName,
    customerEmail,
    notes,
    total,
  })

  const emailHtml = `
    <h2>New order on CodeKart</h2>
    <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
    <p><strong>Notes:</strong> ${notes || 'None'}</p>
    <h3>Items</h3>
    <ul>
      ${populatedItems
        .map(
          (item) => `
            <li>
              Product ID: ${item.product}<br />
              Quantity: ${item.quantity}<br />
              Price: $${item.price}
            </li>
          `,
        )
        .join('')}
    </ul>
    <p><strong>Total:</strong> $${total}</p>
  `

  await sendEmail({ subject: 'New CodeKart Order', html: emailHtml })

  const createdOrder = await order.populate({
    path: 'items.product',
  })

  res.status(201).json(createdOrder)
})

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('items.product')
  res.json(orders)
})

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('items.product').populate('user', 'name email')
  res.json(orders)
})

export const markOrderDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }

  order.status = 'delivered'
  order.deliveryLink = req.body.deliveryLink
  const updated = await order.save()
  const populatedOrder = await updated.populate('items.product')

  res.json(populatedOrder)
})
