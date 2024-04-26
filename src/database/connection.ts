import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '../../infra/database.db'
})

export const SequelizeAuth = sequelize.authenticate()