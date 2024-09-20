import { Request, Response, Router } from "express";
import BaseController from "./base-controller";
import { User, UserModel } from "../models/";
import { UserService } from "../services/user.service";
import { idSchema, parsedIdSchema } from "../schemas/global.schema";
import { createUserSchema, signInSchema, updateUserSchema } from "../schemas/user.schema";
import { Guard } from "../web/guard";
import { parseUser } from "../parsers/user.parser";
import { SignInDto } from "../dtos/sign-in.dto";
import { LogService } from "../services/log.service";


class UserController extends BaseController {
    private Service = new UserService(UserModel)
    private LogService = new LogService()
    public readonly router = Router()

    constructor() {
        super()
        this.loadRoutes()

        if (this.getIsEnableLogging()) {
            console.log('UserController loaded')
        }
    }

    private loadRoutes() {
        this.router.get('/', Guard, this.getAll)
        this.router.get('/:id', Guard, this.getById)
        this.router.post('/', Guard, this.create)
        this.router.delete('/:id', Guard, this.remove)
        this.router.put('/:id', Guard, this.update)
        this.router.post('/sign-in', this.signIn)
    }

    private signIn = async (req: Request, res: Response) => {
        const signInData = await signInSchema.validate(req.body || {}) as unknown as SignInDto

        const token = await this.Service.signIn(signInData)

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
        const { id } = req.params

        const validatedId = await idSchema.validate(id) as unknown as parsedIdSchema

        const entity = await this.Service.findById(validatedId)

        return res.status(200).json(parseUser(entity))
    }

    private create = async (req: Request, res: Response) => {
        const entity = req.body

        const validatedEntity = await createUserSchema.validate(entity)

        const createdEntity = await this.Service.create(validatedEntity)

        const { authorization } = req.headers

        this.LogService.register('user', `${authorization} created an user`)

        return res.status(201).json(createdEntity)
    }

    private remove = async (req: Request, res: Response) => {
        const { id } = req.params

        const validatedId = await idSchema.validate(id) as unknown as parsedIdSchema

        await this.Service.delete(validatedId)

        const { authorization } = req.headers

        this.LogService.register('user', `${authorization} deleted an user with id ${validatedId}`)

        return res.status(204).send()
    }

    private update = async (req: Request, res: Response) => {
        const { id } = req.params
        const entity = req.body

        const validatedId = await idSchema.validate(id) as unknown as parsedIdSchema

        const validatedEntity = await updateUserSchema.validate(entity)

        await this.Service.update(validatedId, validatedEntity)

        const { authorization } = req.headers

        this.LogService.register('user', `${authorization} updated an user with id ${validatedId}`)

        return res.status(204).send()
    }
}

export default UserController
