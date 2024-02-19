import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'

export type JwtPayload = { sub?: number; name: string, email: string, avatar: string }
export type GoogleUser = { id: number; username: string; email: string; avatar: string }

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const extractJwtFromCookie = req => {
      let token = null

      if (req && req.cookies) {
        token = req.cookies['jwt']
      }
      return token
    }

    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrPrivateKey: configService.get<string>('JWT_SECRET'),
    })
  }

  async validate(payload: JwtPayload): Promise<GoogleUser> {
    return { id: payload.sub, username: payload.name, email: payload.email, avatar: payload.avatar }
  }
}
