import { Router, Request, Response } from "express";
import { idSchema, paginationSchema, parsedIdSchema, parsedPaginationSchema } from "../schemas/global.schema";
import { EntityService } from "../services/entity.service";
import { EntityModel } from "../models/entity.model";
import { createEntitySchema, findAllFilters, parsedFiltersSchema, updateSchema } from "../schemas/entity.schema";
import { Guard } from "../web/guard";


class EntityController {
    private Service = new EntityService(EntityModel)
    public readonly router = Router()

    constructor() {
        this.loadRoutes()
        console.log('EntityController loaded')
    }

    private loadRoutes() {
        this.router.get('/', this.getAll)
        this.router.get('/:id', this.getById)
        this.router.delete('/:id', this.delete, Guard)
        this.router.put('/:id', this.update, Guard)
        this.router.post('/', this.create, Guard)
    }

    private getAll = async (req: Request, res: Response) => {
        const { page, perPage, ...others } = req.query

        const filters = Object.keys(others || []).reduce((acc, key) => {
            acc[key] = others[key]
            return acc
        }, {})

        const hasFilters = Object.keys(filters).length > 0

        let validatedFilters;

        if (hasFilters) {
            validatedFilters = await findAllFilters.validate(filters) as unknown as parsedFiltersSchema
        }

        const pagination = await paginationSchema.validate({ page, perPage }) as unknown as parsedPaginationSchema

        const entities = await this.Service.findAll({
            ...pagination,
            filters: hasFilters ? validatedFilters : undefined
        })

        return res.status(200).json(entities)
    }

    private getById = async (req: Request, res: Response) => {
        const { id } = req.params

        const validatedId = await idSchema.validate(id) as unknown as parsedIdSchema

        const entity = await this.Service.findById(validatedId)

        return res.status(200).json(entity)
    }

    private delete = async (req: Request, res: Response) => {
        const { id } = req.params

        const validatedId = await idSchema.validate(id) as unknown as parsedIdSchema

        await this.Service.delete(validatedId)

        return res.status(204).json({})
    }

    private update = async (req: Request, res: Response) => {
        const { id } = req.params
        const entity = req.body

        const validatedId = await idSchema.validate(id) as unknown as parsedIdSchema

        const updateData = await updateSchema.validate(entity)

        await this.Service.update(validatedId, updateData)

        return res.status(204).json({})
    }

    private create = async (req: Request, res: Response) => {
        const entity = req.body

        const validatedEntity = await createEntitySchema.validate(entity)

        await this.Service.create(validatedEntity)

        return res.status(201).json(entity)
    }
}

export default EntityController;