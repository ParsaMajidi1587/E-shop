import express from 'express'
import { bestProducts, highRatedProducts } from '../controllers/productController.js'

export const bestsellRoute = express.Router()

bestsellRoute.get('/best-sell',bestProducts)

bestsellRoute.get('/high-rated',highRatedProducts)