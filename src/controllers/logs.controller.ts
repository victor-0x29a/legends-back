import { Router, Request, Response } from "express"
import ApiCache from "apicache"
import BaseController from "./base-controller"
import { Guard } from "../web/guard"
import { LogService } from "../services/log.service"
import { paginationSchema, parsedPaginationSchema } from "../schemas/global.schema"
import { buildPaginationResponse } from "../utils/buildPaginationResponse"
import { Log } from "../models"
import { Model } from "sequelize"


class LogController extends BaseController {
    private Service = new LogService()
    public readonly router = Router()

    constructor() {
        super()
        this.loadRoutes()

        if (this.getIsEnableLogging()) {
            console.log('LogController loaded')
        }

        ApiCache.options({
            enabled: !this.getIsTestingEnvironment()
        })
    }

    private loadRoutes() {
        this.router.get('/', Guard, ApiCache.middleware(), this.getAll)
    }

    private getAll = async (req: Request, res: Response) => {
        const { page, perPage, type } = req.query

        const pagination = await paginationSchema.validate({ page, perPage }) as unknown as parsedPaginationSchema

        const {
            count,
            rows
        } = await this.Service.find({
            pagination: pagination,
            type: (type ? String(type) : null)
        })

        const parsedRows = rows.map((logEntity: Model<Log, Log>) => ({
            type: logEntity.dataValues.type,
            content: logEntity.dataValues.content,
            createdAt: logEntity.getDataValue('createdAt' as keyof Log),
        }))

        const response = buildPaginationResponse(count, pagination.perPage, pagination.page, parsedRows)

        return res.status(200).json(response)
    }
}

export default LogController
