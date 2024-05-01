import { EntityModel } from "../models/entity.model";
import { searchEntity } from "../utils/searchEntity";
import { FindAllEntityDto } from "../dtos/find-all-entity.dto";
import { UpdateEntityDto } from "../dtos/update-entity.dto";
import { CreateEntityDto } from "../dtos/create-entity.dto";


class EntityService {
    constructor (private readonly entityModel: typeof EntityModel) {}

    async create (entity: CreateEntityDto) {
        await searchEntity(this.entityModel, { title: entity.title }, true, false, 'Entity already exists by title.')
        return await this.entityModel.create(entity)
    }

    async findAll (findAllEntityDto: FindAllEntityDto) {
        return await this.entityModel.findAndCountAll({
            limit: findAllEntityDto.perPage,
            offset: (findAllEntityDto.page - 1) * findAllEntityDto.perPage,
            attributes: ['id', 'title', 'image'],
            ...(findAllEntityDto?.filters && { where: findAllEntityDto.filters })
        })
    }

    async findById (id: number) {
        return await searchEntity(this.entityModel, { id }, false, true)
    }

    async update (id: number, entity: UpdateEntityDto) {
        await searchEntity(this.entityModel, { id }, false, true)
        return await this.entityModel.update(entity, {
            where: { id },
            returning: false
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
