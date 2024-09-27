import type { Model, ModelCtor } from 'sequelize'
import { LegendHttpError } from '../errors'

export const searchEntity = async <T>(model: ModelCtor<Model>, by: any, throwIfExists: boolean, throwIfNotExists: boolean, customMessage = '') => {
    const entity = await model.findOne({ where: by }) as T

    const hasCustomMessage = Boolean(customMessage)

    if (entity && throwIfExists) {
        throw new LegendHttpError(409, hasCustomMessage ? customMessage : 'Entity already exists.')
    }

    if (!entity && throwIfNotExists) {
        throw new LegendHttpError(404, hasCustomMessage ? customMessage : 'Entity not found.')
    }

    return entity
}
