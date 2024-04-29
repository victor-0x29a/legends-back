import { User } from "../models/user.model";

export const parseUser = (user: User) => ({
    id: user.id,
    name: user.name,
    username: user.username
})