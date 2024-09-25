import { CreateUserDto } from "../dtos/create-user.dto";
import { SignInDto } from "../dtos/sign-in.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { User, UserModel } from "../models";
import { searchEntity } from "../utils/searchEntity";
import * as bcrypt from 'bcrypt'
import { LegendHttpError } from "../web/errors";
import { Auth as AuthService } from "./auth.service";


class UserService {
    constructor(private readonly userModel: typeof UserModel, private readonly applicationSecret: string = '') {}

    async signIn(signInDto: SignInDto): Promise<string> {
        const user = await searchEntity<User>(this.userModel, { username: signInDto.username }, false, false)

        const isPasswordMatch = await bcrypt.compare(
            signInDto.password,
            user?.password || ''
        )

        if ((user === null) || !isPasswordMatch) {
            throw new LegendHttpError(401, 'User or password invalid.')
        }

        const auth = new AuthService(user, this.applicationSecret)

        const token = auth.signToken()

        return token
    }

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
        return await this.userModel.findAndCountAll({
            attributes: ['id', 'name', 'username']
        })
    }

    async findById(id: number) {
        return await searchEntity<User>(this.userModel, { id }, false, true, 'User not found.')
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        await searchEntity(this.userModel, { id }, false, true, 'User not found.')

        const isModifingPassword = updateUserDto.password !== undefined

        if (isModifingPassword) {
            const salts = await bcrypt.genSalt()
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, salts)
        }

        const isModifingUsername = updateUserDto.username !== undefined

        if (isModifingUsername) {
            await searchEntity(this.userModel, { username: updateUserDto.username }, true, false, 'User already exists by username.')
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
