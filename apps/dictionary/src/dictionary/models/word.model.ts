import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";

interface WordsCreationAttribute {
    title: string
    translate: string
    dictionaryId: number | string
    index: number
    globalIndex: number
    userId: number
}


@Table({ tableName: 'words' })
export class Word extends Model<Word, WordsCreationAttribute> {
    @Column({ type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true })
    id: number

    @Column({ type: DataType.STRING, allowNull: false })
    title: string

    @Column({ type: DataType.STRING, allowNull: false })
    translate: string

    @Column({ type: DataType.INTEGER })
    dictionaryId: number

    @Column({ type: DataType.INTEGER })
    userId: number

    @Column({ type: DataType.INTEGER })
    index: number

    @Column({ type: DataType.INTEGER, primaryKey: true })
    globalIndex: number
}   