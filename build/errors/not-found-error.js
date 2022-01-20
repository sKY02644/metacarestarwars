"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const constant_enum_1 = require("../helpers/constant-enum");
const request_error_1 = require("../errors/base-errors/request-error");
class NotFoundError extends request_error_1.CustomRequestError {
    constructor() {
        super('Route not found');
        this.statusCode = constant_enum_1.Codes.NOT_FOUND;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serializeErrors() {
        return [{ message: 'Not Found' }];
    }
}
exports.NotFoundError = NotFoundError;
