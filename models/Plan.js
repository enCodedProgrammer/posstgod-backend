import mongoose from 'mongoose'

const planSchema = mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
    },
    stripe_plan_id: {
      type: String,
      // required: true,
    },
    messages: {
      type: String,
      // required: true,
    },
    annotations: {
      type: String,
      // required: true,
    },
    tasks: {
      type: String,
      // required: true,
    },
    polls: {
      type: String,
      // required: true,
    },
    price: {
      type: Number,
      // required: true,
    },
    annotations: {
      type: String,
      // required: true,
    },
    active: {
      type: String,
      // required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users"
    },
  },
  {
    timestamps: true,
  },
)

const Plan = mongoose.model('Plan', planSchema)

export default Plan
