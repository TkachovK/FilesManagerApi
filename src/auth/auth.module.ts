import { forwardRef, Module } from '@nestjs/common'
import { UsersModule } from 'src/users/users.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { GoogleStrategy } from './google.strategy'
import { JwtAuthModule } from './jwt/jwt-auth.module'

@Module({
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
  imports: [forwardRef(() => UsersModule), JwtAuthModule],
  exports: [AuthService],
})
export class AuthModule { }
