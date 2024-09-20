import { DataTypes } from 'sequelize'
import { storageSequelize } from '../database/connection'

export type Entity = {
    id: number
    title: string
    properties: object
    description: string
    author?: string
    image?: object
    sections?: string
    type: string
}

export const EntityModel = storageSequelize.define('entity', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
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
    },
    sections: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    type: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
})
