// import stripeUtils from '../utils/StripeUtils.js'
import asyncHandler from 'express-async-handler'
import Stripe from 'stripe'
import Account from '../models/Account.js'
const stripe = new Stripe(
  'sk_test_51JkpnZEbgNe4dfRpn9Di5EsSsqhEukdbrnK9CfSwZ9uGrZacK2kLl5rSoP0zvBXtEwMkgtQQ7HBdVKrQMpxFXLTH00h86TlXJo',
)

const changePlan = asyncHandler(async (req, res) => {
  const promises = []
  const { payment_method_id } = req.body
  const {
    user: { email },
    plan,
  } = req

  const accountId = req.workspace.account.toString()
  let account = await Account.findById(accountId)

  const newCustomer = account.stripe_customer_id == null
  const newSubscription = account.stripe_subscription_id == null
  const freePlan = plan.id === 4

  if (req.body.coupon) {
    // check if the coupon has been given
    if (account.fifty_percent_off) {
      res.status(400)
      throw new Error('Offer has already been given')
    }

    //create a coupon with 50% off
    await stripe.coupons
      .create({
        duration: 'once',
        id: 'free-period',
        percent_off: 50,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))

    //update a given subscription for the customer
    await stripe.subscriptions.update(account.stripe_subscription_id, {
      coupon: 'free-period',
    })

    // set coupon to given
    account.fifty_percent_off = true

    account.save()

    res.json({
      id: account.id,
      subscribed_at: account.subscribed_at,
      stripe_payment_method_id: account.stripe_payment_method_id,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      workspace_id: account.workspace_id,
      plan_id: {
        id: plan.id,
        name: plan.name,
        stripe_plan_id: plan.stripe_plan_id,
        members: plan.members,
        messages: plan.messages,
        annotations: plan.annotations,
        tasks: plan.tasks,
        polls: plan.polls,
        price: plan.price,
      },
    })
  } else if (
    account.stripe_customer_id !== null &&
    payment_method_id !== null
  ) {
    const subscription = await stripe.subscriptions.retrieve(
      account.stripe_subscription_id,
    )

    await stripe.subscriptions.update(subscription.id, {
      payment_behavior: 'pending_if_incomplete',
      proration_behavior: 'always_invoice',
      items: [
        {
          id: subscription.items.data[0].id,
          price: plan.stripe_plan_id,
        },
      ],
    })

    account.subscribed_at = new Date()
    account.plan_id = plan.id

    account.save()

    res.json({
      id: account.id,
      subscribed_at: account.subscribed_at,
      stripe_payment_method_id: account.stripe_payment_method_id,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      workspace_id: account.workspace_id,
      plan_id: {
        id: plan.id,
        name: plan.name,
        stripe_plan_id: plan.stripe_plan_id,
        members: plan.members,
        messages: plan.messages,
        annotations: plan.annotations,
        tasks: plan.tasks,
        polls: plan.polls,
        price: plan.price,
      },
    })
  } else {
    // console.log(account)
    if (freePlan) {
      promises.push(stripe.subscriptions.del(account.stripe_subscription_id))
      account.stripe_subscription_id = null
    } else {
      if (newCustomer) {
        const customer = await stripe.customers.create({ email })
        // console.log(customer.id)
        account.stripe_customer_id = customer.id
      }

      if (payment_method_id) {
        // console.log(payment_method_id)
        await stripe.paymentMethods
          .attach(payment_method_id, { customer: account.stripe_customer_id })
          .then((cust) => {
            console.log(cust)
          })
          .catch((err) => console.log(err))
      }

      if (!newSubscription) {
        await stripe.subscriptions.del(account.stripe_subscription_id)
      }

      const { id } = await stripe.subscriptions.create({
        customer: account.stripe_customer_id,
        items: [{ price: plan.stripe_plan_id }],
        trial_period_days: 7,
      })

      account.stripe_subscription_id = id
      account.stripe_payment_method_id = payment_method_id
    }
    account.subscribed_at = new Date()
    account.plan_id = plan.id

    promises.push(account.save())

    let finalPromises = await Promise.all(promises)

    if (!finalPromises) {
      console.log('not final promises')
      res.status(500)
      throw new Error('Something went wrong while processing payment.')
    }

    if (finalPromises) {
      res.json({
        id: account.id,
        subscribed_at: account.subscribed_at,
        stripe_payment_method_id: account.stripe_payment_method_id,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
        workspace_id: account.workspace_id,
        plan_id: {
          id: plan.id,
          name: plan.name,
          stripe_plan_id: plan.stripe_plan_id,
          members: plan.members,
          messages: plan.messages,
          annotations: plan.annotations,
          tasks: plan.tasks,
          polls: plan.polls,
          price: plan.price,
        },
      })
    }
  }
})

const cancelPlan = asyncHandler(async (req, res) => {
  const accountId = req.workspace.account.toString()
  let account = await Account.findById(accountId)

  if (account && account.stripe_subscription_id) {
    // console.log(account.stripe_subscription_id)

    const deleted = await stripe.subscriptions.del(
      account.stripe_subscription_id,
    )

    if (deleted.status == 'canceled') {
      account.stripe_subscription_id = null
      account.plan_id = null

      account.save()

      res.status(204).json({
        message: 'Subscription cancelled successful',
      })
    } else {
      res.status(400)
      throw new Error('Something went wrong trying to cancel this subscription')
    }
  } else {
    res.status(400)
    throw new Error('Subscription not cancelled.')
  }
})

const listInvoice = asyncHandler(async (req, res) => {
  try {
    const customerId = req.workspace.account.toString()
    let customer = await Account.findById(customerId)

    if (customer.stripe_customer_id) {
      let invoicesList = []

      for await (const invoices of stripe.invoices.list({
        customer: customer.stripe_customer_id,
        limit: 2,
      })) {
        invoicesList.push(invoices)
      }
      res.json(invoicesList)
    } else {
      res.json([])
    }
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: e.message })
  }
})

export { changePlan, cancelPlan, listInvoice }
