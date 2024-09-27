import { Router, Request, Response } from "express";
import ApiCache from 'apicache'
import BaseController from "./base-controller";
import { ValidateSchema } from "./middlewares";
import { Guard } from "../web/guard";
import { EntityService } from "../services/entity.service";
import { LogService } from "../services/log.service";
import { idSchema, paginationSchema, parsedIdSchema, parsedPaginationSchema } from "../schemas/global.schema";
import { EntityModel } from "../models";
import { createEntitySchema, findAllFilters, parsedFiltersSchema, updateSchema } from "../schemas/entity.schema";
import { buildPaginationResponse } from "../utils/buildPaginationResponse";
import { BaseRequest } from "./types";
import { CreateEntityDto } from "../dtos/create-entity.dto";
import { UpdateEntityDto } from "../dtos/update-entity.dto";


class EntityController extends BaseController {
    private Service = new EntityService(EntityModel)
    private LogService = new LogService()
    public readonly router = Router()

    constructor() {
        super()
        this.loadRoutes()

        if (this.getIsEnableLogging()) {
            console.log('EntityController loaded')
        }

        ApiCache.options({
            enabled: !this.getIsTestingEnvironment()
        })
    }

    private loadRoutes() {
        this.router.get('/', ApiCache.middleware('5 minutes'), this.getAll)
        this.router.get('/:id', this.getById)
        this.router.delete('/:id', Guard, this.delete)
        this.router.put('/:id', Guard, ValidateSchema(updateSchema), this.update)
        this.router.post('/', Guard, ValidateSchema(createEntitySchema), this.create)
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

        const {
            count,
            rows
        } = await this.Service.findAll({
            ...pagination,
            filters: hasFilters ? validatedFilters : undefined
        })

        const response = buildPaginationResponse(count, pagination.perPage, pagination.page, rows)

        return res.status(200).json(response)
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

        const { authorization } = req.headers

        this.LogService.register('entity', `${authorization} deleted the entity with id ${validatedId}`)

        return res.status(204).json({})
    }

    private update = async (req: BaseRequest<UpdateEntityDto>, res: Response) => {
        const { id } = req.params
        const validatedId = await idSchema.validate(id) as unknown as parsedIdSchema

        await this.Service.update(validatedId, req.body)

        const { authorization } = req.headers

        this.LogService.register('entity', `${authorization} updated the entity with id ${validatedId}`)

        return res.status(204).json({})
    }

    private create = async (req: BaseRequest<CreateEntityDto>, res: Response) => {
        const entityData = req.body

        await this.Service.create(entityData)

        const { authorization } = req.headers

        this.LogService.register('entity', `${authorization} created an entity with title ${entityData.title}`)

        return res.status(201).json(entityData)
    }
}

export default EntityController;
