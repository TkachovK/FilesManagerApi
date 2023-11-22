import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './jwt-auth.strategy'

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) { }

  login(user) {
    const payload: JwtPayload = { name: user.name, sub: user.id, email: user.email, avatar: user.avatar }

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: `${process.env.JWT_SECRET}`,
        expiresIn: '7d'
      }),
    }
  }
}