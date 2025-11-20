import express from 'express'
import { productController } from '../controllers/productController.js'

export const productRoute = express.Router()

productRoute.get('/',productController)