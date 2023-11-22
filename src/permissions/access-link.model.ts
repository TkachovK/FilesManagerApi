import { Table, Column, Model, BelongsTo, DataType } from 'sequelize-typescript'
import { Folder } from '../folders/folders.model'
import { File } from 'src/files/files.model'

@Table({ tableName: 'access_links' })
export class AccessLink extends Model<AccessLink> {
  @Column({ type: DataType.STRING })
  link: string

  @Column({ type: DataType.STRING })
  access: string

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  disabled: boolean

  @Column({ type: DataType.INTEGER })
  linkedId: number

  @Column({ type: DataType.STRING })
  linkedType: 'folders' | 'files'

  @BelongsTo(() => Folder, { foreignKey: 'linkedId', targetKey: 'id', constraints: false, as: 'folder' })
  folder: Folder

  @BelongsTo(() => File, { foreignKey: 'linkedId', targetKey: 'id', constraints: false, as: 'file' })
  file: File
}