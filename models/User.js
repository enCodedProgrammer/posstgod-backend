import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import findOrCreate from "mongoose-findorcreate"

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,      
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,      
    },
    workspaces:
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
      }
  },
  {
    timestamps: true,
  },
)

userSchema.plugin(findOrCreate)

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const Users = mongoose.model('Users', userSchema)

export default Users
