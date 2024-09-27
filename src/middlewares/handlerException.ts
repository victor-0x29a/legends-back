import * as Yup from 'yup'
import { LegendHttpError } from '../errors'
import type { Response } from 'express'

export const HandlerException = (
    error: any,
    _req,
    res: Response,
    _next
) => {
    if (error instanceof Yup.ValidationError) {
        return res.status(400).json({ errorList: error.errors })
    }

    if (error instanceof LegendHttpError) {
        return res.status(error.status).json({ errorList: [error.message] })
    }

    console.warn(error)

    return res.status(500).json({ errorList: ['Internal server error.'] })
}
