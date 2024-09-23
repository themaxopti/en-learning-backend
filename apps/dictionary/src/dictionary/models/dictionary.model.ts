import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";

interface DictionaryCreationAttribute {
    title: string
    userId: number | string
}


@Table({ tableName: 'dictionaries' })
export class Dictionary extends Model<Dictionary, DictionaryCreationAttribute>{
    @Column({ type: DataType.INTEGER, unique: true, primaryKey: true,autoIncrement:true })
    id: number

    @Column({ type: DataType.STRING, allowNull: false })
    title: string

    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number
}   