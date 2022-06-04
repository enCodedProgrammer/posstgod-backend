import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/User.js'
import passwordGenerator from 'generate-password'
import sendMail from '../utils/emailSending.js'
import bcrypt from 'bcrypt'

// @desc    Get a user
// @route   GET /users
// @access  Private/Admin
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    return user
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
    .populate('workspaces')
    .populate({
      path: 'workspaces',
      populate: {
        path: 'account',
        model: 'Account',
      },
    })

  // console.log(user)

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      token: generateToken(user._id),
      user,
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Change Password
// @route   POST /api/users
// @access  Public
const changePassword = asyncHandler(async (req, res) => {
  const { user } = req
  const { email, password } = req.body

  const userExists = await User.findOne({ email })

  user.password_hash = await userService.generateHash(password)

  const changedPassword = await user.save()

  if (!userExists) {
    res.status(400)
    throw new Error('User with this email not found')
  }

  if (!changedPassword) {
    res.status(400)
    throw new Error('Password has not bee changed.')
  }
})

// @desc    Change Password
// @route   POST /api/users
// @access  Public
const sendNewPassword = asyncHandler(async (req, res) => {
  try {
    console.log('we are sending a new password.')
    const { user } = req

    const password = passwordGenerator.generate({ length: 10, numbers: true })
    const foundUser = await User.findOne({ email: user.email })

    if (!foundUser) {
      res.status(400)
      throw new Error('User with given email not found.')
    }

    foundUser.password = password
    await foundUser.save()

    const message = `Kindly use this password to log in. Password ${password}`
    try {
      await sendMail({
        email: 'tudadoris@gmail.com',
        subject: 'Password Reset Request',
        message,
      })
      res.status(200).json({
        message: 'Email sent successfully',
      })
    } catch (err) {
      console.log('error... ' + err)
      res.status(400)
      throw new Error('Email not sent.')
    }
  } catch (err) {
    res.status(400)
    throw new Error(err)
  }
})

export { authUser, registerUser, getUser, changePassword, sendNewPassword }
