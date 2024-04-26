import { DataTypes } from 'sequelize'
import { sequelize } from '../database/connection'

export const EntityModel = sequelize.define('entity', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    properties: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
    },
    description: {
        type: DataTypes.STRING(2800),
        allowNull: false,
        defaultValue: '',
    },
    author: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    image: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null
    }
})
