import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import type { JwtPayload } from './jwt-auth.strategy'

export interface PayloadWithId extends JwtPayload {
  id: number;
}

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) { }

  login(user: PayloadWithId): { accessToken: string } {
    const payload: JwtPayload = { name: user.name, sub: user.id, email: user.email, avatar: user.avatar }

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: `${process.env.JWT_SECRET}`,
        expiresIn: '7d',
      }),
    }
  }
}
