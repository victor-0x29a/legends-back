import { Entity, EntityModel } from '../src/models/entity.model';
import { faker } from '@faker-js/faker'
import { User, UserModel } from '../src/models/user.model';
import * as bcrypt from 'bcrypt'

export const createEntity = async () => {
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
