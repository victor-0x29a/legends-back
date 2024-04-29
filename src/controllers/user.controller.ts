import { Request, Response, Router } from "express";
import { UserModel } from "../models/user.model";
import { UserService } from "../services/user.service";


class UserController {
    private Service = new UserService(UserModel)
    public readonly router = Router()

    constructor() {
        this.loadRoutes()
        console.log('UserController loaded')
    }

    private loadRoutes() {
        this.router.get('/', this.getAll)
    }

    private getAll = async (req: Request, res: Response) => {
        const users = await this.Service.findAll()
        return res.status(200).json(users)
    }
}

export { UserController }