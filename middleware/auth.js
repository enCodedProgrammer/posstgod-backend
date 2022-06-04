import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/User.js'

const protect = asyncHandler(async (req, res, next) => {
  let token

  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

const proceedIfThereIsEmail = asyncHandler(async (req, res, next) => {
  try {
    const { email } = req.body

    req.user = await User.findOne({ email })

    next()
  } catch (error) {
    console.log(error)
    res.status(500)
    throw new Error('No user found by this email address.')
  }
})

const proceedIfThereIsNoEmail = asyncHandler(async (req, res, next) => {
  try {
    const { email } = req.body

    await User.findOne({ email })

    res.status(422).json({ error: 'This email is already in use' })
  } catch (e) {
    next()
  }
})

export { protect, proceedIfThereIsEmail, proceedIfThereIsNoEmail }
