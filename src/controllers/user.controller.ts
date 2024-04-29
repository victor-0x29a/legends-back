import { Request, Response, Router } from "express";
import { User, UserModel } from "../models/user.model";
import { UserService } from "../services/user.service";
import { idSchema, parsedIdSchema } from "../schemas/global.schema";
import { createEntitySchema } from "../schemas/entity.schema";


class UserController {
    private Service = new UserService(UserModel)
    public readonly router = Router()

    constructor() {
        this.loadRoutes()
        console.log('UserController loaded')
    }

    private loadRoutes() {
        this.router.get('/', this.getAll)
        this.router.get('/:id', this.getById)
        this.router.post('/', this.create)
        this.router.delete('/:id', this.remove)
    }

    private getAll = async (req: Request, res: Response) => {
        const users = await this.Service.findAll()
        return res.status(200).json(users)
    }

    private getById = async (req: Request, res: Response) => {
        const { id } = req.params

        const validatedId = await idSchema.validate(id) as unknown as parsedIdSchema

        const entity = await this.Service.findById(validatedId)

        return res.status(200).json(entity)
    }

    private create = async (req: Request, res: Response) => {
        const entity = req.body

        const validatedEntity = await createEntitySchema.validate(entity) as Partial<User>

        const createdEntity = await this.Service.create(validatedEntity)

        return res.status(201).json(createdEntity)
    }

    private remove = async (req: Request, res: Response) => {
        const { id } = req.params

        const validatedId = await idSchema.validate(id) as unknown as parsedIdSchema

        await this.Service.delete(validatedId)

        return res.status(204).send()
    }
}

export { UserController }