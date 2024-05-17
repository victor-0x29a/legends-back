import { DataTypes } from 'sequelize'
import { storageSequelize } from '../database/connection'
import { isEnableLogging } from '../constants'

export type User = {
    id: number
    name: string
    username: string
    password: string
}

export const UserModel = storageSequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        defaultValue: 'Desconhecido',
        allowNull: false
    },
    username: DataTypes.STRING(20),
    password: DataTypes.STRING
})

UserModel.sync({ force: true, logging: isEnableLogging })
