import dotenv from 'dotenv'

dotenv.config({
    path: './.env'
})

import { authenticateOrm, startServer } from './main'

authenticateOrm(startServer)
