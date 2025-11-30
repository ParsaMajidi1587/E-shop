import express from 'express'
import { productRoute } from './routes/productRoutes.js'
import cors from 'cors'
import { authRouter } from './routes/authRoute.js'
import session from 'express-session'
import { meRouter } from './routes/meRoute.js'
import { loginroute } from './routes/loginRoute.js'
import { deleteRoute } from './routes/deleteRoute.js'
import { bestsellRoute } from './routes/bestSellRoute.js'
import { searchRoute } from './routes/searchRoute.js'
import { cartRouter } from './routes/cartRoute.js'
const PORT = process.env.PORT || 8000

const server = express()
server.use(cors({
    origin: 'http://localhost:3000.liara.run',
    credentials:true
}))
server.use(session({
    secret:'A VERY SECRET KEY',
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        secure:false,
        sameSite:"lax",
        maxAge: 1000 * 60 * 60 * 24 
    }
}))
server.use(express.json())
server.use('/products',productRoute)
server.use('/cart',cartRouter)
server.use('/',searchRoute)
server.use('/',bestsellRoute)
server.use('/',authRouter)
server.use('/',loginroute)
server.use('/',meRouter)
server.use('/',deleteRoute)
server.listen(PORT ,'0.0.0.0', ()=>console.log(`server is running`))