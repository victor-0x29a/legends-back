import { SequelizeAuth } from "./database/connection"
import { UserModel, EntityModel } from "./models";
import WebCore from "./core";

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

export const authenticateOrm = (callback: () => void) => {
    SequelizeAuth.then(() => {
        callback()
    }).catch((e) => {
        console.log(e)
        throw new Error("Failed to connect to the database.")
    })
}

export function startServer () {
    const Core = new WebCore()

    loadEntities(Core)

    Core.start()
}
