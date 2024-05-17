import { Sequelize } from "sequelize";
import { isEnableLogging } from "../constants";

const environment = process.env.NODE_ENV

const [storage, logsStorage] = function (): string[] {
    if (environment === 'test') {
        return [':memory:', ':memory:']
    }
    return ['../../infra/database.db', '../../infra/database-logs.db']
}()

export const [storageSequelize, storageLogsSequelize] = function(): Sequelize[] {
    const storageSequelize = new Sequelize({
        dialect: 'sqlite',
        storage: storage,
        logging: isEnableLogging
    })
    const storageLogsSequelize = new Sequelize({
        dialect: 'sqlite',
        storage: logsStorage,
        logging: isEnableLogging
    })
    return [storageSequelize, storageLogsSequelize]
}()

export const SequelizeAuth = storageSequelize.authenticate({
    logging: isEnableLogging
})

export const LogsSequelizeAuth = storageLogsSequelize.authenticate({
    logging: isEnableLogging
})
