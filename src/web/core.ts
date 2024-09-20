import express from 'express'
import type { Express } from 'express'
require("express-async-errors");
import cors from 'cors'
import bodyParser from 'body-parser'
import { controllers } from '../controllers';
import { HandlerException } from './handlerException'
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
        controllers.forEach(
            ([controller, path]) => this.app.use(path, controller)
        )
    }
}

export default WebCore
