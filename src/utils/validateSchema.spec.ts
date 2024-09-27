import * as Yup from 'yup'
import { validateSchema } from "./validateSchema";

const fooSchema = Yup.string().required().max(4).min(2)

const barSchema = Yup.object().shape({
    name: fooSchema
})

test('should return string', async () => {
    const validationResult = await validateSchema<number, string>(fooSchema, 123)

    expect(validationResult).toEqual('123')
})

test('should strip unknown keys', async () => {
    const payload = {
        name: 123,
        secondName: 'foo'
    }

    const validationResult = await validateSchema<{name: number, secondName: string}, { name: string }>(barSchema, payload)

    const validationResultKeys = Object.keys(validationResult)

    expect(validationResultKeys.length).toEqual(1)
    expect(validationResultKeys[0]).toEqual('name')
    expect(typeof validationResultKeys[0]).toEqual('string')
})
