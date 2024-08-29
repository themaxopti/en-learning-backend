import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";

interface UserCreationAttribute {
    email: string
    password: string
}


@Table({ tableName: 'user' })
export class User extends Model<User, UserCreationAttribute> {
    @Column({ type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true })
    id: number

    @Column({ type: DataType.STRING, allowNull: false })
    email: string

    @Column({ type: DataType.STRING, allowNull: false })
    userName: string

}   