import { Sequelize } from "sequelize";
import { isEnableLogging, isTestingEnvironment } from "../constants";

const storage = isTestingEnvironment ? ':memory:' : '../infra/database.db'

const logsStorage = isTestingEnvironment ? ':memory:' : '../infra/database-logs.db'


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
