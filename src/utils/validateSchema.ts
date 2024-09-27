import type { Schema } from "yup";

export const validateSchema = async <BodyValidateType, ReturnType>(schema: Schema, values: BodyValidateType) => {
    return await schema.validate(values, { stripUnknown: true }) as ReturnType
}
