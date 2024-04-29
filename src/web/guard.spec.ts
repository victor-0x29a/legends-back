import { Guard } from "./guard";
import jwt from 'jsonwebtoken'

const mockedRequest = (token?: string) => ({
    headers: {
        ...(token && { Authorization: token })
    }
})

const mockedResponse = {}

const next = jest.fn()

test('should return 401 with different data types of token', async () => {
    const req = mockedRequest(123 as any)
    const res = mockedResponse
    try {
        // @ts-ignore
        await Guard(req, res, next)
    } catch (error) {
        expect(error.status).toBe(401)
        expect(error.message).toBe('Token invalid.')
    }

    const req2 = mockedRequest({} as any)
    try {
        // @ts-ignore
        await Guard(req2, res, next)
    } catch (error) {
        expect(error.status).toBe(401)
        expect(error.message).toBe('Token invalid.')
    }

    const req3 = mockedRequest([] as any)
    try {
        // @ts-ignore
        await Guard(req3, res, next)
    } catch (error) {
        expect(error.status).toBe(401)
        expect(error.message).toBe('Token invalid.')
    }

    const req4 = mockedRequest(null)
    try {
        // @ts-ignore
        await Guard(req4, res, next)
    } catch (error) {
        expect(error.status).toBe(401)
        expect(error.message).toBe('Token invalid.')
    }

    const req5 = mockedRequest(undefined)
    try {
        // @ts-ignore
        await Guard(req5, res, next)
    } catch (error) {
        expect(error.status).toBe(401)
        expect(error.message).toBe('Token not provided.')
    }

    const req6 = mockedRequest('')
    try {
        // @ts-ignore
        await Guard(req6, res, next)
    } catch (error) {
        expect(error.status).toBe(401)
        expect(error.message).toBe('Token invalid.')
    }
})

test('should return 401 if token is not provided', async () => {
    const req = mockedRequest()
    const res = mockedResponse
    try {
        // @ts-ignore
        await Guard(req, res, next)
    } catch (error) {
        expect(error.status).toBe(401)
        expect(error.message).toBe('Token not provided.')
    }
})

test('should return 401 if token is invalid', async () => {
    const req = mockedRequest('invalid-token')
    const res = mockedResponse
    try {
        // @ts-ignore
        await Guard(req, res, next)
    } catch (error) {
        expect(error.status).toBe(401)
        expect(error.message).toBe('Token invalid.')
    }
})

test('should call next', async () => {
    const req = mockedRequest(jwt.sign({ id: 1 }, process.env.JWT_SECRET))
    const res = mockedResponse
    // @ts-ignore
    await Guard(req, res, next)
    expect(next).toBeCalled()
})
