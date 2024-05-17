import { isEnableLogging } from "../constants";
import { Log, LogModel } from "../models/logs/log.model";
import { parsedPaginationSchema } from "../schemas/global.schema";

class LogService {
    async register (type: string, content: string): Promise<void> {
        try {
            await LogModel.create({ type, content })
        } catch (error) {
            if (isEnableLogging) {
                console.error(error)
            }
        }
    }
    find (type: string | null = null, pagination: parsedPaginationSchema): Promise<Log & { createdAt: string }> {
        return LogModel.findAndCountAll({
            limit: pagination.perPage,
            offset: (pagination.page - 1) * pagination.perPage,
            attributes: ['type', 'content', 'createdAt'],
            order: [['createdAt', 'DESC']],
            ...(type && { where: {
                type
            } })
        }) as unknown as Promise<Log & { createdAt: string }>
    }
}

export { LogService }
