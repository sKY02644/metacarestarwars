import { Codes } from 'src/helpers/constant-enum';
import { CustomRequestError } from 'src/errors/base-errors/request-error';

export class NotFoundError extends CustomRequestError {

    statusCode = Codes.NOT_FOUND

    constructor() {
        super('Route not found')
        Object.setPrototypeOf(this, NotFoundError.prototype)
    }

    serializeErrors() {
        return [{ message: 'Not Found' }]
    }
}