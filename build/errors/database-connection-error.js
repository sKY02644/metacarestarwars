"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectionError = void 0;
const constant_enum_1 = require("../helpers/constant-enum");
const request_error_1 = require("./base-errors/request-error");
class DatabaseConnectionError extends request_error_1.CustomRequestError {
    constructor() {
        super('Error connecting to database');
        this.statusCode = constant_enum_1.Codes.INTERNALE_SERVER_ERROR;
        this.reason = 'Error connecting to database';
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
    serializeErrors() {
        return [
            { message: this.reason }
        ];
    }
}
exports.DatabaseConnectionError = DatabaseConnectionError;
