import * as path from 'node:path'

import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { ServeStaticModule } from '@nestjs/serve-static'

import { AuthModule } from './auth/auth.module'
import { JwtAuthModule } from './auth/jwt/jwt-auth.module'
import { File } from './files/files.model'
import { FilesModule } from './files/files.module'
import { Folder } from './folders/folders.model'
import { FoldersModule } from './folders/folders.module'
import { AccessLink } from './permissions/access-link.model'
import { UserPermission } from './permissions/permissions.model'
import { User } from './users/users.model'

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    ServeStaticModule.forRoot({ rootPath: path.resolve(__dirname, 'static') }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Folder, File, UserPermission, User, AccessLink],
      autoLoadModels: true,
      synchronize: true,
    }),
    AuthModule,
    JwtAuthModule,
    FoldersModule,
    FilesModule,
  ],
})
export class AppModule { }
