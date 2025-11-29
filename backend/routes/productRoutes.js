import express from 'express'
import { bestProducts, getRelatedProducts, productMobileController, productsById, searchProducts } from '../controllers/productController.js'

export const productRoute = express.Router()


productRoute.get('/:category',productMobileController)

productRoute.get('/:category/:id' , productsById)

productRoute.get('/:category/:id/related',getRelatedProducts)