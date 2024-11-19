import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";

interface QuizCreationAttribute {
    title: string
    userId: number | string
}

@Table({ tableName: 'quizzes' })
export class QuizModel extends Model<QuizModel, QuizCreationAttribute>{
    @Column({ type: DataType.INTEGER, unique: true, primaryKey: true,autoIncrement:true })
    id: number

    @Column({ type: DataType.STRING, allowNull: false })
    title: string

    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number
}