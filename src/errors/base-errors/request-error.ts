import { Codes } from '../../helpers/constant-enum'

export abstract class CustomRequestError extends Error {

    abstract statusCode: Codes

    constructor(message: string) {
        super(message)
        Object.setPrototypeOf(this, CustomRequestError.prototype)
    }

    abstract serializeErrors(): { message: string, field?: string }[]
}