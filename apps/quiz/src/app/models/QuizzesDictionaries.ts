import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";

interface CreationAttribute {
    quizId: number
    dictionaryId: number
}

@Table({ tableName: 'quizzes_dictionaries' })
export class QuizzesDictionariesModel extends Model<QuizzesDictionariesModel, CreationAttribute>{
    @Column({ type: DataType.INTEGER, unique: true, primaryKey: true,autoIncrement:true })
    id: number

    @Column({ type: DataType.INTEGER, allowNull: false })
    quizId: number

    @Column({ type: DataType.INTEGER, allowNull: false })
    dictionaryId: number
}