import { isEnableLogging } from "../constants";
import { FindLogDto } from "../dtos/find-log-dto";
import { LogModel } from "../models/";

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
    find ({
        type = null,
        pagination
    }: FindLogDto) {
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
