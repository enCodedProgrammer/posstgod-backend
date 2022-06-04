// import Plan from '../models/Plan.js'
// import asyncHandler from 'express-async-handler'
// import Workspace from '../models/Workspace.js'
// import Account from '../models/Account.js'

// const addPlan = asyncHandler(async (req, res) => {
//   const {
//     name,
//     stripe_plan_id,
//     members,
//     messages,
//     annotations,
//     polls,
//     tasks,
//     price,
//     active,
//   } = req.body

//   const user = await Plan.create({
//     name,
//     stripe_plan_id,
//     members,
//     messages,
//     annotations,
//     tasks,
//     price,
//     polls,
//     active,
//   })

//   if (user) {
//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       stripe_plan_id: user.stripe_plan_id,
//       members: user.members,
//       messages: user.messages,
//       annotations: user.annotations,
//       polls: user.polls,
//       tasks: user.tasks,
//       price: user.price,
//       active: user.active,
//     })
//   } else {
//     res.status(400)
//     throw new Error('Invalid user data')
//   }
// })

// const addWorkspace = asyncHandler(async (req, res) => {
//   const {
//     slack_user_id,
//     slack_app_id,
//     slack_token,
//     slack_bot_token,
//     slack_team_id,
//     slack_team_name,
//     slack_firstname,
//     slack_lastname,
//     slack_timezone,
//     slack_role,
//     slack_phone,
//     slack_photo,
//   } = req.body

//   const user = await Workspace.create({
//     slack_user_id,
//     slack_app_id,
//     slack_token,
//     slack_bot_token,
//     slack_team_id,
//     slack_team_name,
//     slack_firstname,
//     slack_lastname,
//     slack_timezone,
//     slack_role,
//     slack_phone,
//     slack_photo,
//   })

//   if (user) {
//     res.status(201).json({
//       _id: user._id,
//       slack_user_id: user.slack_user_id,
//       slack_token: user.slack_token,
//       slack_bot_token: user.slack_bot_token,
//       slack_team_id: user.slack_team_id,
//       slack_team_name: user.slack_team_name,
//       slack_firstname: user.slack_firstname,
//       slack_lastname: user.slack_lastname,
//       slack_timezone: user.slack_timezone,
//       slack_role: user.slack_role,
//       slack_phone: user.active,
//       slack_photo: user.slack_photo,
//     })
//   } else {
//     res.status(400)
//     throw new Error('Invalid user data')
//   }
// })

// const addAccount = asyncHandler(async (req, res) => {
//   const {
//     stripe_customer_id,
//     subscribed_at,
//     stripe_subscription_id,
//     stripe_payment_method_id,
//   } = req.body

//   const user = await Account.create({
//     stripe_customer_id,
//     subscribed_at,
//     stripe_subscription_id,
//     stripe_payment_method_id,
//   })

//   if (user) {
//     res.status(201).json({
//       _id: user._id,
//       stripe_customer_id: user.stripe_customer_id,
//       subscribed_at: user.subscribed_at,
//       stripe_subscription_id: user.stripe_subscription_id,
//       stripe_payment_method_id: user.stripe_payment_method_id,
//     })
//   } else {
//     res.status(400)
//     throw new Error('Invalid user data')
//   }
// })

// export { addPlan, addWorkspace, addAccount }
