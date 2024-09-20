import dotenv from "dotenv";
import { SequelizeAuth, LogsSequelizeAuth } from "./database/connection"
import { EntityModel } from "./models/entity.model";
import { UserModel } from "./models/user.model";
import WebCore from "./web/core";

dotenv.config({
    path: './.env'
})

LogsSequelizeAuth

function loadEntities (core: WebCore) {
    EntityModel.sync({
        force: core.getIsTestingEnvironment(),
        logging: core.getIsEnableLogging()
    })
    UserModel.sync({
        force: core.getIsTestingEnvironment(),
        logging: core.getIsEnableLogging()
    })

}

SequelizeAuth.then(() => {
    const Core = new WebCore()

    loadEntities(Core)

    Core.start()
}).catch(() => {
    throw new Error("Failed to connect to the database.")
})
