import type { Express } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import { Router } from 'express'
import EntityController from '../controllers/entity.controller'

class WebCore {
    constructor(private readonly port: number, private readonly app: Express) {}

    public start(): void {
        this.loadMiddlewares()
        this.loadRoutes()
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
    }
}

export default WebCore