require('dotenv').config()

module.exports = {
  development: {
    username: 'root',
    password: '************',
    database: "metacaretest",
    host: 'localhost',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  //  logging: (msg) => winston_logger.info(msg),
    define: {
      underscored: true,
      underscoredAll: true,
      freezeTableName: false,
      syncOnAssociation: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      classMethods: { method1: function () { } },
      instanceMethods: { method2: function () { } },
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    port: process.env.PROD_DB_PORT,
    dialect: 'mysql',
  }
}
