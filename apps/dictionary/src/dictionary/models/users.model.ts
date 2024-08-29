import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
// import {ApiProperty} from "@nestjs/swagger";

interface UserCreationAttribute {
    email: string
    password: string
}


@Table({ tableName: 'test' })
export class User extends Model<User, UserCreationAttribute>{
    // @ApiProperty({example:'1',description:'Уникальный индефентикатор'})
    @Column({ type: DataType.INTEGER, unique: true, primaryKey: true,autoIncrement:true })
    id: number

    // @ApiProperty({example:'some@gmail.com',description:'Емейл'})
    @Column({ type: DataType.STRING, allowNull: false })
    email: string
}   