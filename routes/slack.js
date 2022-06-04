import express from 'express'
import controller from '../controllers/SlackController.js'
const router = express.Router()

router.post('/oauth/authorize', controller.handleCallback)
router.post('/uninstall/:token', controller.uninstallApp)

export default router