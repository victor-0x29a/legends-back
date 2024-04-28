import { searchEntity } from './searchEntity';
import { Model, ModelCtor } from 'sequelize'

let mockedEntityModel = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findOne: jest.fn()
} as unknown as ModelCtor<Model<any, any>>

const entity = {
    id: 1,
    title: 'test',
    properties: [],
    description: 'test description',
    type: 'test type'
}

describe('should have a common behavior', () => {
    it('should throw if exists', async () => {
        // @ts-ignore
        mockedEntityModel.findOne.mockResolvedValue(entity)

        await expect(searchEntity(mockedEntityModel, { title: entity.title }, true, false, 'Entity already exists by title.'))
            .rejects
            .toThrow('Entity already exists by title.')
    })
    it('should throw if not exists', async () => {
        // @ts-ignore
        mockedEntityModel.findOne.mockResolvedValue(null)

        await expect(searchEntity(mockedEntityModel, { title: entity.title }, false, true))
            .rejects
            .toThrow('Entity not found.')
    })
    it('should pass if exists', async () => {
        // @ts-ignore
        mockedEntityModel.findOne.mockResolvedValue(entity)

        await expect(searchEntity(mockedEntityModel, { title: entity.title }, false, false))
            .resolves
            .toBeDefined()
    })
    it('should pass if not exists', async () => {
        // @ts-ignore
        mockedEntityModel.findOne.mockResolvedValue(entity)

        await expect(searchEntity(mockedEntityModel, { title: entity.title }, false, false))
            .resolves
            .toBeDefined()
    })
})

describe('should have a custom behavior', () => {
    it('should throw if exists', async () => {
        // @ts-ignore
        mockedEntityModel.findOne.mockResolvedValue(entity)

        await expect(searchEntity(mockedEntityModel, { title: entity.title }, true, false, 'A custom error message.'))
            .rejects
            .toThrow('A custom error message.')
    })
    it('should throw if not exists', async () => {
        // @ts-ignore
        mockedEntityModel.findOne.mockResolvedValue(null)

        await expect(searchEntity(mockedEntityModel, { title: entity.title }, false, true, 'A custom error message.'))
            .rejects
            .toThrow('A custom error message.')
    })
})