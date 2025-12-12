import express from 'express'
import { trackViews } from '../controllers/trackViews.js'


export const trackViewsRoute = express.Router()

trackViewsRoute.post('/track-view' , trackViews)