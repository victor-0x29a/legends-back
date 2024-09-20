import { faker } from '@faker-js/faker'
import { LogModel, Entity, EntityModel, User, UserModel } from '../src/models';
import * as bcrypt from 'bcrypt'

export const createEntity = async () => {
    await EntityModel.sync({ force: true })
    const createdEntity = await EntityModel.create({
        "title": faker.string.uuid(),
        "properties": {
            "strength": 10
        },
        "description": "Lorem lorem lorem",
        "author": "John Doe",
        "image": {
            "src": "url",
            "alt": "alt"
            },
        "sections": "markdown content",
        "type": "item"
    }) as unknown as Entity
    return createdEntity
}

export const createUser = async () => {
    const hashedPassword = await bcrypt.hash(faker.internet.password(), 10)
    const createdUser = await UserModel.create({
        "username": faker.internet.userName(),
        "password": hashedPassword
    })
    return createdUser as unknown as User
}

export const findUser = async (id: number) => {
    const foundUser = await UserModel.findOne({
        where: {
            id
        }
    })
    return foundUser as unknown as User | null
}

export const createLog = async (customType: null | any = null) => {
    const createdLog = await LogModel.create({
        "type": customType || faker.string.uuid(),
        "content": "test"
    })
    return createdLog
}
