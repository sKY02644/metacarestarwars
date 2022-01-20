'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
console.dir("-----------------------ENVIRONMENT----------------------: " + config.password);
const db = {};
const cls = require('cls-hooked');
const namespace = cls.createNamespace('metacaretestnamespace');
let sequelize;
console.log(process.env.CLEARDB_DATABASE_URL);
if (process.env.CLEARDB_DATABASE_URL && process.env.NODE_ENV === 'production') {
    sequelize = new Sequelize('mysql://b28c7e0f1608c2:db2987cd@us-cdbr-east-05.cleardb.net/heroku_42fbf93b3d1d2b3?reconnect=true'); // for production
}
else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}
fs
    .readdirSync(__dirname)
    .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.ts');
})
    .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
});
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
Sequelize.useCLS(namespace);
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.namespace = namespace;
exports.default = db;
