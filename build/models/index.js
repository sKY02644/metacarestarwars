'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env = process.env.NODE_ENV || 'development';
const sequelize_typescript_1 = require("sequelize-typescript");
const cls_hooked_1 = __importDefault(require("cls-hooked"));
const namespace = cls_hooked_1.default.createNamespace('metacaretestnamespace');
let sequelize;
if (process.env.JAWSDB_URL && env === 'production') {
    sequelize = new sequelize_typescript_1.Sequelize(process.env.JAWSDB_URL, {
        define: {
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
            freezeTableName: false,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    });
}
else {
    sequelize = new sequelize_typescript_1.Sequelize({
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
    });
}
sequelize_typescript_1.Sequelize.useCLS(namespace);
// sequelize.addModels([Comment])
console.log(__dirname + '/**/*.ts');
sequelize.addModels([__dirname + '/mods/*.ts']);
exports.default = sequelize;
