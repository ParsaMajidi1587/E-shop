import express from "express"
import { searchProducts } from "../controllers/productController.js"

export const searchRoute = express.Router()

searchRoute.get('/search',searchProducts)