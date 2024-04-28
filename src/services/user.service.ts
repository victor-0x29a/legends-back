import { CreateUserDto } from "../dtos/create-user.dto";
import { UserModel } from "../models/user.model";
import { searchEntity } from "../utils/searchEntity";


class UserService {
    constructor(private readonly userModel: typeof UserModel) {}

    async create(createUserDto: CreateUserDto) {
        await searchEntity(this.userModel, { username: createUserDto.username }, true, false, 'User already exists by username.')
        return await this.userModel.create(createUserDto)
    }

    async findAll() {
        return await this.userModel.findAll({
            attributes: ['id', 'name', 'username']
        })
    }
}

export { UserService }