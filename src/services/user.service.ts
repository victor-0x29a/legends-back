import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { UserModel } from "../models/user.model";
import { searchEntity } from "../utils/searchEntity";
import * as bcrypt from 'bcrypt'


class UserService {
    constructor(private readonly userModel: typeof UserModel) {}

    async create(createUserDto: CreateUserDto) {
        await searchEntity(this.userModel, { username: createUserDto.username }, true, false, 'User already exists by username.')
        const salts = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(createUserDto.password, salts)
        return await this.userModel.create({
            ...createUserDto,
            password: hashedPassword
        })
    }

    async findAll() {
        return await this.userModel.findAll({
            attributes: ['id', 'name', 'username']
        })
    }

    async findById(id: number) {
        return await searchEntity(this.userModel, { id }, false, true, 'User not found.')
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        await searchEntity(this.userModel, { id }, false, true, 'User not found.')

        const isModifingPassword = updateUserDto.password !== undefined

        if (isModifingPassword) {
            const salts = await bcrypt.genSalt()
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, salts)
        }

        return await this.userModel.update(updateUserDto, {
            where: { id },
            returning: false
        })
    }

    async delete(id: number) {
        await searchEntity(this.userModel, { id }, false, true, 'User not found.')
        return await this.userModel.destroy({
            where: { id }
        })
    }
}

export { UserService }