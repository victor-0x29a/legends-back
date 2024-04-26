import type { Express } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

class WebCore {
    constructor(private readonly port: number, private readonly app: Express) {}

    public start(): void {
        this.loadMiddlewares()
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`)
        })
    }

    private loadMiddlewares(): void {
        this.app.use(cors({ origin: '*' }))
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }))
    }
}

export default WebCore