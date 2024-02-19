/* eslint-disable no-use-before-define */
import { Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from 'sequelize-typescript'
import { File } from 'src/files/files.model'
import { AccessLink } from 'src/permissions/access-link.model'
import { UserPermission } from 'src/permissions/permissions.model'

export interface FolderCreationAttrs {
  name: string,
}

@Table({ tableName: 'folders' })
export class Folder extends Model<Folder, FolderCreationAttrs> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number

  @Column({ type: DataType.STRING, allowNull: false })
  name: string

  @HasMany(() => File)
  files: File[]

  @ForeignKey(() => Folder)
  @Column({ type: DataType.INTEGER })
  parentId: number

  @HasMany(() => Folder, 'parentId')
  folders: Folder[]

  @HasOne(() => UserPermission, {
    foreignKey: 'entityId', constraints: false, scope: { entityType: 'folder' }, as: 'permissions',
  })
  permissions: UserPermission

  @HasOne(() => AccessLink, {
    foreignKey: 'linkedId', constraints: false, scope: { linkedType: 'folders' }, as: 'link',
  })
  link: AccessLink

  @ForeignKey(() => AccessLink)
  @Column({ type: DataType.INTEGER })
  linkedId: number
}
