'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const utils_1 = require("../helpers/utils");
module.exports = (sequelize, DataTypes) => {
    class Comment extends sequelize_1.Model {
    }
    Comment.init({
        id: {
            type: DataTypes.UUID,
            unique: true,
            primaryKey: true,
            autoIncrement: false,
            defaultValue: () => {
                return utils_1.Utils.randomUUID();
            }
        },
        movie_title: DataTypes.STRING,
        comment: {
            type: DataTypes.STRING(500)
        },
        ip_address: {
            type: DataTypes.STRING,
            validate: {
                isIP: true
            }
        },
        commenter: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Comment',
    });
    return Comment;
};
