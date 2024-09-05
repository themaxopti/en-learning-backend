import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";

interface UserCreationAttribute {
    email: string
    userName: string
    password: string
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttribute> {
    @Column({ type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true })
    id: number

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    email: string

    @Column({ type: DataType.STRING, allowNull: false })
    userName: string

    @Column({ type: DataType.STRING, allowNull: false })
    password: string

    @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
    token: string | null
}   