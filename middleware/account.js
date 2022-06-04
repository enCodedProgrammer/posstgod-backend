import asyncHandler from 'express-async-handler'
import Plan from '../models/Plan.js'
import Account from '../models/Account.js'

// Check if there is a plan before proceeding

export const checkPlan = asyncHandler(async (req, res, next) => {
  const plan_id = req.body.plan_id || req.query.plan_id

  if (plan_id == null || undefined) {
    res.status(404)
    throw new Error('Plan is required but not found')
  }

  //get the plan from models mongoose
  req.plan = await Plan.findById(req.body.plan_id)

  if (!req.plan) {
    res.status(404)
    throw new Error('Plan not found.')
  }

  next()
})

//Check if the subscriber's plan is similar to the changed plan

export const checkSimilarPlan = asyncHandler(async (req, res, next) => {
  const { plan } = req

  const accountId = req.workspace.account.toString()
  let account = await Account.findById(accountId)

  if (!req.body.coupon) {
    if (account.plan_id.toString() === plan.id) {
      res.status(401)
      throw new Error('You cannot subscribe to the same plan.')
    }
  }

  next()
})

//Validate the changes in the plan

export const validatePlanChange = asyncHandler(async (req, res, next) => {
  const { payment_method_id } = req.body

  const accountId = req.workspace.account.toString()
  let account = await Account.findById(accountId)

  if (account.stripe_customer_id == null && payment_method_id == null) {
    res.status(401)
    throw new Error('Payment method is required.')
  }

  next()
})
