'use strict';
import { Model, Optional } from 'sequelize'
import { Utils } from '../helpers/utils';

interface CommentAttributes {
  id: string
  movie_title: string
  comment: string
  ip_address: string
  commenter: string
}

interface CommentCreationAttr extends Optional<CommentAttributes, 'id'> { }

module.exports = (sequelize: any, DataTypes: any) => {
  class Comment extends Model<CommentAttributes, CommentCreationAttr> implements CommentAttributes {

    public id!: string
    public movie_title!: string
    public comment!: string
    public ip_address!: string
    public commenter!: string

    public readonly created_at!: Date
    public readonly update_at!: Date

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
 
  }

  Comment.init({
    id: {
      type: DataTypes.UUID,
      unique: true,
      primaryKey: true,
      autoIncrement: false,
      defaultValue: () => {
        return Utils.randomUUID()
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
  })

  return Comment
};