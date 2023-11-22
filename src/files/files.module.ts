import { Module, forwardRef } from '@nestjs/common'
import { PermissionsModule } from 'src/permissions/permissions.module'
import { User } from 'src/users/users.model'
import { AccessLink } from 'src/permissions/access-link.model'
import { JwtAuthModule } from 'src/auth/jwt/jwt-auth.module'
import { FilesService } from './files.service'
import { FilesController } from './files.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { File } from './files.model'

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    SequelizeModule.forFeature([File, User, AccessLink]), 
    PermissionsModule,
    forwardRef(() => JwtAuthModule)
  ],
  exports: [FilesService],
})
export class FilesModule { }
