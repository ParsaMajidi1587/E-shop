import express from 'express'
import { authLogin, authLogOut } from '../controllers/authController.js'

export const loginroute = express.Router()

loginroute.post('/login',authLogin)

loginroute.post('/logout',authLogOut)