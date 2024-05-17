import { Router, Request, Response } from "express"
import ApiCache from "apicache"
import { Guard } from "../web/guard"
import { LogService } from "../services/log.service"
import { isEnableLogging } from "../constants"
import { paginationSchema, parsedPaginationSchema } from "../schemas/global.schema"
import { buildPaginationResponse } from "../utils/buildPaginationResponse"
import { Log } from "../models/logs/log.model"
import { Model } from "sequelize"

ApiCache.options({
    defaultDuration: '60 minutes'
})

class LogController {
    private Service = new LogService()
    public readonly router = Router()

    constructor() {
        this.loadRoutes()
        if (isEnableLogging) {
            console.log('LogController loaded')
        }
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
