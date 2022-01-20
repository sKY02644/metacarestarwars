"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
const constant_enum_1 = require("../helpers/constant-enum");
const request_error_1 = require("../errors/base-errors/request-error");
class BadRequestError extends request_error_1.CustomRequestError {
    constructor(message) {
        super(message);
        this.message = message;
        this.statusCode = constant_enum_1.Codes.BAD_REQUEST;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message }];
    }
}
exports.BadRequestError = BadRequestError;
