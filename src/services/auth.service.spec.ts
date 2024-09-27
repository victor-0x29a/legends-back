import { User } from "../models";
import { Auth } from "./auth.service";

const userData = {
    id: 1,
    name: 'foo',
    username: 'bar',
    password: '$----secret----$'
} as unknown as User

describe('should success in all flow methods', () => {
    const appSecret = '--key--'

    const service = (function () {
        const authService = new Auth(appSecret)
        authService.user = userData
        return authService
    }())

    test('should get the sign payload', () => {
        const payloadExpected = {
            id: userData.id,
            username: userData.username
        }

        expect(payloadExpected).toEqual(service.tokenPayload)
    })

    test('should get the token options', () => {
        const optionsExpected = {
            expiresIn: '20min'
        }

        expect(optionsExpected).toEqual(service.tokenOptions)
    })

    test('should sign a token', () => {
        const tokenSigned = service.signToken()

        const tokenParts = tokenSigned.split('.').length

        expect(typeof tokenSigned).toEqual('string')
        expect(tokenParts).toBe(3)
    })

    test('should gen a password hash', async () => {
        const plainText = '--password--'

        const hash = await service.getPasswordHash(plainText)

        expect(hash).not.toEqual(plainText)
    })

    test('should compare a plain text with a generated hash', async () => {
        const plainText = '--password--'

        const hash = await service.getPasswordHash(plainText)

        const result = await service.comparePlainTextWithHash(plainText, hash)

        expect(result).toBe(true)

        const wrongResult = await service.comparePlainTextWithHash('--key--', hash)

        expect(wrongResult).toBe(false)
    })
})

describe('should test all validation methods', () => {
    const generateService = (appSecret: undefined | number | object | null | string) => {
        const authService = new Auth(appSecret as unknown as string)

        authService.user = userData

        return authService
    }

    const validationErrorMessage = 'The application secret must be provided.'

    test('should not sign a token when havent app secret', () => {
        const service = generateService(undefined)

        expect(() => service.signToken()).toThrow(validationErrorMessage)

        const serviceWithNullSecret = generateService(null)

        expect(() => serviceWithNullSecret.signToken()).toThrow(validationErrorMessage)

        const serviceWithEmptyString = generateService('')

        expect(() => serviceWithEmptyString.signToken()).toThrow(validationErrorMessage)
    })

    test('shoult not sign a token when the app secret is a number', () => {
        const service = generateService(9)

        expect(() => service.signToken()).toThrow(validationErrorMessage)
    })

    test('should not sign a token when the app secret is an object', () => {
        const service = generateService({})

        expect(() => service.signToken()).toThrow(validationErrorMessage)
    })
})
