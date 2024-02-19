import { BelongsTo, Column, DataType, Model, Table } from 'sequelize-typescript'
import { File } from 'src/files/files.model'

import { Folder } from '../folders/folders.model'

@Table({ tableName: 'access_links' })
export class AccessLink extends Model {
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
