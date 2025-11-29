import express from 'express'
import { authController, forgotPassword, resetPassword } from '../controllers/authController.js'

export const authRouter = express.Router()

authRouter.post('/register',authController)

authRouter.post('/forgot-password',forgotPassword)

authRouter.post('/reset-password' , resetPassword)