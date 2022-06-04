import express from 'express'
import {
  // getUser,
  authUser,
  // logout,
  changePassword,
  sendNewPassword,
  registerUser,
} from '../controllers/user.js'

import {
  proceedIfThereIsEmail,
  proceedIfThereIsNoEmail,
  protect,
} from '../middleware/auth.js'

const router = express.Router({ mergeParams: true })

router.route('/').post(proceedIfThereIsNoEmail, registerUser)
// router.route().get(protect, getUser)

router.route('/login').post(authUser)

router.route('/email/password').post(proceedIfThereIsEmail, sendNewPassword)

router.route('/password').put(protect, changePassword)

// router.route('/logout').get( logout)

export default router
