import { string, object } from 'yup'

export type parsedPaginationSchema = {
    page: number
    perPage: number
}

export const paginationSchema = object().shape({
    page: string().required('Page is required').test('is-numeric', 'Page must be a number and greater than zero.', (value) => {
        try {
            const parsed = Number(value)
            return parsed > 0
        } catch (error) {
            return false
        }
    }).typeError('Page must be a string.').transform((value) => Number(value)),
    perPage: string().required('Per page is required.').test('is-numeric', 'Per page must be a number and greater than zero and less than 50.', (value) => {
        try {
            const parsed = Number(value)
            return parsed > 0 && parsed <= 50
        } catch (error) {
            return false
        }
    }).typeError('Per page must be a string.').transform((value) => Number(value))
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
