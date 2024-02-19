import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { JwtAuthModule } from 'src/auth/jwt/jwt-auth.module'
import { AccessLink } from 'src/permissions/access-link.model'
import { PermissionsModule } from 'src/permissions/permissions.module'
import { User } from 'src/users/users.model'

import { FilesController } from './files.controller'
import { File } from './files.model'
import { FilesService } from './files.service'

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    SequelizeModule.forFeature([File, User, AccessLink]),
    PermissionsModule,
    forwardRef(() => JwtAuthModule),
  ],
  exports: [FilesService],
})
export class FilesModule { }
