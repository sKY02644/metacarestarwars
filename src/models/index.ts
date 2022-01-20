'use strict'

const env = process.env.NODE_ENV || 'development'
import { Sequelize } from 'sequelize-typescript'
import { Comment } from './Comment'

import cls from 'cls-hooked'
const namespace = cls.createNamespace('metacaretestnamespace')

let sequelize: any

if (process.env.CLEARDB_DATABASE_URL && env === 'production') {
  sequelize = new Sequelize('mysql://b28c7e0f1608c2:db2987cd@us-cdbr-east-05.cleardb.net/heroku_42fbf93b3d1d2b3?reconnect=true', {
    define: {
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      freezeTableName: false,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  })
} else {
  sequelize = new Sequelize({
    username: 'root',
    password: '****************',
    database: "metacaretest",
    host: 'localhost',
    dialect: 'mysql',
    define: {
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      freezeTableName: false,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  })
}

Sequelize.useCLS(namespace)

sequelize.addModels([Comment])
sequelize.addModels([__dirname + './models'])

export default sequelize