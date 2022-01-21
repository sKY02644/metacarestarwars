import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
const winston = require('winston')

require('dotenv').config()

const SequelizeTransport = require('winston-transport-sequelize')
import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'
import winston_logger from './error-logs/logger'

import db from './models'

import Comment from './controllers/comment'
import Movie from './controllers/movie'
import Character from './controllers/character'

// initialize express app 1
const app = express()
  
app.use(morgan('tiny'))

app.use(helmet())

app.set('trust proxy', true)
app.use(cors({
        origin: ['*'],
        credentials: true,
        exposedHeaders: ["set-cookie"]
    })
)

app.use(json())

/**
 * Character routes
 */
app.get('/api/characters', Character.get_characters)

/**
 * Movies routes
 */
app.get('/api/movies', Movie.get_movies)

/**
 * Comment Routes
 */
app.get('/api/comment', Comment.get_comments)

app.post('/api/comment', Comment.add_comment)

// 404 ROUTES
app.all('*', async (req, res) => {
    throw new NotFoundError()
})

// catch all 404 errors
app.use(errorHandler) //

// sequelize configs
const options = {
    sequelize: db.Sequelize, // sequelize instance [required]
    tableName: 'metacaretesterror', // default name
    meta: { project: 'metacaretesterrors' }, // meta object defaults
    fields: { meta: db.json }, // merge model fields
    modelOptions: { timestamps: true }, // merge model options
}

const port = process.env.PORT || 4546

const start = async () => {
    
    try {
        // winston_logger.add(new SequelizeTransport(options))
        // for debuging purposes only [dev =>  development && dev => testing]
        await db.authenticate()
        console.log('Connection has been established successfully.')
        // sync all models with database set to false in production for testing and development env. only use migrations for production
        await db.sync()

    } catch (error: any) {
        console.error(error)
    }

    app.listen(port, () => {
        if (process.env.NODE_ENV !== 'production') {//
            winston_logger.add(new winston.transports.Console({
                format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            }))
            winston_logger.info(`Listening on port ${port}`)
        }else{
            console.log(`Listening on port ${port}`)
        }
    })
}

start()