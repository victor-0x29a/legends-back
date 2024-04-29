import { Entity, EntityModel } from '../src/models/entity.model';
import { faker } from '@faker-js/faker'

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
