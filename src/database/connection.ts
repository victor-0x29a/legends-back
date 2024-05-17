import { Sequelize } from "sequelize";
import { isEnableLogging } from "../constants";

const environment = process.env.NODE_ENV

const storage = (environment === 'test') ? ':memory:' : '../../infra/database.db'

const logsStorage = (environment === 'test') ? ':memory:' : '../../infra/database-logs.db'


export const storageSequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storage,
    logging: isEnableLogging
})
export const storageLogsSequelize = new Sequelize({
    dialect: 'sqlite',
    storage: logsStorage,
    logging: isEnableLogging
})

export const SequelizeAuth = storageSequelize.authenticate({
    logging: isEnableLogging
})

export const LogsSequelizeAuth = storageLogsSequelize.authenticate({
    logging: isEnableLogging
})
