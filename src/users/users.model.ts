import { Column, DataType, Model, Table } from 'sequelize-typescript'

interface UserCreationAttrs {
  email: string,
}

@Table({ tableName: 'users' })
export class User extends Model<UserCreationAttrs> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string

  @Column({ type: DataType.STRING })
    avatar: string

  @Column({ type: DataType.STRING, allowNull: false })
    name: string
}
