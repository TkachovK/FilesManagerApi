import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { File } from 'src/files/files.model'
import { Folder } from 'src/folders/folders.model'
import { User } from 'src/users/users.model'

import { AccessLink } from './access-link.model'
import { UserPermission } from './permissions.model'
import { UserPermissionsService } from './permissions.service'

@Module({
  controllers: [],
  imports: [SequelizeModule.forFeature([UserPermission, File, Folder, AccessLink, User])],
  providers: [UserPermissionsService],
  exports: [UserPermissionsService],
})
export class PermissionsModule { }
