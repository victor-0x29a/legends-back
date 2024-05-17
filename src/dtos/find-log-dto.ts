import { parsedPaginationSchema } from "../schemas/global.schema"

export class FindLogDto {
    type?: string | null
    pagination: parsedPaginationSchema
}
