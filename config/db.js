import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config({})
const connectDB = async () => {
  const conn = await mongoose.connect("mongodb://localhost:27017/postgodDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
}
export default connectDB