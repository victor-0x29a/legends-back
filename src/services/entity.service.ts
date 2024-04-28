import { Entity, EntityModel } from "../models/entity.model";
import { searchEntity } from "../utils/searchEntity";
import { FindAllEntityDto } from "../dtos/find-all-entity.dto";


class EntityService {
    constructor (private readonly entityModel: typeof EntityModel) {}

    async create (entity: Entity) {
        await searchEntity(this.entityModel, { title: entity.title }, true, false, 'Entity already exists by title.')
        return await this.entityModel.create(entity)
    }

    async findAll (findAllEntityDto: FindAllEntityDto) {
        return await this.entityModel.findAll({
            limit: findAllEntityDto.perPage,
            offset: (findAllEntityDto.page - 1) * findAllEntityDto.perPage,
            attributes: ['id', 'title', 'image']
        })
    }

    async findById (id: number) {
        return await this.entityModel.findByPk(id)
    }

    async update (id: number, entity: Entity) {
        await searchEntity(this.entityModel, { id }, false, true)
        return await this.entityModel.update(entity, {
            where: { id }
        })
    }

    async delete (id: number) {
        await searchEntity(this.entityModel, { id }, false, true)
        return await this.entityModel.destroy({
            where: { id }
        })
    }
}

export { EntityService }