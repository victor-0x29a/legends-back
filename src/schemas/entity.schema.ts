// export const EntityModel = sequelize.define('entity', {
//     id: {
//         type: DataTypes.NUMBER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     title: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     properties: {
//         type: DataTypes.JSON,
//         allowNull: false,
//         defaultValue: {}
//     },
//     description: {
//         type: DataTypes.STRING(2800),
//         allowNull: false,
//         defaultValue: '',
//     },
//     author: {
//         type: DataTypes.STRING(30),
//         allowNull: true
//     },
//     image: {
//         type: DataTypes.JSON,
//         allowNull: true,
//         defaultValue: null
//     },
//     sections: {
//         type: DataTypes.STRING,
//         allowNull: true,
//         defaultValue: null
//     },
//     type: {
//         type: DataTypes.STRING(30),
//         allowNull: false
//     }
// })

import * as Yup from 'yup';

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
    author: Yup.string()
        .max(30)
        .typeError('Author must be a string.'),
    image: Yup.object()
        .test('is-image', 'Image must be a valid image.', (value) => {
            if (value === null) return true

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
    return Object.keys(value).length !== 0;
})

export const findAllFilters = Yup.object().shape({
    title: entitySchema.title.optional(),
    properties: entitySchema.properties.optional(),
    description: entitySchema.description.optional(),
    author: entitySchema.author.optional(),
    image: entitySchema.image.optional(),
    sections: entitySchema.sections.optional(),
    type: entitySchema.type.optional(),
})
