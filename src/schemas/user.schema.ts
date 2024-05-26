import * as Yup from 'yup'

const userSchema = {
    id: Yup.number()
        .integer()
        .positive()
        .required(),
    name: Yup.string()
        .default('Desconhecido')
        .required(),
    username: Yup.string()
        .max(20)
        .required(),
    password: Yup.string()
        .required()
}

export const createUserSchema = Yup.object().shape({
    username: userSchema.username,
    password: userSchema.password,
    name: userSchema.name.optional()
})

export const updateUserSchema = Yup.object().shape({
    name: userSchema.name.optional(),
    username: userSchema.username.optional()
}).test('fill-one-field', 'Fill one field to update.', (value) => {
    return Object.keys(value).length !== 0
})

export const signInSchema = Yup.object().shape({
    username: userSchema.username,
    password: userSchema.password
})
