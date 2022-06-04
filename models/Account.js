import mongoose from 'mongoose'
import findOrCreate from "mongoose-findorcreate"

const accountSchema = mongoose.Schema(
  {
    stripe_customer_id: {
      type: String,
    },
    subscribed_at: {
      type: String,
    },
    stripe_subscription_id: {
      type: String,
    },
    fifty_percent_off: {
      type: Boolean,
      default: false,
    },
    stripe_payment_method_id: {
      type: String,
    },
    plan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: 'Users',
    },
  },
  {
    timestamps: true,
  },
)

accountSchema.plugin(findOrCreate)

const Account = mongoose.model('Account', accountSchema)

export default Account
