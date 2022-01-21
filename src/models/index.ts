'use strict'

const env = process.env.NODE_ENV || 'development'
import { Sequelize } from 'sequelize-typescript'
import { Comment } from './mods/Comment'

import cls from 'cls-hooked'
const namespace = cls.createNamespace('metacaretestnamespace')

let sequelize: any

if (process.env.JAWSDB_URL && env === 'production') {
  sequelize = new Sequelize(process.env.JAWSDB_URL, {
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
    password: '01161391D@Maymens',
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

if(env === 'production') {
  sequelize.addModels([__dirname + '/mods/*.js'])
}else{
  sequelize.addModels([__dirname + '/mods/*.ts'])
}

export default sequelize