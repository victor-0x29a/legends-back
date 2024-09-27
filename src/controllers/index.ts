import type { Controller } from './types'
import EntityController from "./entity.controller";
import UserController from "./user.controller";

export const controllers: Controller[] = [
    [new EntityController().router, '/entity'],
    [new UserController().router, '/user']
]
