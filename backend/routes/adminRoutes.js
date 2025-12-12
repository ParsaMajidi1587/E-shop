import express from 'express'
import { isAdmin } from '../middleware/admin.js'
import { activities, addProducts, addUsers, adminProducts, adminProductsDelete, adminUsers, adminUsersDelete } from '../controllers/adminController.js'


export const adminRoutes = express.Router()

adminRoutes.get('/stats',isAdmin,activities)

adminRoutes.get('/admin-products',isAdmin,adminProducts)

adminRoutes.get('/admin-users',isAdmin,adminUsers)

adminRoutes.delete('/product-delete/:id',isAdmin,adminProductsDelete)

adminRoutes.delete('/user-delete/:id',isAdmin,adminUsersDelete)

adminRoutes.post('/add-products',isAdmin,addProducts)

adminRoutes.post('/add-users',isAdmin,addUsers)