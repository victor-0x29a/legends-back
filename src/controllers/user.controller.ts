import { Request, Response, Router } from "express";
import { UserModel } from "../models/user.model";
import { UserService } from "../services/user.service";
import { idSchema, parsedIdSchema } from "../schemas/global.schema";


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
}

export { UserController }