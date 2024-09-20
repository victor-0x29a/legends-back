import type { Controller } from './types'
import EntityController from "./entity.controller";
import LogController from "./logs.controller";
import UserController from "./user.controller";

export const controllers: Controller[] = [
    [new EntityController().router, '/entity'],
    [new UserController().router, '/user'],
    [new LogController().router, '/log']
]
