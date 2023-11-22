import { Module, forwardRef } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { User } from './users.model'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [SequelizeModule.forFeature([User]), forwardRef(() => AuthModule)],
  exports: [UsersService]
})
export class UsersModule { }
