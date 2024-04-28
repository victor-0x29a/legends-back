import { string, object, number } from 'yup'

export type parsedPaginationSchema = {
    page: number
    perPage: number
}

export const paginationSchema = object().shape({
    page: number().required('Page is required').test('is-numeric', 'Page must greater than zero.', (value) => {
        const parsed = Number(value)
        return parsed > 0
    }),
    perPage: number().required('Per page is required.').test('is-numeric', 'Per page must greater than zero and less than 50.', (value) => {
        const parsed = Number(value)
        return parsed > 0 && parsed <= 50
    })
})

export type parsedIdSchema = number

export const idSchema = string().required('Id is required.').test('is-numeric', 'Id must be a number.', (value) => {
    try {
        const parsed = Number(value)
        return parsed > 0
    } catch (error) {
        return false
    }
}).typeError('Id must be a string.').transform((value) => Number(value))
