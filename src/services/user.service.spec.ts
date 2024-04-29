import type { Model, ModelCtor } from "sequelize";
import { UserService } from "./user.service";

let UserModel = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findOne: jest.fn()
} as unknown as ModelCtor<Model<any, any>>

const service = new UserService(UserModel)

const hash = '$2b$10$1Q6Zz1'


describe('success', () => {
    describe('create', () => {
        it('should create a user', async () => {
            const user = {
                id: 1,
                name: 'test',
                username: 'test',
                password: 'test'
            }

            const hashedUser = {
                ...user,
                password: hash
            }

            // @ts-ignore
            UserModel.create.mockResolvedValue(hashedUser)

            // @ts-ignore
            UserModel.findOne.mockResolvedValue(null)

            const createdUser = await service.create(user)
            expect(createdUser).toEqual(hashedUser)
        })
    })
    describe('findById', () => {
        it('should find a user by id', async () => {
            const user = {
                id: 1,
                name: 'test',
                username: 'test',
                password: 'test'
            }

            // @ts-ignore
            UserModel.findOne.mockResolvedValue(user)

            const foundUser = await service.findById(1)

            expect(foundUser).toEqual(user)
        })
    })
    describe('findAll', () => {
        it('should find all users', async () => {
            const users = [{
                id: 1,
                name: 'test',
                username: 'test'
            }]

            // @ts-ignore
            UserModel.findAll.mockResolvedValue(users)

            const foundUsers = await service.findAll()

            expect(foundUsers).toEqual(users)
            expect(typeof foundUsers).toBe('object')
            expect(foundUsers.length).toBe(1)
        })
    })
    describe('update', () => {
        it('should update a user', async () => {
            const user = {
                id: 1,
                name: 'test',
                username: 'test'
            }

            // @ts-ignore
            UserModel.update.mockResolvedValue([1])

            // @ts-ignore
            UserModel.findOne.mockResolvedValue(user)

            const updatedUser = await service.update(1, user)

            expect(updatedUser).toEqual([1])
        })
        it('should update a user with password', async () => {
            const user = {
                id: 1,
                name: 'test',
                username: 'test',
                password: 'test'
            }

            const updatedUser = {
                id: 1,
                name: 'test',
                username: 'test',
                password: hash
            }

            // @ts-ignore
            UserModel.update.mockResolvedValue([1])

            // @ts-ignore
            UserModel.findOne.mockResolvedValue(user)

            const updatedUserWithPassword = await service.update(1, user)

            expect(updatedUserWithPassword).toEqual([1])
        })
    })
    describe('delete', () => {
        it('should delete a user', async () => {
            // @ts-ignore
            UserModel.findOne.mockResolvedValue({
                id: 1,
                name: 'test',
                username: 'test',
                password: 'test'
            })

            // @ts-ignore
            UserModel.destroy.mockResolvedValue(1)

            const deletedUser = await service.delete(1)

            expect(deletedUser).toBe(1)
        })
    })
})

describe('failure', () => {
    it('create', async () => {
        const user = {
            id: 1,
            name: 'test',
            username: 'test',
            password: 'test'
        }

        // @ts-ignore
        UserModel.create.mockResolvedValue(user)

        // @ts-ignore
        UserModel.findOne.mockResolvedValue(user)

        await expect(service.create(user)).rejects.toThrow('User already exists by username.')
    })
    it('findById', async () => {
        // @ts-ignore
        UserModel.findOne.mockResolvedValue(null)

        await expect(service.findById(1)).rejects.toThrow('User not found.')
    })
    it('update', async () => {
        // @ts-ignore
        UserModel.findOne.mockResolvedValue(null)

        await expect(service.update(1, {})).rejects.toThrow('User not found.')
    })
    it('delete', async () => {
        // @ts-ignore
        UserModel.findOne.mockResolvedValue(null)

        await expect(service.delete(1)).rejects.toThrow('User not found.')
    })
})
