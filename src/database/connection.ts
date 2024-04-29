import { Sequelize } from "sequelize";
import { isEnableLogging } from "../constants";

const environment = process.env.NODE_ENV

const storage = function () {
    if (environment === 'test') {
        return ':memory:'
    }
    return '../../infra/database.db'
}()

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storage,
    logging: isEnableLogging
})

export const SequelizeAuth = sequelize.authenticate({
    logging: isEnableLogging
})
