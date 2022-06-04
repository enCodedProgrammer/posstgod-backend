import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import connectDB from './config/db.js'
import workspaces from './routes/workspaces.js'
import users from './routes/users.js'
// import plans from './routes/plans.js'
import { notFound, errorHandler } from './middleware/error.js'
import cors from 'cors'
import routes from './routes/index.js';
import slack from './routes/slack.js'
//load env variables
dotenv.config({ path: './config/config.env' })

// Create Express app
const app = express()
app.use(express.json())

// app.use(session({
//   secret: "Our little secret.",
//   resave: false,
//   saveUninitialized: true,
//   store: new MongoStore({ mongooseConnection: mongoose.connection}),
//   name: "sid",
//   cookie: {maxAge: 120 * 60 * 1000, httpOnly: false}
// }));

// cross site scripting
app.use(cors({}))

// Development logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

connectDB()
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', process.env.WEB_DOMAIN)
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'GET, POST, OPTIONS, PUT, PATCH, DELETE',
//   )
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'X-Requested-With,content-type,accept,authorization',
//   )
//   res.setHeader('Access-Control-Allow-Credentials', true)
//   next()
// })

// app.use('/api/users', user)
app.use('/workspace', workspaces)
app.use('/user', users)
app.use(slack)
app.use(routes)
app.use(notFound)
app.use(errorHandler)
//port
const PORT = process.env.PORT || 5000

// A sample route
app.get('/', (req, res) => res.send('Hello World!'))

// Start the Express server
const server = app.listen(PORT, () =>
  console.log(
    `And we are live in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold,
  ),
)

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  // Close server & exit process
  server.close(() => process.exit(1))
})
