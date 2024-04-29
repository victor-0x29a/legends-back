import { DataTypes } from 'sequelize'
import { sequelize } from '../database/connection'

export const UserModel = sequelize.define('user', {
    name: {
        type: DataTypes.STRING,
        defaultValue: 'Desconhecido',
        allowNull: false
    },
    username: DataTypes.STRING(20),
    password: DataTypes.STRING
})
