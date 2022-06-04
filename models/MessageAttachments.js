import mongoose from 'mongoose'

const messageAttachmentSchema = mongoose.Schema(
  {
    filename: {
        type: String,
      },
    message_id: {
        type: String,
      },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
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

const MessageAttachment = mongoose.model('MessageAttachment', messageAttachmentSchema)

export default MessageAttachment