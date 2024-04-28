import { string, object } from 'yup'

export const paginationSchema = object().shape({
    page: string().required().test('is-numeric', 'Page must be a number.', (value) => {
        try {
            const parsed = Number(value)
            return parsed > 0
        } catch (error) {
            return false
        }
    }),
    perPage: string().required().test('is-numeric', 'Per page must be a number and greater than zero and less than 50.', (value) => {
        try {
            const parsed = Number(value)
            return parsed > 0 && parsed <= 50
        } catch (error) {
            return false
        }
    })
})