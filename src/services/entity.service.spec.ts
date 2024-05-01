import { EntityService } from "./entity.service";
import { Model, ModelCtor } from 'sequelize'

let mockedEntityModel = {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
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
    describe('findAll', () => {
        test('should return all entities with just pagination', async () => {
            const entities = [{
                id: 1,
                title: 'test',
                image: null
            }]

            // @ts-ignore
            mockedEntityModel.findAndCountAll.mockResolvedValue({
                rows: entities,
                count: 1
            })

            const foundEntities = await entityService.findAll({
                page: 1,
                perPage: 10
            })
            expect(foundEntities.rows).toEqual(entities)
            expect(foundEntities.rows.length).toBe(1)
        })
        test('should return all entities with pagination and filters', async () => {
            const entities = [{
                id: 1,
                title: 'test',
                image: null
            }]

            // @ts-ignore
            mockedEntityModel.findAndCountAll.mockResolvedValue({
                rows: entities,
                count: 1
            })

            const foundEntities = await entityService.findAll({
                page: 1,
                perPage: 10,
                filters: {
                    title: 'test'
                }
            })
            expect(foundEntities.rows).toEqual(entities)
            expect(foundEntities.rows.length).toBe(1)
        })
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
        mockedEntityModel.findOne.mockResolvedValue(entity)

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

describe('failure', () => {
    it('create', async () => {
        const entity = {
            id: 1,
            title: 'test',
            properties: [],
            description: 'test description',
            type: 'test type'
        }

        // @ts-ignore
        mockedEntityModel.findOne.mockResolvedValue(entity)

        try {
            await entityService.create(entity)
        } catch (error) {
            expect(error.message).toBe('Entity already exists by title.')
        }
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
        mockedEntityModel.findOne.mockResolvedValue(null)

        try {
            await entityService.update(1, entity)
        } catch (error) {
            expect(error.message).toBe('Entity not found.')
        }
    })
    it('delete', async () => {
        // @ts-ignore
        mockedEntityModel.findOne.mockResolvedValue(null)

        try {
            await entityService.delete(1)
        } catch (error) {
            expect(error.message).toBe('Entity not found.')
        }
    })
    it('findById', async () => {
        // @ts-ignore
        mockedEntityModel.findOne.mockResolvedValue(null)

        try {
            await entityService.findById(1)
        } catch (error) {
            expect(error.message).toBe('Entity not found.')
        }
    })
})
