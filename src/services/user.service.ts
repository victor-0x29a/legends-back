import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
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

    async findById(id: number) {
        return await searchEntity(this.userModel, { id }, false, true)
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        await searchEntity(this.userModel, { id }, false, true)
        return await this.userModel.update(updateUserDto, {
            where: { id },
            returning: false
        })
    }
}

export { UserService }