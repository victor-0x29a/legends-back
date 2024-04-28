import * as Yup from 'yup'
import { NextFunction } from "express"
import { LegendHttpError } from './errors'

export const HandlerException = (error: any, req, res, next: NextFunction) => {
    if (error instanceof Yup.ValidationError) {
        return res.status(400).json({ errorList: error.errors })
    }

    if (error instanceof LegendHttpError) {
        return res.status(error.status).json({ errorList: [error.message] })
    }

    console.warn(error)

    return res.status(500).json({ errorList: ['Internal server error.'] })
}