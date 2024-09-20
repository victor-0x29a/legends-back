import dotenv from "dotenv";
import { SequelizeAuth, LogsSequelizeAuth } from "./database/connection"
import { UserModel, EntityModel, LogModel } from "./models";
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
    LogModel.sync({
        force: core.getIsTestingEnvironment(),
        logging: core.getIsEnableLogging()
    })
}

const authenticateOrm = (callback: () => void) => {
    SequelizeAuth.then(() => {
        callback()
    }).catch(() => {
        throw new Error("Failed to connect to the database.")
    })
}

function startServer () {
    const Core = new WebCore()

    loadEntities(Core)

    Core.start()
}

authenticateOrm(startServer)
