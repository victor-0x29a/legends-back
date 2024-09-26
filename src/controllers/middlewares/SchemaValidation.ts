import type { Request, Response, NextFunction } from 'express'
import type { Schema } from "yup";
import { validateSchema } from '../../utils/validateSchema';

// TODO: add validate by params and query params
export const ValidateSchema = (
    schema: Schema,
) =>
    async (req: Request, _res: Response, next: NextFunction) => {

        const data = req.body

        const schemaValidationResult = await validateSchema(schema, data)

        req.body = schemaValidationResult

        return next()
    }
