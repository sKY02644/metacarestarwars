"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomRequestError = void 0;
class CustomRequestError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, CustomRequestError.prototype);
    }
}
exports.CustomRequestError = CustomRequestError;
