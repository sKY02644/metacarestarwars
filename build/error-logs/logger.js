"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require('winston');
exports.default = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: './error-logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './error-logs/combined.log' }),
    ]
});
