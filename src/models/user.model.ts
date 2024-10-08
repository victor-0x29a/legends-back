import { DataTypes } from 'sequelize'
import { storageSequelize } from '../database/connection'

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
