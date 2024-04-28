import type { Router, Request, Response } from "express";
import { idSchema, paginationSchema, parsedIdSchema, parsedPaginationSchema } from "../schemas/global.schema";
import { EntityService } from "../services/entity.service";
import { EntityModel } from "../models/entity.model";
import { LegendHttpError } from "../web/errors";


class EntityController {
    private Service = new EntityService(EntityModel)

    constructor(private readonly router: Router) {
        this.loadRoutes()
    }

    private loadRoutes() {
        this.router.get('/', this.getAll)
        this.router.get('/:id', this.getById)
    }

    private getAll = async (req: Request, res: Response) => {
        const { page, perPage } = req.query

        const pagination = await paginationSchema.validate({ page, perPage }) as unknown as parsedPaginationSchema

        const entities = await this.Service.findAll(pagination)

        return res.status(200).json(entities)
    }

    private getById = async (req: Request, res: Response) => {
        const { id } = req.params

        const validatedId = await idSchema.validate(id) as unknown as parsedIdSchema

        const entity = await this.Service.findById(validatedId)

        if (!entity) {
            throw new LegendHttpError(404, 'Entity not found.')
        }

        return res.status(200).json(entity)
    }
}

export default EntityController;