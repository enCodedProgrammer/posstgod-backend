import mongoose from 'mongoose'

const messageSchema = mongoose.Schema(
  {
    // slack_message_id: {
    //     type: String,
    //     required: true,
    //   },
        slack_message_text: {
        type: String,
        required: true,
      },
    // slack_team_id: {
    //     type: String,
    //     required: true,
    //   },
    slack_channel_id: [{
        type: String,
        required: true,
      }],
    slack_message_post_at: {
        type: String,
      },
    sent: {
        type: Boolean,
        // required: true,
      },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    //  plan: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: 'Plan',
    // },
    workspace_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Workspace',
    }
  },
{
    timestamps: true,
}
)

const Message = mongoose.model('Message', messageSchema)

export default Message