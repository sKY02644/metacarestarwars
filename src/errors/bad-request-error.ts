import { Codes } from '../helpers/constant-enum';
import { CustomRequestError } from '../errors/base-errors/request-error';

export class BadRequestError extends CustomRequestError {

    statusCode = Codes.BAD_REQUEST

    constructor(public message: string) {
        super(message)
        Object.setPrototypeOf(this, BadRequestError.prototype)
    }

    serializeErrors() {
        return [{ message: this.message }]
    }

}