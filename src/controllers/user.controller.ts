import { Request, Response, Router } from "express";
import { User, UserModel } from "../models/user.model";
import { UserService } from "../services/user.service";
import { idSchema, parsedIdSchema } from "../schemas/global.schema";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema";
import { Guard } from "../web/guard";
import { parseUser } from "../parsers/user.parser";
import { isEnableLogging } from "../constants";


class UserController {
    private Service = new UserService(UserModel)
    public readonly router = Router()

    constructor() {
        this.loadRoutes()
        if (isEnableLogging) {
            console.log('UserController loaded')
        }
    }

    private loadRoutes() {
        this.router.get('/', this.getAll, Guard)
        this.router.get('/:id', this.getById, Guard)
        this.router.post('/', this.create, Guard)
        this.router.delete('/:id', this.remove, Guard)
        this.router.put('/:id', this.update, Guard)
    }

    private getAll = async (req: Request, res: Response) => {
        const users = await this.Service.findAll() as unknown as User[]

        const parsedUsers = users.map(parseUser)

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

        return res.status(201).json(createdEntity)
    }

    private remove = async (req: Request, res: Response) => {
        const { id } = req.params

        const validatedId = await idSchema.validate(id) as unknown as parsedIdSchema

        await this.Service.delete(validatedId)

        return res.status(204).send()
    }

    private update = async (req: Request, res: Response) => {
        const { id } = req.params
        const entity = req.body

        const validatedId = await idSchema.validate(id) as unknown as parsedIdSchema

        const validatedEntity = await updateUserSchema.validate(entity)

        await this.Service.update(validatedId, validatedEntity)

        return res.status(204).send()
    }
}

export { UserController }
