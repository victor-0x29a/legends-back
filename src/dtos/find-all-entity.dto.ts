import { WhereOptions } from "sequelize";

export class FindAllEntityDto {
    page: number;
    perPage: number;
    filters?: WhereOptions<any>
}