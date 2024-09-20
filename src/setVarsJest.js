/* eslint-disable @typescript-eslint/no-var-requires */
// Set the environment variables
process.env.port = 4000
process.env.JWT_SECRET = 'secret'

const { EntityModel, LogModel, UserModel } = require('./models')

// Initialize the database
EntityModel.sync({ force: true })

LogModel.sync({ force: true })

UserModel.sync({ force: true })
