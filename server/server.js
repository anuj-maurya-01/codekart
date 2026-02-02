import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

/* =======================
   ENV SETUP
======================= */
dotenv.config()

/* =======================
   APP INIT
======================= */
const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/* =======================
   CORS (FIXED)
======================= */
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  }),
)

// handle preflight
app.options('*', cors())

/* =======================
   MIDDLEWARES
======================= */
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))

/* =======================
   DATABASE
======================= */
connectDB()

/* =======================
   ROUTES
======================= */
app.get('/', (req, res) => {
  res.send('CodeKart API is running')
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

/* =======================
   PRODUCTION FRONTEND
======================= */
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.resolve(__dirname, '../dist')
  app.use(express.static(frontendPath))

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'))
  })
}

/* =======================
   ERROR HANDLERS
======================= */
app.use(notFound)
app.use(errorHandler)

/* =======================
   SERVER START
======================= */
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
