import { Module, forwardRef } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { FolderController } from './folders.controller'
import { FolderService } from './folders.service'
import { Folder } from './folders.model'
import { FilesModule } from 'src/files/files.module'
import { File } from 'src/files/files.model'
import { PermissionsModule } from 'src/permissions/permissions.module'
import { User } from 'src/users/users.model'
import { AccessLink } from 'src/permissions/access-link.model'
import { UserPermission } from 'src/permissions/permissions.model'
import { JwtAuthModule } from 'src/auth/jwt/jwt-auth.module'

@Module({
  controllers: [FolderController],
  providers: [FolderService],
  imports: [
    SequelizeModule.forFeature([Folder, File, UserPermission, User, AccessLink]),
    FilesModule,
    PermissionsModule,
    forwardRef(() => JwtAuthModule)
  ],
  exports: [FolderService]
})
export class FoldersModule { }
