import { DataTypes } from 'sequelize'
import { storageLogsSequelize } from '../../database/connection'

export type Log = {
    type: string
    content: string
}

export const LogModel = storageLogsSequelize.define('log', {
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

LogModel.sync({ force: true })
