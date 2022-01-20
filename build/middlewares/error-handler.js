"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = __importDefault(require("../error-logs/logger"));
const request_error_1 = require("../errors/base-errors/request-error");
const errorHandler = (err, req, res, next) => {
    logger_1.default.log({ message: err.message, level: 'error', meta: { stack: err.stack } });
    console.log(err);
    if (err instanceof request_error_1.CustomRequestError) {
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    res.status(400).send({
        errors: [{ message: 'Something went wrong!!' }]
    });
};
exports.errorHandler = errorHandler;
