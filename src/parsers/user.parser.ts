import { User } from "../models";

export const parseUser = (user: User) => ({
    id: user.id,
    name: user.name,
    username: user.username
})
