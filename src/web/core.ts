import express from 'express'
import type { Express } from 'express'
require("express-async-errors");
import cors from 'cors'
import bodyParser from 'body-parser'
import EntityController from '../controllers/entity.controller'
import { HandlerException } from './handlerException'
import { UserController } from '../controllers/user.controller';
import LogController from '../controllers/logs.controller';
import { EnvironmentService } from '../services';
import { EnvironmentVars } from '../interfaces';

class WebCore extends EnvironmentService {
    public readonly app: Express = express()

    constructor() {
        const environmentInterface = process.env as unknown as EnvironmentVars
        super(environmentInterface)

        this.loadMiddlewares()
        this.loadRoutes()
        this.app.use(HandlerException);
    }

    public start(): void {
        const httpPort = this.getPort()

        this.app.listen(httpPort, () => {
            console.log(`Server is running on port ${httpPort}`)
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
