import { object, number } from 'yup'

export type parsedPaginationSchema = {
    page: number
    perPage: number
}

export const paginationSchema = object().shape({
    page: number().required('Page is required').test('is-numeric', 'Page must greater than zero.', (value) => {
        const parsed = Number(value)
        return parsed > 0
    }).typeError('Page must be a number.'),
    perPage: number().required('Per page is required.').test('is-numeric', 'Per page must greater than zero and less than 50.', (value) => {
        const parsed = Number(value)
        return parsed > 0 && parsed <= 50
    }).typeError('Per page must be a number.')
})

export type parsedIdSchema = number

export const idSchema = number().required('Id is required.').test('is-numeric', 'Id must greater than zero.', (value) => {
    return value > 0
}).typeError('Id must be a number.')
