import type { Model, ModelCtor } from "sequelize";
import { UserService } from "./user.service";
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

let UserModel = {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findOne: jest.fn()
} as unknown as ModelCtor<Model<any, any>>

const service = new UserService(UserModel, 'key')

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
            UserModel.findAndCountAll.mockResolvedValue({
                rows: users,
                count: 1
            })

            const foundUsers = await service.findAll()

            expect(foundUsers.rows.length).toBe(1)
            expect(foundUsers.rows).toEqual(users)
            expect(typeof foundUsers).toBe('object')
        })
    })
    describe('update', () => {
        it('should update a user', async () => {
            const user = {
                id: 1,
                name: 'test'
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
                password: 'test'
            }

            // @ts-ignore
            UserModel.update.mockResolvedValue([1])

            // @ts-ignore
            UserModel.findOne.mockResolvedValue(user)

            const updatedUserWithPassword = await service.update(1, user)

            expect(updatedUserWithPassword).toEqual([1])
        })
        it('should not update an user with an username that already exists', async () => {
            const user = {
                id: 1,
                name: 'test',
                username: 'test',
                password: 'test'
            }

            // @ts-ignore
            UserModel.update.mockResolvedValue([1])

            // @ts-ignore
            UserModel.findOne.mockResolvedValue(user)

            await expect(service.update(1, {
                id: 1,
                name: 'test',
                username: 'test1',
                password: 'test'
            })).rejects.toThrow('User already exists by username.')
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
    describe('signIn', () => {
        it('should sign in a user', async () => {
            const passwordHashed = await bcrypt.hash('test', 10)

            const user = {
                id: 1,
                name: 'test',
                username: 'test',
                password: passwordHashed
            }

            // @ts-ignore
            UserModel.findOne.mockResolvedValue(user)

            const token = await service.signIn({
                username: 'test',
                password: 'test'
            })

            expect(typeof token).toBe('string')

            const decodedToken = jwt.decode(token) as {
                id: number,
                username: string
            }

            expect(decodedToken.username).toBeDefined()
            expect(decodedToken.id).toBeDefined()
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
    describe('signIn', () => {
        it('should throw an error when user not found', async () => {
            // @ts-ignore
            UserModel.findOne.mockResolvedValue(null)

            await expect(service.signIn({
                username: 'test',
                password: 'test'
            })).rejects.toThrow('User or password invalid.')
        })
        it('should throw an error when password does not match', async () => {
            const passwordHashed = await bcrypt.hash('test', 10)

            const user = {
                id: 1,
                name: 'test',
                username: 'test',
                password: passwordHashed
            }

            // @ts-ignore
            UserModel.findOne.mockResolvedValue(user)

            await expect(service.signIn({
                username: 'test',
                password: 'test1'
            })).rejects.toThrow('User or password invalid.')
        })
    })
})
