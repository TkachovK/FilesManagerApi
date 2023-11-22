import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Folder } from 'src/folders/folders.model'
import { File } from 'src/files/files.model'
import { AccessLink } from './access-link.model'
import { UserPermissionsService } from './permissions.service'
import { UserPermission } from './permissions.model'
import { User } from 'src/users/users.model'

@Module({
  controllers: [],
  imports: [SequelizeModule.forFeature([UserPermission, File, Folder, AccessLink, User])],
  providers: [UserPermissionsService],
  exports: [UserPermissionsService]
})
export class PermissionsModule { }