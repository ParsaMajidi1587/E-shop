import express from 'express'
import { productRoute } from './routes/productRoutes.js'

const PORT = 8000

const server = express()

server.use('/',productRoute)

server.listen(PORT , ()=>console.log(`connected to port :${PORT}`))