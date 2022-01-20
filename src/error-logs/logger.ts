const winston = require('winston');

export default winston.createLogger({
    transports: [
        new winston.transports.File({ filename: './error-logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './error-logs/combined.log' }),
    ]
});