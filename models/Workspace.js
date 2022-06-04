import mongoose from 'mongoose'

const workspaceSchema = mongoose.Schema(
  [{
    slack_user_id: {
      type: String,
      required: true,
    },
    slack_app_id: {
      type: String,
      required: true,
    },
    slack_token: {
      type: String,
      required: true,
    },
    slack_bot_token: {
      type: String,
      required: true,
    },
    slack_team_id: {
      type: String,
      required: true,
    },
    slack_team_name: {
      type: String,
      required: true,
    },
    slack_firstname: {
      type: String,
      required: true,
    },
    slack_lastname: {
      type: String,
      required: true,
    },
    slack_timezone: {
      type: String,
      required: true,
    },
    slack_role: {
      type: String,
      required: true,
    },
    slack_phone: {
      type: String,
      required: true,
    },
    slack_photo: {
      type: String,
      // required: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: 'Workspace',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: 'Users',
    },
    
  }],
  {
    timestamps: true,
  },
)

const Workspace = mongoose.model('Workspace', workspaceSchema)

export default Workspace
