import { string, object } from 'yup'

export const paginationSchema = object().shape({
    page: string().required('Page is required').test('is-numeric', 'Page must be a number and greater than zero.', (value) => {
        try {
            const parsed = Number(value)
            return parsed > 0
        } catch (error) {
            return false
        }
    }).typeError('Page must be a string.'),
    perPage: string().required('Per page is required.').test('is-numeric', 'Per page must be a number and greater than zero and less than 50.', (value) => {
        try {
            const parsed = Number(value)
            return parsed > 0 && parsed <= 50
        } catch (error) {
            return false
        }
    }).typeError('Per page must be a string.')
})
