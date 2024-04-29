import { Sequelize } from "sequelize";

const environment = process.env.NODE_ENV

const storage = function () {
    if (environment === 'test') {
        return ':memory:'
    }
    return '../../infra/database.db'
}()

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storage
})

export const SequelizeAuth = sequelize.authenticate()
