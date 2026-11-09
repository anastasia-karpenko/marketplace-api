import express from 'express'
import { authRouter } from './auth.js'
import { listingsRouter } from './listings.js'

const router = express.Router()

router.use('/auth', authRouter)
router.use('/listings', listingsRouter)

export default router