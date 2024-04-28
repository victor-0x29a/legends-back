import { EntityService } from "./entity.service";
import { Model, ModelCtor } from 'sequelize'

let mockedEntityModel = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findOne: jest.fn()
} as unknown as ModelCtor<Model<any, any>>

const entityService = new EntityService(mockedEntityModel)

describe('success', () => {
    it('create', async () => {
        const entity = {
            id: 1,
            title: 'test',
            properties: [],
            description: 'test description',
            type: 'test type'
        }

        // @ts-ignore
        mockedEntityModel.findOne.mockResolvedValue(null)
        // @ts-ignore
        mockedEntityModel.create.mockResolvedValue(entity)

        const createdEntity = await entityService.create(entity)
        expect(createdEntity).toEqual(entity)
    })
    it('findAll', async () => {
        const entities = [{
            id: 1,
            title: 'test',
            image: null
        }]

        // @ts-ignore
        mockedEntityModel.findAll.mockResolvedValue(entities)

        const foundEntities = await entityService.findAll({
            page: 1,
            perPage: 10
        })
        expect(foundEntities).toEqual(entities)
        expect(foundEntities.length).toBe(1)
    })
    it('findById', async () => {
        const entity = {
            id: 1,
            title: 'test',
            properties: [],
            description: 'test description',
            type: 'test type'
        }

        // @ts-ignore
        mockedEntityModel.findByPk.mockResolvedValue(entity)

        const foundEntity = await entityService.findById(1)
        expect(foundEntity).toEqual(entity)
    })
    it('update', async () => {
        const entity = {
            id: 1,
            title: 'test',
            properties: [],
            description: 'test description',
            type: 'test type'
        }

        // @ts-ignore
        mockedEntityModel.findOne.mockResolvedValue(entity)
        // @ts-ignore
        mockedEntityModel.update.mockResolvedValue(entity)

        const updatedEntity = await entityService.update(1, entity)
        expect(updatedEntity).toEqual(entity)
    })
    it('delete', async () => {
        // @ts-ignore
        mockedEntityModel.findOne.mockResolvedValue({
            id: 1,
            title: 'test',
            properties: [],
            description: 'test description',
            type: 'test type'
        })
        // @ts-ignore
        mockedEntityModel.destroy.mockResolvedValue(1)

        const deletedEntity = await entityService.delete(1)
        expect(deletedEntity).toBe(1)
    })
})