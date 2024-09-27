import { Request, Response, Router } from "express";
import BaseController from "./base-controller";
import { Guard } from "../middlewares";
import { ValidateSchema } from "../middlewares";
import { User, UserModel } from "../models/";
import { UserService } from "../services/user.service";
import { idSchema, parsedIdSchema } from "../schemas/global.schema";
import { createUserSchema, signInSchema, updateUserSchema } from "../schemas/user.schema";
import { parseUser } from "../parsers/user.parser";
import { SignInDto } from "../dtos/sign-in.dto";
import { BaseRequest } from "./types";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { validateSchema } from "../utils/validateSchema";

class UserController extends BaseController {
    public readonly router = Router()

    constructor() {
        super()
        this.loadRoutes()

        if (this.getIsEnableLogging()) {
            console.log('UserController loaded')
        }
    }

    private Service = new UserService(UserModel, this.getApplicationSecret())

    private loadRoutes() {
        this.router.get('/', Guard, this.getAll)
        this.router.get('/:id', Guard, this.getById)
        this.router.post('/', Guard, ValidateSchema(createUserSchema), this.create)
        this.router.delete('/:id', Guard, this.remove)
        this.router.put('/:id', Guard, ValidateSchema(updateUserSchema), this.update)
        this.router.post('/sign-in', Guard, ValidateSchema(signInSchema), this.signIn)
    }

    private signIn = async (req: BaseRequest<SignInDto>, res: Response) => {
        const token = await this.Service.signIn(req.body)

        return res.status(200).json({ token })
    }

    private getAll = async (req: Request, res: Response) => {
        const {
            rows
        } = await this.Service.findAll() as unknown as {
            count: number,
            rows: User[]
        }

        const parsedUsers = rows.map(parseUser)

        return res.status(200).json(parsedUsers)
    }

    private getById = async (req: Request, res: Response) => {
        const id = await validateSchema<string, number>(idSchema, req.params?.id)

        const entity = await this.Service.findById(id)

        return res.status(200).json(parseUser(entity))
    }

    private create = async (req: BaseRequest<CreateUserDto>, res: Response) => {
        const createdEntity = await this.Service.create(req.body)

        return res.status(201).json(createdEntity)
    }

    private remove = async (req: Request, res: Response) => {
        const id = await validateSchema<string, number>(idSchema, req.params?.id)

        await this.Service.delete(id)

        return res.status(204).send()
    }

    private update = async (req: BaseRequest<UpdateUserDto, any, any>, res: Response) => {
        const id = await validateSchema<string, parsedIdSchema>(idSchema, req.params.id)

        await this.Service.update(id, req.body)

        return res.status(204).send()
    }
}

export default UserController
