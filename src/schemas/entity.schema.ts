import * as Yup from 'yup';
import { Entity } from '../models';

const entitySchema = {
    title: Yup.string()
        .required()
        .typeError('Title must be a string.'),
    properties: Yup.object()
        .required()
        .default({})
        .typeError('Properties must be an object.'),
    description: Yup.string()
        .max(2800)
        .required()
        .typeError('Description must be a string.'),
    author: Yup.string().nullable()
        .max(30)
        .typeError('Author must be a string.'),
    image: Yup.object().nullable()
        .test('is-image', 'Image must be a valid image.', (value) => {
            if (!value) return true

            const keys = Object.keys(value)

            if (keys.length !== 2) return false

            if (!keys.includes('src') || !keys.includes('alt')) return false

            return true
        })
        .typeError('Image must be an object.'),
    sections: Yup.string(),
    type: Yup.string()
        .max(30)
        .required()
        .typeError('Type must be a string.'),
}

export const createEntitySchema = Yup.object().shape({
    ...entitySchema
});

export const updateSchema = Yup.object().shape({
    title: entitySchema.title.optional(),
    properties: entitySchema.properties.optional(),
    description: entitySchema.description.optional(),
    author: entitySchema.author.optional(),
    image: entitySchema.image.optional(),
    sections: entitySchema.sections.optional(),
    type: entitySchema.type.optional(),
}).test('fill-one-field', 'Fill one field to update.', (value) => {
    if (!value) return false
    return Object.keys(value).length !== 0;
})

export type parsedFiltersSchema = Partial<Entity>

export const findAllFilters = Yup.object().shape({
    title: entitySchema.title.optional(),
    properties: entitySchema.properties.optional(),
    description: entitySchema.description.optional(),
    author: entitySchema.author.optional(),
    image: entitySchema.image.optional(),
    sections: entitySchema.sections.optional(),
    type: entitySchema.type.optional(),
})
