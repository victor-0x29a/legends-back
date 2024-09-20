import { LogModel } from "../models/";
import { LogService } from "./log.service";

afterEach(async () => {
    await LogModel.destroy({
        where: {}
    })
})

const service = new LogService()

describe('register', () => {
    test('should register a log', async () => {
        const registeredLog = await service.register('test', 'test')

        expect(registeredLog).toBeUndefined()
    })

    test('should not brake if an error occurs', async () => {
        // @ts-ignore
        const registeredLog = await service.register({}, 'test')

        expect(registeredLog).toBeUndefined()
    })
})

describe('find', () => {
    test('find an existing log', async () => {
        await service.register('test', 'test')

        const existsLogs = await service.find({
            type: 'test',
            pagination: {
                page: 1,
                perPage: 10
            }
        })

        expect(existsLogs).toBeDefined()
        expect(existsLogs.count).toEqual(1)
    })

    test('find an existing log without type', async () => {
        await service.register('test', 'test')

        const existsLogs = await service.find({
            pagination: {
                page: 1,
                perPage: 10
            }
        })

        expect(existsLogs).toBeDefined()
        expect(existsLogs.count).toEqual(1)
    })

    test('find an non-existing log', async () => {
        const existsLogs = await service.find({
            type: 'test',
            pagination: {
                page: 1,
                perPage: 10
            }
        })

        expect(existsLogs).toBeDefined()
        expect(existsLogs.count).toEqual(0)
    })
})
