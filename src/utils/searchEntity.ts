import type { Model, ModelCtor } from 'sequelize'
import { LegendHttpError } from '../web/errors'

export const searchEntity = async (model: ModelCtor<Model>, by: any, throwIfExists: boolean, throwIfNotExists: boolean, customMessage = '') => {
    const entity = await model.findOne({ where: by })

    const hasCustomMessage = Boolean(customMessage)

    if (entity && throwIfExists) {
        throw new LegendHttpError(409, hasCustomMessage ? customMessage : 'Entity already exists.')
    }

    if (!entity && throwIfNotExists) {
        throw new LegendHttpError(404, hasCustomMessage ? customMessage : 'Entity not found.')
    }

    return entity
}