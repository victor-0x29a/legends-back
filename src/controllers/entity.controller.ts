import type { Router, Request, Response } from "express";
import { paginationSchema, parsedPaginationSchema } from "../schemas/global.schema";
import { EntityService } from "../services/entity.service";
import { EntityModel } from "../models/entity.model";


class EntityController {
    private Service = new EntityService(EntityModel)

    constructor(private readonly router: Router) {
        this.loadRoutes()
    }

    private loadRoutes() {
        this.router.get('/', this.getAll)
    }

    private getAll = async (req: Request, res: Response) => {
        const { page, perPage } = req.query

        const pagination = await paginationSchema.validate({ page, perPage }) as unknown as parsedPaginationSchema

        const entities = await this.Service.findAll(pagination)

        return res.status(200).json(entities)
    }
}

export default EntityController;