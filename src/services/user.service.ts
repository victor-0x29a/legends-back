import { CreateUserDto } from "../dtos/create-user.dto";
import { SignInDto } from "../dtos/sign-in.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { User, UserModel } from "../models";
import { searchEntity } from "../utils/searchEntity";
import { LegendHttpError } from "../errors";
import { Auth as AuthService } from "./auth.service";


class UserService {
    constructor(private readonly userModel: typeof UserModel, private readonly applicationSecret: string = '') {}

    async signIn(signInDto: SignInDto): Promise<string> {
        const user = await searchEntity<User>(
            this.userModel,
            { username: signInDto.username },
            false,
            false
        )

        const authService = new AuthService(this.applicationSecret)

        const isPasswordMatch = await authService.comparePlainTextWithHash(
            signInDto.password,
            user?.password || ''
        )

        if ((user === null) || !isPasswordMatch) {
            throw new LegendHttpError(401, 'User or password invalid.')
        }

        authService.user = user

        const token = authService.signToken()

        return token
    }

    async create(createUserDto: CreateUserDto) {
        await searchEntity(
            this.userModel,
            { username: createUserDto.username },
            true,
            false,
            'User already exists by username.'
        )

        const authService = new AuthService()

        const passwordHash = await authService.getPasswordHash(createUserDto.password)

        return await this.userModel.create({
            ...createUserDto,
            password: passwordHash
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

        // TODO: create other route for change the password
        if (isModifingPassword) {
            const authService = new AuthService()

            updateUserDto.password = await authService.getPasswordHash(updateUserDto.password)
        }

        const isModifingUsername = updateUserDto.username !== undefined

        if (isModifingUsername) {
            await searchEntity(
                this.userModel,
                { username: updateUserDto.username },
                true,
                false,
                'User already exists by username.'
            )
        }

        return await this.userModel.update(updateUserDto, {
            where: { id },
            returning: false
        })
    }

    async delete(id: number) {
        await searchEntity(
            this.userModel,
            { id },
            false,
            true,
            'User not found.'
        )

        return await this.userModel.destroy({
            where: { id }
        })
    }
}

export { UserService }
