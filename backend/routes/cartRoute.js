import express from 'express'
import { cartController, deleteCart, getCartInfo } from '../controllers/cartController.js'
import { requireAuth } from '../middleware/authRequire.js'

export const cartRouter = express.Router()

cartRouter.post('/add', requireAuth ,cartController)

cartRouter.get('/', requireAuth ,getCartInfo)

cartRouter.delete('/delete', requireAuth ,deleteCart)