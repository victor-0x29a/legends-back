import { LogModel } from "../models/logs/log.model";
import { parsedPaginationSchema } from "../schemas/global.schema";

class LogService {
    async register (type: string, content: string) {
        try {
            return await LogModel.create({ type, content })
        } catch (error) {
            console.error(error)
        }
    }
    find (type: string | null = null, pagination: parsedPaginationSchema) {
        return LogModel.findAndCountAll({
            limit: pagination.perPage,
            offset: (pagination.page - 1) * pagination.perPage,
            attributes: ['type', 'content', 'createdAt'],
            order: [['createdAt', 'DESC']],
            ...(type && { where: {
                type
            } })
        })
    }
}

export { LogService }
