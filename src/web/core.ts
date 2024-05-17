import type { Express } from 'express'
require("express-async-errors");
import cors from 'cors'
import bodyParser from 'body-parser'
import EntityController from '../controllers/entity.controller'
import { HandlerException } from './handlerException'
import { UserController } from '../controllers/user.controller';
import LogController from '../controllers/logs.controller';

class WebCore {
    constructor(private readonly port: number, public readonly app: Express) {
        this.loadMiddlewares()
        this.loadRoutes()
        this.app.use(HandlerException);
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`)
        })
    }

    private loadMiddlewares(): void {
        this.app.use(cors({ origin: '*' }))
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }))
    }

    private loadRoutes(): void {
        this.app.use('/entity', new EntityController().router)
        this.app.use('/user', new UserController().router)
        this.app.use('/log', new LogController().router)
    }
}

export default WebCore
