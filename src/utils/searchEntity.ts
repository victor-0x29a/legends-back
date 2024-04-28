import type { Model, ModelCtor } from 'sequelize'
import { LegendHttpError } from '../web/errors'

export const searchEntity = async (model: ModelCtor<Model>, by: any, throwIfExists, throwIfNotExists) => {
    const entity = await model.findOne({ where: by })

    if (entity && throwIfExists) {
        throw new LegendHttpError(409, 'Entity already exists.')
    }

    if (!entity && throwIfNotExists) {
        throw new LegendHttpError(404, 'Entity not found.')
    }

    return entity
}