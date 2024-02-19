import { BelongsTo, Column, DataType, ForeignKey, HasOne, Model, Table } from 'sequelize-typescript'
import { Folder } from 'src/folders/folders.model'
import { AccessLink } from 'src/permissions/access-link.model'

@Table({ tableName: 'files' })
export class File extends Model {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number

  @Column({ type: DataType.STRING, allowNull: false })
  name: string

  @Column({ type: DataType.STRING, allowNull: false })
  filePath: string

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isPublic: boolean

  @ForeignKey(() => Folder)
  @Column({ type: DataType.INTEGER })
  folderId: number

  @BelongsTo(() => Folder)
  folder: Folder

  @HasOne(() => AccessLink, { foreignKey: 'linkedId', constraints: false, scope: { linkedType: 'files' }, as: 'link' })
  link: AccessLink

  @ForeignKey(() => AccessLink)
  @Column({ type: DataType.INTEGER })
  linkedId: number
}
