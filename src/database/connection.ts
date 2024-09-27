import { Sequelize } from "sequelize";
import { isEnableLogging, isTestingEnvironment } from "../constants";

const { POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT } = process.env

const storage = isTestingEnvironment ? ':memory:' : undefined
const options = isTestingEnvironment ? {} : {
    host: POSTGRES_HOST,
    port: Number(POSTGRES_PORT),
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB
}
const dialect = isTestingEnvironment ? 'sqlite' : 'postgres'

export const storageSequelize = (function () {
    return new Sequelize({
        dialect,
        storage: storage,
        logging: isEnableLogging,
        ...options
    })
}())

export const SequelizeAuth = storageSequelize.authenticate({
    logging: isEnableLogging
})
