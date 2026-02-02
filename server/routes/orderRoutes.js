import express from 'express'
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  markOrderDelivered,
} from '../controllers/orderController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, createOrder)
router.route('/my').get(protect, getMyOrders)
router.route('/all').get(protect, admin, getAllOrders)
router.route('/:id/deliver').put(protect, admin, markOrderDelivered)

export default router
