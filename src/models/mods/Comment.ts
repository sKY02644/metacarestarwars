// @/models.ts
import { Table, Model, Column, DataType } from "sequelize-typescript";
import { Utils } from '../../helpers/utils';

  @Table({
    timestamps: true,
    tableName: "comments",
  })
 export class Comment extends Model {

    @Column({ 
      type: DataType.UUID,
      unique: true,
      primaryKey: true,
      autoIncrement: false,
      defaultValue: () => {
        return Utils.randomUUID()
      }
    })
    id!: string

    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    movie_title!: string

    @Column({
      type: DataType.STRING(500),
      allowNull: false,
    })
    comment!: string

    @Column({
      type: DataType.STRING,
      allowNull: false,
      validate: {
          isIP: true
      }
    })
    ip_address!: string

    @Column({
      type: DataType.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    })
    commenter!: boolean


  }