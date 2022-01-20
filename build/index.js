"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const winston = require('winston');
require('dotenv').config();
const SequelizeTransport = require('winston-transport-sequelize');
const error_handler_1 = require("./middlewares/error-handler");
const not_found_error_1 = require("./errors/not-found-error");
const logger_1 = __importDefault(require("./error-logs/logger"));
const models_1 = __importDefault(require("./models"));
const comment_1 = __importDefault(require("./controllers/comment"));
const movie_1 = __importDefault(require("./controllers/movie"));
const character_1 = __importDefault(require("./controllers/character"));
// initialize express app 1
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('tiny'));
app.use((0, helmet_1.default)());
app.set('trust proxy', true);
app.use((0, cors_1.default)({
    origin: ['*'],
    credentials: true,
    exposedHeaders: ["set-cookie"]
}));
app.use((0, body_parser_1.json)());
/**
 * Character routes
 */
app.get('/api/characters', character_1.default.get_characters);
/**
 * Movies routes
 */
app.get('/api/movies', movie_1.default.get_movies);
/**
 * Comment Routes
 */
app.get('/api/comment', comment_1.default.get_comments);
app.post('/api/comment', comment_1.default.add_comment);
// 404 ROUTES
app.all('*', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    throw new not_found_error_1.NotFoundError();
}));
// catch all 404 errors
app.use(error_handler_1.errorHandler); //
// sequelize configs
const options = {
    sequelize: models_1.default.sequelize,
    tableName: 'metacaretesterror',
    meta: { project: 'metacaretesterrors' },
    fields: { meta: models_1.default.Sequelize.JSON },
    modelOptions: { timestamps: true }, // merge model options
};
const port = process.env.PORT || 4546;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.add(new SequelizeTransport(options));
    try {
        // for debuging purposes only [dev =>  development && dev => testing]
        yield models_1.default.sequelize.authenticate();
        console.log('Connection has been established successfully.');
        // sync all models with database set to false in production for testing and development env. only use migrations for production
        // await db.sequelize.sync({ force: true })
    }
    catch (error) {
        console.error('Unable to connect to the database:', error.message);
    }
    app.listen(port, () => {
        if (process.env.NODE_ENV !== 'production') { //
            logger_1.default.add(new winston.transports.Console({
                format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            }));
            logger_1.default.info(`Listening on port ${port}`);
        }
        else {
            console.log(`Listening on port ${port}`);
        }
    });
});
start();
