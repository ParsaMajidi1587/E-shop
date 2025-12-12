import express from 'express'
import { meController } from '../controllers/meController.js'
import { requireAuth } from '../middleware/authRequire.js'
import { isAdmin } from '../middleware/admin.js'

export const meRouter = express.Router()

meRouter.get('/me', requireAuth ,meController)