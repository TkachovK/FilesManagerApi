import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { JwtAuthModule } from 'src/auth/jwt/jwt-auth.module'
import { File } from 'src/files/files.model'
import { FilesModule } from 'src/files/files.module'
import { AccessLink } from 'src/permissions/access-link.model'
import { UserPermission } from 'src/permissions/permissions.model'
import { PermissionsModule } from 'src/permissions/permissions.module'
import { User } from 'src/users/users.model'

import { FolderController } from './folders.controller'
import { Folder } from './folders.model'
import { FolderService } from './folders.service'

@Module({
  controllers: [FolderController],
  providers: [FolderService],
  imports: [
    SequelizeModule.forFeature([Folder, File, UserPermission, User, AccessLink]),
    FilesModule,
    PermissionsModule,
    forwardRef(() => JwtAuthModule),
  ],
  exports: [FolderService],
})
export class FoldersModule { }
