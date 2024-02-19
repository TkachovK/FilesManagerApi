import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { File } from 'src/files/files.model'
import { Folder } from 'src/folders/folders.model'
import { User } from 'src/users/users.model'

import type { Permissions } from 'src/enums/permissions.enum'

@Table({ tableName: 'user_permissions' })
export class UserPermission extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number

  @Column({ type: DataType.ENUM('view', 'edit', 'creator'), allowNull: false })
  permissions: Permissions

  @BelongsTo(() => User)
  user: User

  @Column({ type: DataType.INTEGER })
  entityId: number

  @Column({ type: DataType.STRING })
  entityType: 'folder' | 'file'

  @BelongsTo(() => Folder, { foreignKey: 'entityId', constraints: false, targetKey: 'id', as: 'folder' })
  folder: Folder

  @BelongsTo(() => File, { foreignKey: 'entityId', constraints: false, targetKey: 'id', as: 'file' })
  file: File
}
