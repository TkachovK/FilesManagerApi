import { Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'

import { JwtAuthService } from './jwt/jwt-auth.service'

import type { Request, Response } from 'express'
import type { User } from 'src/users/users.model'

export interface AuthenticatedRequest extends Request {
  user: User;
}

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private jwtAuthService: JwtAuthService) { }

  async googleLogin(req: AuthenticatedRequest, res: Response): Promise<void> {
    const user = await this.userService.getUserByEmail(req.user.email)
    if (!user) {
      await this.userService.createUser(req.user)
    }

    const { accessToken } = this.jwtAuthService.login(req.user)
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
    })

    return res.redirect(`${process.env.CLIENT_URL}/landing?token=${accessToken}`)
  }
}
