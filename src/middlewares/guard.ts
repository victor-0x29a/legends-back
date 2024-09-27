import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from "express"
import { LegendHttpError } from "../errors"

export const Guard = async (req: Request, res: Response, next: NextFunction) => {

    const environment = process.env.NODE_ENV

    if (environment === 'test') {
        return next()
    }

    const token = req.headers['authorization'] as string

    if (!token) {
        throw new LegendHttpError(401, 'Token not provided.')
    }

    try {
        await jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        throw new LegendHttpError(401, 'Token invalid.')
    }

    next()
}
